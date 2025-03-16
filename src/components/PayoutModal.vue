<template>
  <div class="modal-backdrop" v-if="show" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Create Payout</h2>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="validateAndSubmit">
          <div class="form-group">
            <label for="chain">Blockchain Network</label>
            <div class="select-wrapper">
              <select id="chain" v-model="formData.chain" required @change="validateAddress">
                <option value="" disabled>Select a network</option>
                <option value="ARB">Arbitrum (ARB)</option>
                <option value="POLYGON">Polygon (MATIC)</option>
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
            <label for="amount">Amount (USDC)</label>
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
                <span class="currency-label">USDC</span>
              </div>
            </div>
            <small class="helper-text" :class="{ 'error-text': amountError }">
              {{ amountError || "Minimum amount: 0.01 USDC" }}
            </small>
          </div>

          <div class="summary-box" v-if="formData.chain && formData.amount && !addressError && !amountError">
            <div class="summary-title">Transaction Summary</div>
            <div class="summary-row">
              <span>Network:</span>
              <span class="summary-value">{{ formData.chain === 'ARB' ? 'Arbitrum' : 'Polygon' }}</span>
            </div>
            <div class="summary-row">
              <span>Amount:</span>
              <span class="summary-value">{{ formData.amount }} USDC</span>
            </div>
            <div class="summary-row">
              <span>Estimated Fee:</span>
              <span class="summary-value">~0.001 {{ formData.chain === 'ARB' ? 'ETH' : 'MATIC' }}</span>
            </div>
          </div>

          <button type="submit" class="send-button" :disabled="!isFormValid">
            <span class="button-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
              </svg>
            </span>
            Send Payment
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PayoutModal',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      formData: {
        chain: '',
        address: '',
        amount: ''
      },
      addressError: '',
      amountError: '',
      touched: {
        address: false,
        amount: false
      }
    }
  },
  computed: {
    isFormValid () {
      return this.formData.chain &&
             this.formData.address &&
             this.formData.amount &&
             !this.addressError &&
             !this.amountError
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
    validateAndSubmit () {
      // Mark all fields as touched
      this.touched.address = true
      this.touched.amount = true

      // Validate all fields
      const isAddressValid = this.validateAddress()
      const isAmountValid = this.validateAmount()

      if (isAddressValid && isAmountValid) {
        this.submitPayout()
      }
    },
    submitPayout () {
      // Here you would typically send the data to an API
      console.log('Submitting payout:', this.formData)
      alert(`Payout of ${this.formData.amount} USDC to ${this.formData.address} on ${this.formData.chain === 'ARB' ? 'Arbitrum' : 'Polygon'} initiated!`)
      this.resetForm()
      this.closeModal()
    },
    resetForm () {
      this.formData = {
        chain: '',
        address: '',
        amount: ''
      }
      this.addressError = ''
      this.amountError = ''
      this.touched = {
        address: false,
        amount: false
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
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  animation: modal-appear 0.3s ease-out;
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

.summary-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 0.95rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #555;
}

.summary-row:last-child {
  margin-bottom: 0;
}

.summary-value {
  font-weight: 600;
  color: #2c3e50;
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
</style>
