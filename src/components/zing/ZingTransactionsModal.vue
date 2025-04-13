<template>
  <div class="transactions-modal zing-transactions-modal" v-show="show">
    <div class="modal-backdrop" @click="$emit('close')"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ effectiveNetwork === 'mainnet' ? 'Mainnet' : 'Testnet' }} Transactions</h2>
        <button class="close-button" @click="$emit('close')">×</button>
      </div>

      <div class="modal-body">
        <div v-if="isLoading" class="loading-indicator">
          <div class="spinner"></div>
          <p>Loading transactions...</p>
        </div>

        <div v-else-if="transactions.length === 0" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="empty-icon">
            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5zm0 0c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3z" fill="currentColor"/>
          </svg>
          <p v-if="effectiveNetwork === 'mainnet'">No transactions found on Mainnet.</p>
          <p v-else>No transactions found.</p>
          <p v-if="effectiveNetwork === 'mainnet'" class="hint">
            Try creating a transaction on the Mainnet network first.
          </p>
          <p v-else class="hint">
            No transactions have been made yet.
          </p>
        </div>

        <div v-else-if="filteredTransactions.length > 0" class="transactions-table-container">
          <table class="transactions-table">
            <thead>
              <tr>
                <th>Transaction Hash</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Token Type</th>
                <th>Chain</th>
                <th>Destination</th>
                <th>Status</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tx in filteredTransactions" :key="tx.transactionHash" @click="openTransactionDetails(tx)">
                <td class="tx-id">
                  <div class="tx-cell">
                    <span>{{ truncateHash(tx.transactionHash) }}</span>
                    <div class="copy-tooltip">
                      <button class="copy-button" @click.stop="copyToClipboard(tx.transactionHash)">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor"/>
                        </svg>
                      </button>
                      <span class="tooltip-text">Copy Hash</span>
                    </div>
                  </div>
                </td>
                <td class="date-cell">{{ formatDate(tx.timestamp) }}</td>
                <td>{{ formatAmount(tx.amount) }}</td>
                <td class="token-type">{{ tx.tokenType ? tx.tokenType.toUpperCase() : 'USDC' }}</td>
                <td class="chain-cell">{{ formatChain(tx.chain) }}</td>
                <td class="address">{{ truncateAddress(tx.destinationAddress) }}</td>
                <td>
                  <span class="status-badge" :class="tx.status.toLowerCase()">
                    {{ tx.status }}
                  </span>
                </td>
                <td>{{ tx.email }}</td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination controls -->
          <div class="pagination-controls" v-if="totalPages > 1">
            <div class="pagination-info">
              Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} - {{ Math.min(currentPage * itemsPerPage, sortedTransactions.length) }} of {{ sortedTransactions.length }} transactions
            </div>
            <div class="pagination-buttons">
              <button
                class="pagination-button"
                :disabled="currentPage === 1"
                @click="goToPage(1)"
                :class="{ 'disabled': currentPage === 1 }"
              >
                &laquo;
              </button>
              <button
                class="pagination-button"
                :disabled="currentPage === 1"
                @click="goToPage(currentPage - 1)"
                :class="{ 'disabled': currentPage === 1 }"
              >
                &lsaquo;
              </button>

              <span class="pagination-current">{{ currentPage }} / {{ totalPages }}</span>

              <button
                class="pagination-button"
                :disabled="currentPage === totalPages"
                @click="goToPage(currentPage + 1)"
                :class="{ 'disabled': currentPage === totalPages }"
              >
                &rsaquo;
              </button>
              <button
                class="pagination-button"
                :disabled="currentPage === totalPages"
                @click="goToPage(totalPages)"
                :class="{ 'disabled': currentPage === totalPages }"
              >
                &raquo;
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="modal-button secondary" @click="$emit('close')">Close</button>
        <button class="modal-button primary" @click="refreshTransactions">Refresh</button>
      </div>
    </div>

    <!-- Transaction Detail Modal -->
    <zing-transaction-detail-modal
      :show="showTransactionDetailModal"
      :transaction-hash="selectedTransactionHash"
      :network="effectiveNetwork"
      :chain="selectedTransactionChain"
      @close="closeTransactionDetailModal"
    />
  </div>
