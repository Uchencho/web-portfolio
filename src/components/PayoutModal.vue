<template>
  <div class="modal-backdrop payout-modal" v-if="show" @click.self="closeModal">
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
              <select id="chain" class="form-control" v-model="formData.chain" required @change="validateAddress">
                <option value="" disabled>Select a network</option>
                <option value="sepolia" v-if="network === 'testnet'">Sepolia (SEP)</option>
                <option value="tbnb" v-if="network === 'testnet'">BNB Testnet (tBNB)</option>
                <option value="avaxFuji" v-if="network === 'testnet'">AVAX Fuji (AVAX)</option>
                <option value="eth" v-if="network === 'mainnet'">Ethereum (ETH)</option>
                <option value="bnb" v-if="network === 'mainnet'">BNB Chain (BNB)</option>
                <option value="avax" v-if="network === 'mainnet'">Avalanche (AVAX)</option>
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
                class="form-control"
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
                class="form-control"
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
              <select id="tokenType" class="form-control" v-model="formData.tokenType" required>
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
                class="form-control"
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
              {{ emailError || "Email address is optional" }}
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
                  Network Type
                </div>
                <div class="transaction-summary-value">
                  {{ network.toUpperCase() }}
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

          <button
            type="submit"
            class="send-button"
            :disabled="!isFormValid || isSubmitting"
            :data-enabled="isFormValid && !isSubmitting"
          >
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

  <!-- Password Confirmation Modal for Mainnet Transactions -->
  <div class="password-modal-backdrop" v-if="showPasswordModal" @click.self="cancelPasswordConfirmation">
    <div class="password-modal-content">
      <div class="password-modal-header">
        <h3>Mainnet Transaction Confirmation</h3>
        <button class="close-button" @click="cancelPasswordConfirmation">&times;</button>
      </div>
      <div class="password-modal-body">
        <div class="warning-message">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="warning-icon">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="currentColor"/>
          </svg>
          <p>You are about to execute a <strong>MAINNET transaction</strong>. This will use real funds. Please enter your security password to proceed.</p>
        </div>

        <div class="form-group">
          <label for="securityPassword">Security Password</label>
          <div class="input-wrapper" :class="{ 'error': passwordError }">
            <input
              type="password"
              id="securityPassword"
              class="form-control"
              v-model="securityPassword"
              placeholder="Enter your security password"
              required
              ref="passwordInput"
            />
          </div>
          <small class="helper-text error-text" v-if="passwordError">{{ passwordError }}</small>
        </div>

        <div class="password-modal-actions">
          <button class="cancel-button" @click="cancelPasswordConfirmation">Cancel</button>
          <button class="confirm-button" @click="confirmPasswordAndSubmit" :disabled="!securityPassword || isSubmitting">
            <span class="spinner-icon" v-if="isSubmitting"></span>
            {{ isSubmitting ? 'Processing...' : 'Confirm Transaction' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { submitPayout } from './zing/ZingAPI'

// Import PayoutModal specific styles
import './styles/PayoutModalStyles.css'

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
      apiError: '',
      // Password modal properties
      showPasswordModal: false,
      securityPassword: '',
      passwordError: ''
    }
  },
  computed: {
    isFormValid () {
      // Check for required fields and no errors
      // Email is optional, so we only check for errors if it's provided
      const valid = this.formData.chain &&
             this.formData.address &&
             this.formData.amount &&
             !this.addressError &&
             !this.amountError &&
             !this.emailError

      // Only log in development to avoid console spam in production
      if (process.env.NODE_ENV === 'development') {
        // Debug logs removed
      }

      return valid
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

      // If email is empty, it's valid since it's optional
      if (!this.formData.email || this.formData.email.trim() === '') {
        this.emailError = ''
        return true
      }

      if (!this.touched.email) {
        this.emailError = ''
        return true
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
      // Email is optional, so it's valid if it's empty or if it passes validation
      const isEmailValid = this.validateEmail()

      if (isAddressValid && isAmountValid && isEmailValid) {
        if (this.step === 'createPayout') {
          // Move to review step
          this.step = 'createPayoutReview'
        } else if (this.step === 'createPayoutReview') {
          // For mainnet transactions, show password confirmation
          if (this.network === 'mainnet') {
            this.showPasswordModal = true
            // Focus the password input after the modal is shown
            this.$nextTick(() => {
              if (this.$refs.passwordInput) {
                this.$refs.passwordInput.focus()
              }
            })
          } else {
            // For testnet, proceed without password
            this.submitPayout()
          }
        }
      }
    },
    cancelPasswordConfirmation () {
      this.showPasswordModal = false
      this.securityPassword = ''
      this.passwordError = ''
    },
    confirmPasswordAndSubmit () {
      if (!this.securityPassword) {
        this.passwordError = 'Security password is required for mainnet transactions'
        return
      }

      this.passwordError = ''
      // Set submitting state but don't close the modal yet
      this.isSubmitting = true

      // Use the submitPayout with the password
      this.submitPayoutWithPasswordModal(this.securityPassword)
    },
    submitPayoutWithPasswordModal (password) {
      // Reset any previous API errors
      this.apiError = ''

      // Ensure the correct chain parameter is used based on the network
      let chainValue = this.formData.chain

      // Convert to lowercase for case-insensitive comparison
      const chainLower = chainValue.toLowerCase()

      // If we're on mainnet, make sure we're using the correct chain values
      if (this.network === 'mainnet') {
        // For mainnet: 'eth', 'bnb', 'avax'
        if (chainLower === 'sepolia') {
          chainValue = 'eth'
        } else if (['bnbtestnet', 'tbnb'].includes(chainLower)) {
          chainValue = 'bnb'
        } else if (['avaxfuji', 'avaxFuji'].includes(chainLower)) {
          chainValue = 'avax'
        }
      } else {
        // For testnet: 'sepolia', 'bnbTestnet', 'avaxFuji'
        if (chainLower === 'eth') {
          chainValue = 'sepolia'
        } else if (chainLower === 'bnb') {
          chainValue = 'bnbTestnet'
        } else if (chainLower === 'avax') {
          chainValue = 'avaxFuji'
        }
      }

      // Prepare the payload
      const payload = {
        amount: {
          value: String(this.formData.amount),
          currency: 'USD'
        },
        destinationAddress: this.formData.address,
        chain: chainValue,
        tokenType: this.formData.tokenType.toLowerCase(),
        networkType: this.network
      }

      // Only include email if it's not empty
      if (this.formData.email && this.formData.email.trim() !== '') {
        payload.email = this.formData.email.trim()
      }

      // Prepare headers
      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }

      // Add password header for mainnet transactions
      if (this.network === 'mainnet' && password) {
        // Use lowercase x-password as the header name to avoid CORS issues
        // NOTE: This must be lowercase 'x-password' NOT 'X-Password'
        const headerName = 'x-password' // Explicitly define as lowercase
        headers[headerName] = password
      }

      // Use the ZingAPI submitPayout function with custom headers
      submitPayout(payload, headers)
        .then(data => {
          // Close both modals
          this.showPasswordModal = false
          this.resetForm()
          this.closeModal()

          // Emit an event to show the transactions list view
          this.$emit('show-transactions')
        })
        .catch(error => {
          // Set error message for display in UI
          this.apiError = error.message || 'Failed to submit payout. Please try again.'

          // Keep the password modal open
          // If it's a password-related error, show it in the password modal
          if (error.message && (error.message.includes('password') || error.message.includes('unauthorized'))) {
            this.passwordError = 'Invalid password. Please try again.'
            this.$nextTick(() => {
              if (this.$refs.passwordInput) {
                this.$refs.passwordInput.focus()
              }
            })
          } else {
            // For other errors, close the password modal and show the error in the main form
            this.showPasswordModal = false
          }
        })
        .finally(() => {
          this.isSubmitting = false
          this.securityPassword = ''
        })
    },
    submitPayout (password = null) {
      // For testnet (non-password) flows only
      if (this.network !== 'mainnet') {
        // Reset any previous API errors
        this.apiError = ''

        // Ensure the correct chain parameter is used based on the network
        let chainValue = this.formData.chain

        // Convert to lowercase for case-insensitive comparison
        const chainLower = chainValue.toLowerCase()

        // If we're on testnet, make sure we're using the correct chain values
        if (this.network === 'testnet') {
          // For testnet: 'sepolia', 'bnbTestnet', 'avaxFuji'
          if (chainLower === 'eth') {
            chainValue = 'sepolia'
          } else if (chainLower === 'bnb') {
            chainValue = 'bnbTestnet'
          } else if (chainLower === 'avax') {
            chainValue = 'avaxFuji'
          }
        }

        // Prepare the payload
        const payload = {
          amount: {
            value: String(this.formData.amount),
            currency: 'USD'
          },
          destinationAddress: this.formData.address,
          chain: chainValue,
          tokenType: this.formData.tokenType.toLowerCase(),
          networkType: this.network
        }

        // Only include email if it's not empty
        if (this.formData.email && this.formData.email.trim() !== '') {
          payload.email = this.formData.email.trim()
        }

        // Prepare headers
        const headers = {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }

        // Use the ZingAPI submitPayout function with custom headers
        submitPayout(payload, headers)
          .then(data => {
            // Close the modal
            this.resetForm()
            this.closeModal()

            // Emit an event to show the transactions list view
            this.$emit('show-transactions')
          })
          .catch(error => {
            // Set error message for display in UI
            this.apiError = error.message || 'Failed to submit payout. Please try again.'
          })
          .finally(() => {
            this.isSubmitting = false
          })
      }
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
      const chainLower = this.formData.chain.toLowerCase()
      switch (chainLower) {
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
        case 'avax':
          return 'Avalanche'
        default:
          return this.formData.chain
      }
    },
    getFeeCurrency () {
      const chainLower = this.formData.chain.toLowerCase()
      switch (chainLower) {
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
        case 'avax':
          return 'AVAX'
        default:
          return 'ETH'
      }
    }
  }
}
</script>

