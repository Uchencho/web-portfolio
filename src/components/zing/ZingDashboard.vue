<template>
  <div class="project-detail">
    <zing-sidebar
      @payout="openPayoutWithNetwork"
      @transactions="showTransactionsModal = true"
    />

    <div class="main-content">
      <div class="project-header">
        <h1>Zing</h1>
        <p class="subtitle">A modern solution for cryptocurrency transactions</p>
        <zing-network-selector
          v-model="network"
          @input="network = $event"
          @dropdown-toggled="onNetworkDropdownToggled"
          ref="networkSelector"
        />
      </div>

      <div class="dashboard">
        <div class="placeholder-content">
          <img src="../../assets/logo.svg" alt="Zing Logo" class="project-logo">
          <p>Welcome to the Zing dashboard on {{ isMainnet ? 'Mainnet' : 'Testnet' }}.
            {{ isMainnet ? 'This is the production environment where real transactions occur.' : 'This is a test environment for development purposes only.' }}
          </p>

          <zing-chain-selector
            v-model="selectedChain"
            @input="selectedChain = $event"
            :network="network"
            @dropdown-toggled="onChainDropdownToggled"
            ref="chainSelector"
          />

          <div class="balance-cards">
            <zing-balance-card
              type="USDC"
              :amount="balances.usdc"
              symbol="USDC"
              :is-loading="isLoading"
            />
            <zing-balance-card
              type="USDT"
              :amount="balances.usdt"
              symbol="USDT"
              :is-loading="isLoading"
            />
            <zing-balance-card
              type="ETH"
              :amount="balances.eth"
              :symbol="getNativeTokenSymbol()"
              :is-loading="isLoading"
            />
          </div>

          <div class="action-buttons">
            <button class="action-button primary" @click="openPayoutWithNetwork">
              Create {{ isMainnet ? 'Mainnet' : 'Testnet' }} Payout
            </button>
            <router-link to="/projects" class="action-button secondary">Back to Projects</router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Transactions Modal -->
    <zing-transactions-modal
      :show="showTransactionsModal"
      :network="network"
      @close="showTransactionsModal = false"
    />

    <!-- Transaction Detail Modal -->
    <zing-transaction-detail-modal
      :show="showTransactionDetailModal"
      :transaction-hash="selectedTransactionHash"
      :network="network"
      @close="closeTransactionDetailModal"
    />
  </div>
</template>

<script>
import ZingSidebar from './ZingSidebar.vue'
import ZingNetworkSelector from './ZingNetworkSelector.vue'
import ZingChainSelector from './ZingChainSelector.vue'
import ZingBalanceCard from './ZingBalanceCard.vue'
import ZingTransactionsModal from './ZingTransactionsModal.vue'
import ZingTransactionDetailModal from './ZingTransactionDetailModal.vue'
import { fetchBalances } from './ZingAPI'

export default {
  name: 'ZingDashboard',
  components: {
    ZingSidebar,
    ZingNetworkSelector,
    ZingChainSelector,
    ZingBalanceCard,
    ZingTransactionsModal,
    ZingTransactionDetailModal
  },
  inject: ['openPayoutModal'],
  data () {
    return {
      network: 'testnet',
      selectedChain: 'sepolia',
      balances: {
        usdc: '0.00',
        usdt: '0.00',
        eth: '0.00'
      },
      isLoading: false,
      showTransactionsModal: false,
      showTransactionDetailModal: false,
      selectedTransactionHash: '',
      networkDropdownOpen: false,
      chainDropdownOpen: false
    }
  },
  computed: {
    isMainnet () {
      return this.network === 'mainnet'
    }
  },
  methods: {
    onNetworkDropdownToggled (isOpen) {
      if (isOpen && this.$refs.chainSelector) {
        this.$refs.chainSelector.closeDropdown()
      }
    },
    onChainDropdownToggled (isOpen) {
      if (isOpen && this.$refs.networkSelector) {
        this.$refs.networkSelector.closeDropdown()
      }
    },
    handleClickOutside (event) {
      // Close dropdowns when clicking outside
      if (this.$refs.networkSelector &&
          this.$refs.networkSelector.$refs.dropdown &&
          !this.$refs.networkSelector.$refs.dropdown.contains(event.target)) {
        this.$refs.networkSelector.closeDropdown()
      }

      if (this.$refs.chainSelector &&
          this.$refs.chainSelector.$refs.dropdown &&
          !this.$refs.chainSelector.$refs.dropdown.contains(event.target)) {
        this.$refs.chainSelector.closeDropdown()
      }
    },
    openPayoutWithNetwork () {
      this.$root.currentNetwork = this.network
      this.openPayoutModal()
    },
    closeTransactionDetailModal () {
      this.showTransactionDetailModal = false
      this.selectedTransactionHash = ''
    },
    openTransactionDetail (hash) {
      this.selectedTransactionHash = hash
      this.showTransactionDetailModal = true
    },
    async loadBalances () {
      this.isLoading = true
      try {
        const result = await fetchBalances(this.network, this.selectedChain)
        this.balances = result
      } catch (error) {
        console.error('Error loading balances:', error)
      } finally {
        this.isLoading = false
      }
    },
    openTransactionsModal () {
      this.showTransactionsModal = true
    },
    getNativeTokenSymbol () {
      switch (this.selectedChain) {
        case 'sepolia':
          return 'SEP'
        case 'eth':
          return 'ETH'
        case 'bnb':
          return 'BNB'
        case 'tbnb':
          return 'tBNB'
        case 'avaxFuji':
          return 'AVAX'
        default:
          return 'ETH'
      }
    }
  },
  watch: {
    network (newVal) {
      // Always update the root currentNetwork value when changed in dashboard
      this.$root.currentNetwork = newVal
      this.loadBalances()
    },
    selectedChain () {
      this.loadBalances()
    }
  },
  mounted () {
    // Set root currentNetwork right away
    this.$root.currentNetwork = this.network
    document.addEventListener('click', this.handleClickOutside)
    this.loadBalances()
  },
  beforeUnmount () {
    document.removeEventListener('click', this.handleClickOutside)
  }
}
</script>