</template>

<script>
import { fetchTransactions } from './ZingAPI'
import ZingTransactionDetailModal from './ZingTransactionDetailModal.vue'
import './styles/ZingModalStyles.css'
import './styles/ZingTransactionsModalStyles.css'

export default {
  name: 'ZingTransactionsModal',
  components: {
    ZingTransactionDetailModal
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    network: {
      type: String,
      required: true,
      validator: value => ['testnet', 'mainnet'].includes(value)
    }
  },
  data () {
    return {
      transactions: [],
      isLoading: false,
      clipboardMessage: '',
      showTransactionDetailModal: false,
      selectedTransactionHash: '',
      selectedTransactionChain: '',
      currentPage: 1,
      itemsPerPage: 10
    }
  },
  computed: {
    effectiveNetwork () {
      // First, check if there's a matching network from the dashboard
      if (this.$root && this.$root.currentNetwork === 'mainnet') {
        return 'mainnet'
      }

      // Next, check for mainnet in the prop with case insensitivity
      if (this.network === 'mainnet' ||
          this.network === 'Mainnet' ||
          (typeof this.network === 'string' && this.network.toLowerCase() === 'mainnet')) {
        return 'mainnet'
      }

      // Finally, use the prop as is for non-mainnet
      return this.network
    },

    // Sort transactions by timestamp (latest first) and then paginate
    sortedTransactions () {
      // Create a copy of the transactions array to avoid mutating the original
      return [...this.transactions].sort((a, b) => {
        const dateA = new Date(a.timestamp || 0)
        const dateB = new Date(b.timestamp || 0)
        return dateB - dateA // Sort descending (latest first)
      })
    },

    // Get only the transactions for the current page
    filteredTransactions () {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage
      const endIndex = startIndex + this.itemsPerPage
      return this.sortedTransactions.slice(startIndex, endIndex)
    },

    // Calculate total pages
    totalPages () {
      return Math.ceil(this.sortedTransactions.length / this.itemsPerPage)
    }
  },
  created () {
    // Initialization handled by computed properties
  },
  methods: {
    async loadTransactions () {
      this.transactions = []
      this.isLoading = true
      this.currentPage = 1 // Reset to first page when loading new data

      try {
        // Get the currently selected chain from the dashboard if available
        let selectedChain = this.$root && this.$root.currentChain
          ? this.$root.currentChain
          : null

        // Ensure the correct chain parameter is used based on the network
        if (selectedChain) {
          // Convert to lowercase for case-insensitive comparison
          const chainLower = selectedChain.toLowerCase()

          // If we're on mainnet, make sure we're using the correct chain values
          if (this.effectiveNetwork === 'mainnet') {
            // For mainnet: 'eth', 'bnb', 'avax'
            if (chainLower === 'sepolia') {
              selectedChain = 'eth'
            } else if (['bnbtestnet', 'tbnb'].includes(chainLower)) {
              selectedChain = 'bnb'
            } else if (['avaxfuji', 'avaxFuji'].includes(chainLower)) {
              selectedChain = 'avax'
            }
          } else {
            // For testnet: 'sepolia', 'bnbTestnet', 'avaxFuji'
            if (chainLower === 'eth') {
              selectedChain = 'sepolia'
            } else if (chainLower === 'bnb') {
              selectedChain = 'bnbTestnet'
            } else if (chainLower === 'avax') {
              selectedChain = 'avaxFuji'
            }
          }
        }

        const data = await fetchTransactions(this.effectiveNetwork, selectedChain)
        this.transactions = data
      } catch (error) {
        // Error handling without logging
        this.transactions = []
      } finally {
        this.isLoading = false
      }
    },
    refreshTransactions () {
      this.currentPage = 1 // Reset to first page when refreshing
      this.loadTransactions()
    },
    truncateHash (hash) {
      if (!hash) return 'N/A'
      if (hash.length <= 10) return hash
      return hash.substring(0, 10) + '...' + hash.substring(hash.length - 8)
    },
    truncateAddress (address) {
      if (!address) return 'N/A'
      if (address.length <= 10) return address
      return address.substring(0, 6) + '...' + address.substring(address.length - 4)
    },
    formatDate (dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    formatAmount (amount) {
      if (!amount) return 'N/A'
      return `${amount.value} ${amount.currency}`
    },
    copyToClipboard (text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          this.clipboardMessage = 'Copied!'
          setTimeout(() => {
            this.clipboardMessage = ''
          }, 2000)
        })
        .catch(err => {
          // Use the err parameter to satisfy lint rule
          const errorMsg = err.message || 'Failed to copy'
          this.clipboardMessage = errorMsg
          setTimeout(() => {
            this.clipboardMessage = ''
          }, 2000)
        })
    },
    openTransactionDetails (transaction) {
      this.selectedTransactionHash = transaction.transactionHash
      this.selectedTransactionChain = transaction.chain
      this.showTransactionDetailModal = true
    },
    closeTransactionDetailModal () {
      this.showTransactionDetailModal = false
      this.selectedTransactionHash = ''
      this.selectedTransactionChain = ''
    },
    goToPage (page) {
      this.currentPage = page
    },
    formatChain (chain) {
      if (!chain) return 'N/A'

      const chainLower = chain.toLowerCase()

      // Map chain names to user-friendly display names
      switch (chainLower) {
        case 'sepolia':
          return 'Sepolia (Testnet)'
        case 'eth':
          return 'Ethereum'
        case 'bnb':
          return this.effectiveNetwork === 'mainnet' ? 'BNB Chain' : 'BNB (Testnet)'
        case 'bnbtestnet':
        case 'tbnb':
          return 'BNB (Testnet)'
        case 'avaxfuji':
          return 'Avalanche (Fuji)'
        case 'avax':
          return this.effectiveNetwork === 'mainnet' ? 'Avalanche' : 'Avalanche (Fuji)'
        case 'arb':
          return 'Arbitrum'
        default:
          // Return capitalized first letter of chain name
          return chain.charAt(0).toUpperCase() + chain.slice(1)
      }
    }
  },
  watch: {
    show (newVal) {
      if (newVal) {
        this.loadTransactions()
      }
    },
    network () {
      if (this.show) {
        this.loadTransactions()
      }
    },
    '$root.currentNetwork' () {
      if (this.show) {
        this.loadTransactions()
      }
    }
  }
}
</script>