<style scoped>
/* Custom styles for payout modal */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  width: 85%;
  max-width: 600px;
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
  position: relative;
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

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-control:focus {
  border-color: #42b983;
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

.error-message {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 5px;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  outline: none;
}

.btn-primary {
  background-color: #42b983;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #3aa876;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(66, 185, 131, 0.3);
}

.btn-primary:disabled {
  background-color: #a0cfbb;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: transparent;
  color: #42b983;
  border: 1px solid #42b983;
}

.btn-secondary:hover {
  background-color: rgba(66, 185, 131, 0.1);
  transform: translateY(-2px);
}

/* Dark mode styles - moved to PayoutModalStyles.css */

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

/* Password Modal Styles */
.password-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000; /* Higher than the main modal (9999) */
  backdrop-filter: blur(4px);
}

.password-modal-content {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: modal-appear 0.3s ease-out;
  overflow: hidden;
  position: relative;
}

.password-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  background-color: #fffaf0;
  position: relative;
}

.password-modal-header h3 {
  margin: 0;
  font-size: 1.3rem;
  color: #e03131;
  font-weight: 600;
}

.password-modal-body {
  padding: 20px;
}

.warning-message {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
  padding: 12px;
  background-color: rgba(224, 49, 49, 0.05);
  border-radius: 8px;
  border-left: 4px solid #e03131;
}

