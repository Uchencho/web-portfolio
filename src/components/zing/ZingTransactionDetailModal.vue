<!-- Transaction Detail Modal -->
<template>
  <div class="transaction-detail-modal zing-transaction-detail-modal" v-show="show">
    <div class="modal-backdrop" @click="$emit('close')"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h2>Transaction Details</h2>
        <button class="close-button" @click="$emit('close')">×</button>
      </div>

      <div class="modal-body">
        <div v-if="isLoading" class="loading-indicator">
          <div class="spinner"></div>
          <p>Loading transaction details...</p>
        </div>

        <div v-else-if="error" class="error-state">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="error-icon">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
          </svg>
          <h3 class="error-title">Oops! Something went wrong</h3>
          <p class="error-message">{{ error }}</p>
        </div>

        <div v-else-if="transaction" class="transaction-details">
          <!-- Transaction Hash -->
          <div class="detail-row">
            <div class="detail-label">Transaction Hash</div>
            <div class="detail-value hash-value">
              <span>{{ transaction.transactionHash }}</span>
              <button class="copy-button" @click="copyToClipboard(transaction.transactionHash)" title="Copy to clipboard">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Status -->
          <div class="detail-row">
            <div class="detail-label">Status</div>
            <div class="detail-value">
              <span class="status-badge" :class="transaction.status.toLowerCase()">
                {{ transaction.status }}
              </span>
            </div>
          </div>

          <!-- Timestamp -->
          <div class="detail-row">
            <div class="detail-label">Date & Time</div>
            <div class="detail-value date-value">{{ formatDate(transaction.timestamp) }}</div>
          </div>

          <!-- Amount -->
          <div class="detail-row">
            <div class="detail-label">Amount</div>
            <div class="detail-value">{{ formatAmount(transaction.amount) }}</div>
          </div>

          <!-- Block Number -->
          <div class="detail-row">
            <div class="detail-label">Block Number</div>
            <div class="detail-value">{{ transaction.blockNumber }}</div>
          </div>

          <!-- Gas Price -->
          <div class="detail-row">
            <div class="detail-label">Gas Price</div>
            <div class="detail-value">{{ transaction.gasPrice }} {{ getGasPriceCurrency() }}</div>
          </div>

          <!-- From Address -->
          <div class="detail-row">
            <div class="detail-label">From Address</div>
            <div class="detail-value hash-value">
              <span>{{ transaction.sourceAddress }}</span>
              <button class="copy-button" @click="copyToClipboard(transaction.sourceAddress)" title="Copy to clipboard">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- To Address -->
          <div class="detail-row">
            <div class="detail-label">To Address</div>
            <div class="detail-value hash-value">
              <span>{{ transaction.destinationAddress }}</span>
              <button class="copy-button" @click="copyToClipboard(transaction.destinationAddress)" title="Copy to clipboard">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Email -->
          <div class="detail-row">
            <div class="detail-label">Email</div>
            <div class="detail-value">{{ transaction.email }}</div>
          </div>
        </div>
      </div>

      <div class="modal-footer" v-if="transaction">
        <a
          :href="getExplorerLink()"
          target="_blank"
          rel="noopener noreferrer"
          class="modal-button primary"
        >
          {{ getExplorerButtonText() }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchTransactionDetails } from './ZingAPI'
import './styles/ZingModalStyles.css' // Import shared modal styles
import './styles/ZingTransactionsModalStyles.css' // Import transaction-specific styles