<style scoped>
.transactions-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -1;
}

.modal-content {
  background-color: white;
  width: 85%;
  max-width: 1200px;
  max-height: 85vh;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #2c3e50;
}

.close-button {
  background: transparent;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding: 0;
  margin: -10px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.close-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #333;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.modal-button {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  outline: none;
}

.modal-button.primary {
  background-color: #42b983;
  color: white;
}

.modal-button.primary:hover {
  background-color: #3aa876;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(66, 185, 131, 0.3);
}

.modal-button.secondary {
  background-color: transparent;
  color: #42b983;
  border: 1px solid #42b983;
}

.modal-button.secondary:hover {
  background-color: rgba(66, 185, 131, 0.1);
  transform: translateY(-2px);
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 40px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(66, 185, 131, 0.3);
  border-radius: 50%;
  border-top-color: #42b983;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 40px 0;
  color: #666;
}

.empty-icon {
  width: 60px;
  height: 60px;
  color: #aaa;
  margin-bottom: 20px;
}

.empty-state p {
  margin: 5px 0;
  font-size: 1.1rem;
}

.empty-state .hint {
  font-size: 0.9rem;
  color: #888;
  max-width: 350px;
  text-align: center;
}

.transactions-table-container {
  width: 100%;
  overflow-x: auto;
}

.transactions-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.95rem;
}

