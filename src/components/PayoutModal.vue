<template>
  <div class="modal-backdrop" v-if="show" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Create Payout</h2>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>
      <div class="network-indicator" :class="{ 'mainnet': network === 'mainnet' }">
        <span class="network-dot"></span>
        <span class="network-label">{{ network === 'mainnet' ? 'MAINNET' : 'TESTNET' }}</span>
      </div>
      <div class="modal-body">
        <form @submit.prevent="validateAndSubmit">
          <div class="form-group">
            <label for="chain">Blockchain Network</label>
            <div class="select-wrapper">
              <select id="chain" v-model="formData.chain" required @change="validateAddress">
                <option value="" disabled>Select a network</option>
                <option value="arb">Arbitrum (ARB)</option>
                <option value="polygon">Polygon (MATIC)</option>
                <option value="sepolia" v-if="network === 'testnet'">Sepolia (SEP)</option>
                <option value="tbnb" v-if="network === 'testnet'">BNB Testnet (tBNB)</option>
                <option value="avaxFuji" v-if="network === 'testnet'">AVAX Fuji (AVAX)</option>
                <option value="eth" v-if="network === 'mainnet'">Ethereum (ETH)</option>
                <option value="bnb" v-if="network === 'mainnet'">BNB Chain (BNB)</option>
              </select>
              <div class="select-arrow"></div>
            </div>
          </div>

          <div class="form-group">
            <label for="address">Recipient Address</label>
            <div class="input-wrapper" :class="{ 'error': addressError }">
              <input
                type="text"
                id="address"
                v-model="formData.address"
                placeholder="0x..."
                required
                @input="validateAddress"
                @blur="validateAddress(true)"
              />
              <div class="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-6h2v2h-2zm0-8h2v6h-2z" fill="currentColor"/>
                </svg>
              </div>
            </div>
            <small class="helper-text" :class="{ 'error-text': addressError }">
              {{ addressError || "Enter the recipient's blockchain address (0x format)" }}
            </small>
          </div>

          <div class="form-group">
            <label for="amount">Amount ({{ formData.tokenType.toUpperCase() }})</label>
            <div class="amount-input-wrapper" :class="{ 'error': amountError }">
              <input
                type="number"
                id="amount"
                v-model="formData.amount"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
                @input="validateAmount"
                @blur="validateAmount(true)"
              />
              <div class="currency-badge">
                <span class="currency-icon">$</span>
                <span class="currency-label">{{ formData.tokenType || 'USDC' }}</span>
              </div>
            </div>
            <small class="helper-text" :class="{ 'error-text': amountError }">
              {{ amountError || `Minimum amount: 0.01 ${formData.tokenType.toUpperCase()}` }}
            </small>
          </div>

          <div class="form-group">
            <label for="tokenType">Token Type</label>
            <div class="select-wrapper">
              <select id="tokenType" v-model="formData.tokenType" required>
                <option value="usdc">USDC</option>
                <option value="usdt">USDT</option>
              </select>
              <div class="select-arrow"></div>
            </div>
            <small class="helper-text">
              Select the stablecoin type for this payout
            </small>
          </div>

          <div class="form-group">
            <label for="email">Email (Optional)</label>
            <div class="input-wrapper" :class="{ 'error': emailError }">
              <input
                type="email"
                id="email"
                v-model="formData.email"
                placeholder="user@example.com"
                @input="validateEmail"
                @blur="validateEmail(true)"
              />
              <div class="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
                </svg>
              </div>
            </div>
            <small class="helper-text" :class="{ 'error-text': emailError }">
              {{ emailError || "Notification will be sent to this email (optional)" }}
            </small>
          </div>

          <div class="payout-modal__transaction-summary-container" v-if="step === 'createPayoutReview'">
            <div class="payout-modal__transaction-summary">
              <div class="transaction-summary-title">
                Transaction Summary
              </div>
              <div class="transaction-summary-item">
                <div class="transaction-summary-label">
                  Network
                </div>
                <div class="transaction-summary-value">
                  {{ getNetworkDisplayName() }}
                </div>
              </div>
              <div class="transaction-summary-item">
                <div class="transaction-summary-label">
                  Amount
                </div>
                <div class="transaction-summary-value">
                  {{ formData.amount }} {{ formData.tokenType.toUpperCase() }}
                </div>
              </div>
              <div class="transaction-summary-item">
                <div class="transaction-summary-label">
                  Recipient
                </div>
                <div class="transaction-summary-value address">
                  {{ formData.address }}
                </div>
              </div>
              <div class="transaction-summary-item">
                <div class="transaction-summary-label">
                  Token Type
                </div>
                <div class="transaction-summary-value">
                  {{ formData.tokenType.toUpperCase() }}
                </div>
              </div>
              <div class="transaction-summary-item" v-if="formData.email">
                <div class="transaction-summary-label">
                  Email
                </div>
                <div class="transaction-summary-value">
                  {{ formData.email }}
                </div>
              </div>
            </div>
          </div>

          <div v-if="apiError" class="api-error-container">
            <div class="api-error-message">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="error-icon">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
              </svg>
              <span>{{ apiError }}</span>
            </div>
            <button type="button" class="clear-error-button" @click="apiError = ''">Dismiss</button>
          </div>

          <button type="submit" class="send-button" :disabled="!isFormValid || isSubmitting">
            <span class="button-icon" v-if="!isSubmitting">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
              </svg>
            </span>
            <span class="spinner-icon" v-if="isSubmitting"></span>
            {{ isSubmitting ? 'Sending...' : (step === 'createPayout' ? 'Confirm Payout' : 'Send') }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { submitPayout } from './zing/ZingAPI'

export default {
  name: 'PayoutModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    network: {
      type: String,
      default: 'testnet',
      validator: (value) => {
        return ['testnet', 'mainnet'].includes(value)
      }
    }
  },
  data () {
    return {
      formData: {
        chain: '',
        address: '',
        amount: '',
        email: '',
        tokenType: 'usdc'
      },
      addressError: '',
      amountError: '',
      emailError: '',
      touched: {
        address: false,
        amount: false,
        email: false
      },
      step: 'createPayout',
      isSubmitting: false,
      apiError: ''
    }
  },
  computed: {
    isFormValid () {
      return this.formData.chain &&
             this.formData.address &&
             this.formData.amount &&
             !this.addressError &&
             !this.amountError &&
             !this.emailError
    }
  },
  methods: {
    closeModal () {
      this.resetForm()
      this.$emit('close')
    },
    validateAddress (forceTouched = false) {
      if (forceTouched) {
        this.touched.address = true
      }

      if (!this.formData.address || !this.touched.address) {
        this.addressError = ''
        return
      }

      // Basic Ethereum address validation (works for both Arbitrum and Polygon)
      const addressRegex = /^0x[a-fA-F0-9]{40}$/

      if (!addressRegex.test(this.formData.address)) {
        this.addressError = 'Invalid address format. Must start with 0x followed by 40 hex characters.'
        return false
      }

      // Additional chain-specific validation could be added here

      this.addressError = ''
      return true
    },
    validateAmount (forceTouched = false) {
      if (forceTouched) {
        this.touched.amount = true
      }

      if (!this.formData.amount || !this.touched.amount) {
        this.amountError = ''
        return
      }

      const amount = parseFloat(this.formData.amount)

      if (isNaN(amount)) {
        this.amountError = 'Please enter a valid number'
        return false
      }

      if (amount < 0.01) {
        this.amountError = 'Minimum amount is 0.01 USDC'
        return false
      }

      if (amount > 100000) {
        this.amountError = 'Maximum amount exceeded'
        return false
      }

      this.amountError = ''
      return true
    },
    validateEmail (forceTouched = false) {
      if (forceTouched) {
        this.touched.email = true
      }

      if (!this.formData.email || !this.touched.email) {
        this.emailError = ''
        return
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (!emailRegex.test(this.formData.email)) {
        this.emailError = 'Invalid email format'
        return false
      }

      this.emailError = ''
      return true
    },
    validateAndSubmit () {
      // Mark all fields as touched
      this.touched.address = true
      this.touched.amount = true
      this.touched.email = true

      // Validate all fields
      const isAddressValid = this.validateAddress()
      const isAmountValid = this.validateAmount()
      const isEmailValid = this.validateEmail()

      if (isAddressValid && isAmountValid && isEmailValid) {
        if (this.step === 'createPayout') {
          // Move to review step
          this.step = 'createPayoutReview'
        } else if (this.step === 'createPayoutReview') {
          // Submit the payout
          this.submitPayout()
        }
      }
    },
    submitPayout () {
      // Reset any previous API errors
      this.apiError = ''

      // Log the submission data
      console.log('Submitting payout:', this.formData)

      // Set loading state
      this.isSubmitting = true

      // Prepare the payload
      const payload = {
        amount: {
          value: String(this.formData.amount),
          currency: 'USD'
        },
        destinationAddress: this.formData.address,
        chain: this.formData.chain,
        email: this.formData.email || undefined,
        tokenType: this.formData.tokenType.toLowerCase()
      }

      // Use the ZingAPI submitPayout function
      submitPayout(payload)
        .then(data => {
          console.log('Payout successful:', data)

          // Close the modal
          this.resetForm()
          this.closeModal()

          // Emit an event to show the transactions list view
          this.$emit('show-transactions')
        })
        .catch(error => {
          console.error('Error submitting payout:', error)
          // Set error message for display in UI
          this.apiError = error.message || 'Failed to submit payout. Please try again.'
        })
        .finally(() => {
          this.isSubmitting = false
        })
    },
    resetForm () {
      this.formData = {
        chain: '',
        address: '',
        amount: '',
        email: '',
        tokenType: 'usdc'
      }
      this.addressError = ''
      this.amountError = ''
      this.emailError = ''
      this.apiError = ''
      this.touched = {
        address: false,
        amount: false,
        email: false
      }
      this.step = 'createPayout'
    },
    getNetworkDisplayName () {
      switch (this.formData.chain.toLowerCase()) {
        case 'arb':
          return 'Arbitrum'
        case 'polygon':
          return 'Polygon'
        case 'sepolia':
          return 'Sepolia'
        case 'eth':
          return 'Ethereum'
        case 'bnb':
          return 'BNB Chain'
        case 'tbnb':
          return 'BNB Testnet'
        case 'avaxfuji':
          return 'AVAX Fuji'
        default:
          return this.formData.chain
      }
    },
    getFeeCurrency () {
      switch (this.formData.chain.toLowerCase()) {
        case 'arb':
          return 'ETH'
        case 'polygon':
          return 'MATIC'
        case 'sepolia':
          return 'SEP'
        case 'eth':
          return 'ETH'
        case 'bnb':
          return 'BNB'
        case 'tbnb':
          return 'tBNB'
        case 'avaxfuji':
          return 'AVAX'
        default:
          return 'ETH'
      }
    }
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 1000;
  backdrop-filter: blur(3px);
  overflow-y: auto;
  padding: 20px 0;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  animation: modal-appear 0.3s ease-out;
  margin: auto;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #eee;
  background-color: #f9f9f9;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.6rem;
  color: #2c3e50;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: #666;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #333;
}

.modal-body {
  padding: 25px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.form-group {
  margin-bottom: 24px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
}

.input-wrapper, .select-wrapper, .amount-input-wrapper {
  position: relative;
}

input, select {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
  background-color: #f9f9f9;
}

input:focus, select:focus {
  border-color: #42b983;
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
  background-color: #fff;
}

.input-wrapper.error input,
.amount-input-wrapper.error input {
  border-color: #e74c3c;
  background-color: rgba(231, 76, 60, 0.05);
}

.input-wrapper.error input:focus,
.amount-input-wrapper.error input:focus {
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.select-wrapper {
  position: relative;
}

.select-arrow {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #666;
  pointer-events: none;
}

select {
  appearance: none;
  padding-right: 30px;
}

.input-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.helper-text {
  display: block;
  margin-top: 6px;
  font-size: 0.8rem;
  color: #666;
}

.error-text {
  color: #e74c3c;
}

.amount-input-wrapper input {
  padding-right: 80px;
}

.currency-badge {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background-color: #42b983;
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.currency-icon {
  font-size: 0.9rem;
}

.summary-box {
  background-color: #f5f9f7;
  border: 1px solid #e0f0e9;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 24px;
}

.payout-modal__transaction-summary-container {
  background-color: #f5f9f7;
  border: 1px solid #e0f0e9;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 24px;
}

.payout-modal__transaction-summary {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.transaction-summary-title {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1rem;
  margin-bottom: 5px;
}

.transaction-summary-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.transaction-summary-label {
  color: #666;
}

.transaction-summary-value {
  font-weight: 600;
  color: #2c3e50;
}

.transaction-summary-value.address {
  font-family: monospace;
  font-size: 0.85rem;
  word-break: break-all;
}

.summary-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 0.95rem;
}

.send-button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 14px 20px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 10px rgba(66, 185, 131, 0.3);
}

.send-button:hover:not(:disabled) {
  background-color: #3aa876;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(66, 185, 131, 0.4);
}

.send-button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 5px rgba(66, 185, 131, 0.3);
}

.send-button:disabled {
  background-color: #a8d5c2;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.button-icon {
  display: flex;
  align-items: center;
}

.spinner-icon {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Dark mode styles */
:deep(.dark-mode) .modal-content {
  background-color: #1e1e1e;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

:deep(.dark-mode) .modal-header {
  background-color: #252525;
  border-bottom-color: #333;
}

:deep(.dark-mode) .modal-header h2 {
  color: #f0f0f0;
}

:deep(.dark-mode) .close-button {
  color: #b0b0b0;
}

:deep(.dark-mode) .close-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #f0f0f0;
}

:deep(.dark-mode) label {
  color: #f0f0f0;
}

:deep(.dark-mode) .helper-text {
  color: #aaa;
}

:deep(.dark-mode) .error-text {
  color: #ff6b6b;
}

:deep(.dark-mode) input, :deep(.dark-mode) select {
  background-color: #2c2c2c;
  border-color: #444;
  color: #f0f0f0;
}

:deep(.dark-mode) input:focus, :deep(.dark-mode) select:focus {
  border-color: #4fd1a5;
  box-shadow: 0 0 0 3px rgba(79, 209, 165, 0.2);
  background-color: #333;
}

:deep(.dark-mode) .input-wrapper.error input,
:deep(.dark-mode) .amount-input-wrapper.error input {
  border-color: #ff6b6b;
  background-color: rgba(255, 107, 107, 0.1);
}

:deep(.dark-mode) .input-wrapper.error input:focus,
:deep(.dark-mode) .amount-input-wrapper.error input:focus {
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.2);
}

:deep(.dark-mode) .select-arrow {
  border-top-color: #aaa;
}

:deep(.dark-mode) .input-icon {
  color: #aaa;
}

:deep(.dark-mode) .currency-badge {
  background-color: #4fd1a5;
}

:deep(.dark-mode) .summary-box {
  background-color: #252525;
  border-color: #333;
}

:deep(.dark-mode) .summary-title {
  color: #f0f0f0;
}

:deep(.dark-mode) .summary-row {
  color: #bbb;
}

:deep(.dark-mode) .summary-value {
  color: #f0f0f0;
}

:deep(.dark-mode) .send-button {
  background-color: #4fd1a5;
  box-shadow: 0 4px 10px rgba(79, 209, 165, 0.3);
}

:deep(.dark-mode) .send-button:hover:not(:disabled) {
  background-color: #3cb28f;
  box-shadow: 0 6px 15px rgba(79, 209, 165, 0.4);
}

:deep(.dark-mode) .send-button:active:not(:disabled) {
  box-shadow: 0 2px 5px rgba(79, 209, 165, 0.3);
}

:deep(.dark-mode) .send-button:disabled {
  background-color: #2a7d63;
}

:deep(.dark-mode) .payout-modal__transaction-summary-container {
  background-color: #252525;
  border-color: #333;
}

:deep(.dark-mode) .transaction-summary-title {
  color: #f0f0f0;
}

:deep(.dark-mode) .transaction-summary-label {
  color: #bbb;
}

:deep(.dark-mode) .transaction-summary-value {
  color: #f0f0f0;
}

.network-indicator {
  padding: 6px 15px;
  background-color: #fff8e1;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: #f59f00;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  letter-spacing: 1px;
  border-bottom: 1px solid #eee;
}

.network-indicator.mainnet {
  background-color: #fff5f5;
  color: #e03131;
}

.network-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #f59f00;
  box-shadow: 0 0 5px rgba(245, 159, 0, 0.6);
  animation: pulse-dot 2s infinite;
}

.network-indicator.mainnet .network-dot {
  background-color: #e03131;
  box-shadow: 0 0 5px rgba(224, 49, 49, 0.6);
  animation: pulse-dot-red 2s infinite;
}

@keyframes pulse-dot {
  0% {
    box-shadow: 0 0 0 0 rgba(245, 159, 0, 0.6);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(245, 159, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(245, 159, 0, 0);
  }
}

@keyframes pulse-dot-red {
  0% {
    box-shadow: 0 0 0 0 rgba(224, 49, 49, 0.6);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(224, 49, 49, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(224, 49, 49, 0);
  }
}

:deep(.dark-mode) .network-indicator {
  background-color: #2c2410;
  color: #f59f00;
  border-bottom-color: #333;
}

:deep(.dark-mode) .network-indicator.mainnet {
  background-color: #2b1a1a;
  color: #ff6b6b;
}

/* Additional mobile-specific styles */
@media (max-width: 480px) {
  .modal-backdrop {
    align-items: flex-start;
    padding: 10px 0;
  }

  .modal-content {
    width: 95%;
    max-height: 85vh;
    margin: 20px auto;
  }

  .modal-body {
    padding: 15px;
  }

  .form-group {
    margin-bottom: 16px;
  }

  input, select {
    padding: 10px 12px;
    font-size: 16px; /* Prevent zoom on iOS */
  }

  .transaction-summary-item {
    flex-direction: column;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    padding-bottom: 8px;
    margin-bottom: 8px;
  }

  .transaction-summary-value {
    margin-top: 4px;
  }

  .currency-badge {
    padding: 3px 8px;
    font-size: 0.75rem;
  }

  .modal-header h2 {
    font-size: 1.3rem;
  }

  /* Fix for iOS viewport height issues */
  html, body {
    height: -webkit-fill-available;
  }

  .network-indicator {
    padding: 4px 10px;
    font-size: 0.7rem;
  }
}

/* Add a container for small screens that can scroll independently */
@media (max-height: 600px) {
  .modal-content {
    max-height: none; /* Remove height restriction on very small screens */
    height: auto;
  }

  .modal-backdrop {
    align-items: center;
  }
}

.api-error-container {
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  padding: 12px 15px;
  margin-bottom: 24px;
  color: #e43;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.api-error-message {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.error-icon {
  color: #e43;
  flex-shrink: 0;
  margin-top: 2px;
}

.clear-error-button {
  align-self: flex-end;
  background-color: transparent;
  color: #e43;
  border: 1px solid #e43;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-error-button:hover {
  background-color: rgba(238, 68, 51, 0.1);
}

/* Dark mode styles for the error container */
:deep(.dark-mode) .api-error-container {
  background-color: rgba(255, 92, 92, 0.1);
  border-color: #b35;
  color: #ff6b6b;
}

:deep(.dark-mode) .error-icon {
  color: #ff6b6b;
}

:deep(.dark-mode) .clear-error-button {
  color: #ff6b6b;
  border-color: #ff6b6b;
}

:deep(.dark-mode) .clear-error-button:hover {
  background-color: rgba(255, 107, 107, 0.2);
}
</style>