export default {
  name: 'ZingTransactionDetailModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    transactionHash: {
      type: String,
      default: ''
    },
    network: {
      type: String,
      required: true,
      validator: value => ['testnet', 'mainnet'].includes(value)
    },
    chain: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      transaction: null,
      isLoading: false,
      error: null,
      clipboardMessage: ''
    }
  },
  watch: {
    show (newVal) {
      if (newVal && this.transactionHash) {
        this.fetchTransactionDetail()
      } else {
        // Reset data when modal closes
        this.transaction = null
      }
    },
    transactionHash (newVal) {
      if (this.show && newVal) {
        this.fetchTransactionDetail()
      }
    }
  },
  methods: {
    async fetchTransactionDetail () {
      // Use the transactionHash from props instead of transaction.id
      if (!this.transactionHash) {
        this.error = 'No transaction hash provided'
        return
      }

      this.isLoading = true
      this.error = null

      const chain = this.getChain()
      const chainLower = chain.toLowerCase()
      let apiChain = chain

      // Ensure the correct chain parameter is used based on the network
      if (this.network === 'mainnet') {
        // For mainnet API: use 'eth', 'bnb', 'avax'
        if (chainLower === 'sepolia') {
          apiChain = 'eth'
        } else if (['bnbtestnet', 'tbnb'].includes(chainLower)) {
          apiChain = 'bnb'
        } else if (['avaxfuji', 'avaxFuji'].includes(chainLower)) {
          apiChain = 'avax'
        }
      } else {
        // For testnet API: use 'sepolia', 'bnbTestnet', 'avaxFuji'
        if (chainLower === 'eth') {
          apiChain = 'sepolia'
        } else if (chainLower === 'bnb') {
          apiChain = 'bnbTestnet'
        } else if (chainLower === 'avax') {
          apiChain = 'avaxFuji'
        }
      }

      // Call the API with the transaction hash from props
      fetchTransactionDetails(this.network, this.transactionHash, apiChain)
        .then(data => {
          this.transaction = data
          this.isLoading = false
        })
        .catch(error => {
          this.error = error.message || 'Failed to fetch transaction details'
          this.isLoading = false
        })
    },
    formatDate (dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    },
    formatAmount (amount) {
      if (!amount) return 'N/A'
      // If tokenType is available, use it instead of amount.currency
      if (this.transaction && this.transaction.tokenType) {
        return `${amount.value} ${this.transaction.tokenType.toUpperCase()}`
      }
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
    getChain () {
      // If we have a transaction, use its chain first
      if (this.transaction && this.transaction.chain) {
        return this.transaction.chain
      }

      // Otherwise use the chain from props
      return this.chain || 'sepolia'
    },
    getExplorerLink () {
      if (!this.transaction) {
        return ''
      }

      const chain = this.getChain()
      const chainLower = chain.toLowerCase()
      const txHash = this.transaction.transactionHash
      const isTestnet = this.network !== 'mainnet'

      // Determine the explorer base URL based on the chain and network type
      let explorerBaseUrl = ''

      if (isTestnet) {
        // Testnet explorers
        if (chainLower === 'sepolia') {
          explorerBaseUrl = 'https://sepolia.etherscan.io/tx/'
        } else if (['bnbtestnet', 'tbnb'].includes(chainLower)) {
          explorerBaseUrl = 'https://testnet.bscscan.com/tx/'
        } else if (['avaxfuji', 'avaxFuji'].includes(chainLower)) {
          explorerBaseUrl = 'https://testnet.snowtrace.io/tx/'
        } else {
          explorerBaseUrl = 'https://sepolia.etherscan.io/tx/' // Default to Sepolia
        }
      } else {
        // Mainnet explorers
        if (chainLower === 'eth') {
          explorerBaseUrl = 'https://etherscan.io/tx/'
        } else if (chainLower === 'bnb') {
          explorerBaseUrl = 'https://bscscan.com/tx/'
        } else if (chainLower === 'avax') {
          explorerBaseUrl = 'https://snowtrace.io/tx/'
        } else if (chainLower === 'arb') {
          explorerBaseUrl = 'https://arbiscan.io/tx/'
        } else {
          explorerBaseUrl = 'https://etherscan.io/tx/' // Default to Ethereum
        }
      }

      return explorerBaseUrl + txHash
    },
    getExplorerButtonText () {
      if (!this.transaction) {
        return 'View on Blockchain Explorer'
      }

      const chain = this.getChain()
      const chainLower = chain.toLowerCase()
      const isTestnet = this.network !== 'mainnet'

      if (isTestnet) {
        return this.getTestnetExplorerText(chainLower)
      } else {
        return this.getMainnetExplorerText(chainLower)
      }
    },
    getMainnetExplorerText (chainLower) {
      if (chainLower === 'bnb') {
        return 'View on BSCScan'
      } else if (chainLower === 'avax') {
        return 'View on Snowtrace'
      } else if (chainLower === 'eth') {
        return 'View on Etherscan'
      } else if (chainLower === 'arb') {
        return 'View on Arbiscan'
      }
      return 'View on Blockchain Explorer'
    },
    getTestnetExplorerText (chainLower) {
      if (['bnbtestnet', 'tbnb'].includes(chainLower)) {
        return 'View on BSC Testnet Explorer'
      } else if (['avaxfuji', 'avaxFuji'].includes(chainLower)) {
        return 'View on Avalanche Fuji Explorer'
      } else if (chainLower === 'sepolia') {
        return 'View on Sepolia Explorer'
      }
      return 'View on Testnet Explorer'
    },
    getGasPriceCurrency () {
      const chain = this.getChain()
      const chainLower = chain.toLowerCase()

      if (['bnb', 'bnbtestnet', 'tbnb'].includes(chainLower)) {
        return 'BNB'
      } else if (['avax', 'avaxFuji'].includes(chainLower)) {
        return 'AVAX'
      } else if (['eth', 'sepolia', 'arb'].includes(chainLower)) {
        return 'ETH'
      } else {
        return 'ETH'
      }
    }
  }
}
</script>