<style scoped>
.project-detail {
  display: flex;
  width: 100%;
  height: 100%;
}

.main-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.project-header {
  text-align: center;
  margin-bottom: 30px;
  width: 100%;
  position: relative;
}

h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  margin: 0;
}

.dashboard {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
  max-width: 900px;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
}

.project-logo {
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
  animation: pulse 3s infinite alternate;
}

@keyframes pulse {
  from {
    transform: scale(1);
    filter: drop-shadow(0 0 0px rgba(66, 185, 131, 0.7));
  }
  to {
    transform: scale(1.05);
    filter: drop-shadow(0 0 10px rgba(66, 185, 131, 0.7));
  }
}

.placeholder-content p {
  max-width: 600px;
  margin: 0 auto 30px;
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.action-button {
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  border: none;
}

.action-button.primary {
  background-color: #42b983;
  color: white;
}

.action-button.primary:hover {
  background-color: #3aa876;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(66, 185, 131, 0.3);
}

.action-button.secondary {
  background-color: transparent;
  color: #42b983;
  border: 1px solid #42b983;
}

.action-button.secondary:hover {
  background-color: rgba(66, 185, 131, 0.1);
  transform: translateY(-2px);
}

.balance-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  width: 100%;
  max-width: 700px;
  margin: 15px 0 30px;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .project-detail {
    flex-direction: column;
  }

  h1 {
    font-size: 2rem;
  }

  .project-logo {
    width: 60px;
    height: 60px;
  }

  .action-buttons {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }

  .balance-cards {
    grid-template-columns: 1fr;
    max-width: 280px;
  }
}

/* Dark Mode Styles */
:deep(.dark-mode) h1 {
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  font-weight: 700;
}

:deep(.dark-mode) .subtitle {
  color: #4fd1a5;
  font-weight: 500;
}

:deep(.dark-mode) .dashboard {
  background-color: #252525;
  border-color: #4fd1a5;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
}

:deep(.dark-mode) .placeholder-content p {
  color: #e0e0e0;
}

:deep(.dark-mode) .action-button.primary {
  background-color: #4fd1a5;
  color: #121212;
  font-weight: 700;
}

:deep(.dark-mode) .action-button.secondary {
  color: #4fd1a5;
  border-color: #4fd1a5;
  background-color: rgba(79, 209, 165, 0.05);
}

:deep(.dark-mode) .action-button.primary:hover {
  background-color: #3cb28f;
  box-shadow: 0 4px 8px rgba(79, 209, 165, 0.3);
}

:deep(.dark-mode) .action-button.secondary:hover {
  background-color: rgba(79, 209, 165, 0.2);
  color: #ffffff;
}

:deep(.dark-mode) .project-logo {
  filter: drop-shadow(0 0 0px rgba(79, 209, 165, 0.7));
  animation: pulse-dark 3s infinite alternate;
}

@keyframes pulse-dark {
  from {
    transform: scale(1);
    filter: drop-shadow(0 0 0px rgba(79, 209, 165, 0.7));
  }
  to {
    transform: scale(1.05);
    filter: drop-shadow(0 0 10px rgba(79, 209, 165, 0.7));
  }
}
</style>
