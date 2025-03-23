<!-- Transaction Detail Modal -->
<template>
  <div class="transaction-detail-modal" v-show="show">
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
          <p class="error-message">We couldn't retrieve the transaction details at this time.</p>
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
            <div class="detail-value">{{ transaction.gasPrice }} ETH</div>
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

      <div class="modal-footer" v-if="transaction && network === 'testnet'">
        <a
          :href="`https://sepolia.etherscan.io/tx/${transaction.transactionHash}`"
          target="_blank"
          rel="noopener noreferrer"
          class="modal-button primary"
        >
          View on Etherscan
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchTransactionDetails } from './ZingAPI'

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
      if (!this.transactionHash) return

      this.isLoading = true
      this.error = null
      this.transaction = null // Reset transaction immediately

      try {
        this.transaction = await fetchTransactionDetails(this.network, this.transactionHash)
      } catch (error) {
        console.error('Error fetching transaction details:', error)
        // Set error to true to trigger the error state in the UI
        this.error = true
        this.transaction = null
      } finally {
        this.isLoading = false
      }
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
          console.error('Failed to copy: ', err)
        })
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