<style scoped>
.transaction-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1050; /* Higher than the transactions modal */
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
}

.modal-content {
  position: relative;
  background-color: white;
  width: 90%;
  max-width: 700px;
  max-height: 85vh;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
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

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 40px 0;
  color: #e74c3c;
  text-align: center;
  padding: 20px;
}

.error-icon {
  width: 80px;
  height: 80px;
  color: #e74c3c;
  margin-bottom: 20px;
}

.error-title {
  font-size: 1.5rem;
  margin: 0 0 10px 0;
  color: #e74c3c;
}

.error-message {
  color: #666;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.transaction-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-row {
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding-bottom: 16px;
}

.detail-label {
  flex: 0 0 150px;
  font-weight: 600;
  color: #555;
  padding-right: 20px;
}

.detail-value {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: 'Courier New', monospace;
}

.hash-value {
  display: flex;
  align-items: center;
  justify-content: space-between;
  word-break: break-all;
}

.date-value {
  white-space: nowrap;
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
  margin-left: 8px;
  flex-shrink: 0;
}

.copy-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #555;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: capitalize;
  font-family: inherit;
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
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
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

/* Dark Mode Styles */
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

.dark-mode .loading-indicator p {
  color: #e0e0e0;
}

.dark-mode .close-button {
  color: #bbb;
}

.dark-mode .close-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.dark-mode .modal-footer {
  border-top-color: #333;
}

.dark-mode .detail-row {
  border-bottom-color: #333;
}

.dark-mode .detail-label {
  color: #bbb;
}

.dark-mode .detail-value {
  color: #ffffff;
}

.dark-mode .copy-button {
  color: #4fd1a5;
}

.dark-mode .copy-button:hover {
  background-color: rgba(79, 209, 165, 0.2);
  color: #ffffff;
}

.dark-mode .status-badge.success {
  background-color: rgba(79, 209, 165, 0.2);
  color: #4fd1a5;
}

.dark-mode .status-badge.pending {
  background-color: rgba(245, 159, 0, 0.2);
  color: #f59f00;
}

.dark-mode .status-badge.failed {
  background-color: rgba(224, 49, 49, 0.2);
  color: #ff6b6b;
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

.dark-mode .error-title {
  color: #ff6b6b;
}

.dark-mode .error-message {
  color: #e0e0e0;
}

@media (max-width: 768px) {
  .detail-row {
    flex-direction: column;
    gap: 4px;
  }

  .detail-label {
    flex: none;
    margin-bottom: 4px;
  }

  .hash-value {
    word-break: break-all;
  }
}
</style>
