<template>
  <div class="balance-card" :class="{ 'loading': isLoading }">
    <div :class="['balance-icon', type.toLowerCase()]">
      <span v-if="type !== 'ETH'">$</span>
      <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
        <path d="M12 1.75l-6.25 10.5L12 16l6.25-3.75L12 1.75zM12 22.25l-6.25-8.5L12 17.5l6.25-3.75L12 22.25z" fill="currentColor"/>
      </svg>
    </div>
    <div class="balance-amount">{{ amount }} {{ symbol }}</div>
  </div>
</template>

<script>
export default {
  name: 'ZingBalanceCard',
  props: {
    type: {
      type: String,
      required: true,
      validator: value => ['USDC', 'USDT', 'ETH'].includes(value)
    },
    amount: {
      type: String,
      default: '0.00'
    },
    symbol: {
      type: String,
      required: true
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.balance-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  padding: 12px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid #eaeaea;
  position: relative;
}

.balance-card.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.balance-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: bold;
  color: white;
}

.balance-icon svg {
  width: 14px;
  height: 14px;
}

.balance-icon.usdc {
  background-color: #2775ca;
}

.balance-icon.usdt {
  background-color: #26a17b;
}

.balance-icon.eth {
  background-color: #627eea;
}

.balance-amount {
  font-size: 1.4rem;
  font-weight: 500;
  color: #aaa;
  letter-spacing: 0.5px;
}

/* Dark Mode Styles */
:deep(.dark-mode) .balance-card {
  background-color: #1e1e1e;
  border: none;
}

:deep(.dark-mode) .balance-amount {
  color: #ffffff;
}

:deep(.dark-mode) .balance-card.loading::after {
  background-color: rgba(30, 30, 30, 0.7);
}
</style>