.transactions-table th,
.transactions-table td {
  padding: 12px 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.transactions-table th {
  font-weight: 600;
  color: #555;
  background-color: rgba(0, 0, 0, 0.02);
}

.transactions-table td {
  color: #333;
}

.transactions-table thead tr:hover {
  background-color: transparent;
  transform: none;
  box-shadow: none;
}

.transactions-table tbody tr {
  cursor: pointer;
}

.transactions-table tbody tr:hover {
  background-color: rgba(66, 185, 131, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(66, 185, 131, 0.15);
  transition: all 0.3s ease;
  color: inherit;
}

.status-badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.success {
  background-color: rgba(66, 185, 131, 0.1);
  color: #42b983;
}

.status-badge.pending {
  background-color: rgba(245, 159, 0, 0.1);
  color: #f59f00;
}

.status-badge.failed {
  background-color: rgba(224, 49, 49, 0.1);
  color: #e03131;
}

.tx-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tx-id, .address {
  font-family: monospace;
  letter-spacing: 0.5px;
  font-size: 0.85rem;
  font-weight: 500;
}

.date-cell {
  white-space: nowrap;
  min-width: 180px;
}

.chain-cell {
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  color: #42b983;
}

.copy-tooltip {
  position: relative;
  display: inline-block;
}

.copy-button {
  background: transparent;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.copy-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #555;
}

.tooltip-text {
  visibility: hidden;
  width: 80px;
  background-color: #555;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -40px;
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 0.8rem;
  pointer-events: none;
}

.tooltip-text::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.copy-tooltip:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

/* Dark Mode Styles for modal elements only */
.dark-mode .modal-content {
  background-color: #1e1e1e;
  border-color: #333;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}

.dark-mode .modal-header {
  border-bottom-color: #333;
}

.dark-mode .modal-header h2 {
  color: #4fd1a5;
}

.dark-mode .close-button {
  color: #bbb;
}

.dark-mode .loading-indicator p {
  color: #e0e0e0;
}

.dark-mode .close-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.dark-mode .modal-footer {
  border-top-color: #333;
}

.dark-mode .modal-button.primary {
  background-color: #4fd1a5;
  color: #121212;
}

.dark-mode .modal-button.primary:hover {
  background-color: #3cb28f;
  box-shadow: 0 4px 8px rgba(79, 209, 165, 0.3);
}

.dark-mode .modal-button.secondary {
  color: #4fd1a5;
  border-color: #4fd1a5;
}

.dark-mode .modal-button.secondary:hover {
  background-color: rgba(79, 209, 165, 0.2);
  color: #fff;
}

.dark-mode .spinner {
  border-color: rgba(79, 209, 165, 0.3);
  border-top-color: #4fd1a5;
}

.dark-mode .empty-state {
  color: #bbb;
}

.dark-mode .empty-icon {
  color: #666;
}

.dark-mode .empty-state .hint {
  color: #aaa;
}

@media (max-width: 767px) {
  .modal-content {
    width: 95%;
    max-height: 90vh;
  }
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.pagination-info {
  font-size: 0.9rem;
  color: #666;
}

.pagination-buttons {
  display: flex;
  align-items: center;
}

.pagination-button {
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 5px 10px;
  margin: 0 5px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.pagination-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.pagination-button.disabled {
  color: #ccc;
  cursor: not-allowed;
}

.pagination-current {
  font-weight: 600;
}

.dark-mode .copy-button:hover {
  background-color: rgba(79, 209, 165, 0.2);
  color: #ffffff;
}

.dark-mode .pagination-info {
  color: #bbb;
}

.dark-mode .pagination-button {
  color: #bbb;
}

.dark-mode .pagination-button:hover {
  background-color: rgba(79, 209, 165, 0.2);
  color: #ffffff;
}

.dark-mode .pagination-button.disabled {
  color: #666;
  cursor: not-allowed;
}

.dark-mode .pagination-current {
  color: #4fd1a5;
}

.dark-mode .chain-cell {
  color: #4fd1a5;
  font-weight: 600;
}
</style>