.warning-icon {
  color: #e03131;
  flex-shrink: 0;
  margin-top: 2px;
}

.warning-message p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #333;
}

.password-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.cancel-button {
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  background-color: transparent;
  color: #666;
  border: 1px solid #ccc;
  transition: all 0.2s;
}

.cancel-button:hover {
  background-color: #f5f5f5;
  color: #333;
}

.confirm-button {
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  background-color: #e03131;
  color: white;
  border: none;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.confirm-button:hover:not(:disabled) {
  background-color: #c92a2a;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(224, 49, 49, 0.3);
}

.confirm-button:disabled {
  background-color: #f08c8c;
  cursor: not-allowed;
}

/* Dark Mode Styles for Password Modal */
:deep(.dark-mode) .password-modal-content {
  background-color: #1e1e1e;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

:deep(.dark-mode) .password-modal-header {
  background-color: #2b1a1a;
  border-bottom-color: #333;
}

:deep(.dark-mode) .warning-message {
  background-color: rgba(255, 107, 107, 0.1);
  border-left-color: #ff6b6b;
}

:deep(.dark-mode) .warning-icon {
  color: #ff6b6b;
}

:deep(.dark-mode) .warning-message p {
  color: #e0e0e0;
}

:deep(.dark-mode) .cancel-button {
  color: #bbb;
  border-color: #444;
}

:deep(.dark-mode) .cancel-button:hover {
  background-color: #252525;
  color: #fff;
}

:deep(.dark-mode) .confirm-button {
  background-color: #ff6b6b;
}

:deep(.dark-mode) .confirm-button:hover:not(:disabled) {
  background-color: #ff5252;
  box-shadow: 0 4px 8px rgba(255, 107, 107, 0.3);
}

:deep(.dark-mode) .confirm-button:disabled {
  background-color: #994040;
}

/* Add responsive styles for the password modal on smaller screens */
@media (max-width: 480px) {
  .password-modal-header h3 {
    font-size: 1.1rem;
  }

  .warning-message {
    padding: 10px;
    gap: 8px;
  }

  .warning-message p {
    font-size: 0.85rem;
  }

  .password-modal-actions {
    flex-direction: column-reverse;
    gap: 8px;
  }

  .cancel-button, .confirm-button {
    width: 100%;
    justify-content: center;
  }
}

/* Dark mode styles - moved to PayoutModalStyles.css */

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

/* Dark mode styles for the network indicator are now in PayoutModalStyles.css */

/* Additional mobile-specific styles */
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

.send-button:not(:disabled) {
  background-color: #42b983;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(66, 185, 131, 0.3);
}

.send-button:hover:not(:disabled) {
  background-color: #3aa876;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(66, 185, 131, 0.4);
}

.send-button:disabled {
  background-color: #a8d5c2;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  opacity: 0.7;
}

.send-button[data-enabled="true"] {
  background-color: #42b983;
  opacity: 1;
  cursor: pointer;
  transform: translateY(0);
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(66, 185, 131, 0.3);
}

.send-button[data-enabled="true"]:hover {
  background-color: #3aa876;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(66, 185, 131, 0.4);
}

/* Add more visible active state on click */
.send-button[data-enabled="true"]:active {
  transform: translateY(1px);
  box-shadow: 0 2px 8px rgba(66, 185, 131, 0.3);
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
