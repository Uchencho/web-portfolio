<template>
  <div class="chain-selector">
    <div class="custom-dropdown" :class="{ 'dropdown-open': dropdownOpen }" @click="toggleDropdown" ref="dropdown">
      <div class="selected-option">
        {{ getSelectedChainDisplay() }}
      </div>
      <div class="dropdown-options" :class="{ 'open': dropdownOpen }">
        <div class="dropdown-option"
             :class="{ 'active': selectedChain === 'sepolia' }"
             @click.stop="selectChain('sepolia')"
             v-if="network === 'testnet'">
          <span class="dot testnet-dot"></span>Sepolia
        </div>
        <div class="dropdown-option"
             :class="{ 'active': selectedChain === 'tbnb' }"
             @click.stop="selectChain('tbnb')"
             v-if="network === 'testnet'">
          <span class="dot testnet-dot"></span>BNB Testnet
        </div>
        <div class="dropdown-option"
             :class="{ 'active': selectedChain === 'avaxFuji' }"
             @click.stop="selectChain('avaxFuji')"
             v-if="network === 'testnet'">
          <span class="dot testnet-dot"></span>AVAX Fuji
        </div>
        <div class="dropdown-option"
             :class="{ 'active': selectedChain === 'eth' }"
             @click.stop="selectChain('eth')"
             v-if="network === 'mainnet'">
          <span class="dot mainnet-dot"></span>Ethereum
        </div>
        <div class="dropdown-option"
             :class="{ 'active': selectedChain === 'bnb' }"
             @click.stop="selectChain('bnb')"
             v-if="network === 'mainnet'">
          <span class="dot mainnet-dot"></span>BNB Chain
        </div>
        <div class="dropdown-option"
             :class="{ 'active': selectedChain === 'avax' }"
             @click.stop="selectChain('avax')"
             v-if="network === 'mainnet'">
          <span class="dot mainnet-dot"></span>Avalanche
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ZingChainSelector',
  props: {
    value: {
      type: String,
      default: 'sepolia',
      validator: value => ['sepolia', 'eth', 'bnb', 'tbnb', 'avaxFuji', 'avax'].includes(value)
    },
    network: {
      type: String,
      default: 'testnet',
      validator: value => ['testnet', 'mainnet'].includes(value)
    }
  },
  data () {
    return {
      selectedChain: this.value,
      dropdownOpen: false
    }
  },
  methods: {
    toggleDropdown () {
      this.dropdownOpen = !this.dropdownOpen
      this.$emit('dropdown-toggled', this.dropdownOpen)
    },
    selectChain (value) {
      this.selectedChain = value
      this.dropdownOpen = false
      this.$emit('input', value)
    },
    closeDropdown () {
      this.dropdownOpen = false
    },
    getSelectedChainDisplay () {
      switch (this.selectedChain) {
        case 'sepolia':
          return 'Sepolia'
        case 'eth':
          return 'Ethereum'
        case 'bnb':
          return 'BNB Chain'
        case 'tbnb':
          return 'BNB Testnet'
        case 'avaxFuji':
          return 'AVAX Fuji'
        case 'avax':
          return 'Avalanche'
        default:
          return this.selectedChain
      }
    }
  },
  watch: {
    value (newValue) {
      this.selectedChain = newValue
    },
    network (newNetwork) {
      // Update chain when network changes
      if (newNetwork === 'testnet') {
        if (!['sepolia', 'tbnb', 'avaxFuji'].includes(this.selectedChain)) {
          this.selectChain('sepolia')
        }
      } else if (newNetwork === 'mainnet') {
        if (!['eth', 'bnb', 'avax'].includes(this.selectedChain)) {
          this.selectChain('eth')
        }
      }
    }
  }
}
</script>

<style scoped>
.chain-selector {
  display: flex;
  align-items: center;
  margin: 15px 0 20px;
  width: 100%;
  max-width: 300px;
  justify-content: center;
}

.custom-dropdown {
  position: relative;
  cursor: pointer;
  min-width: 100px;
  display: flex;
  align-items: center;
  background-color: white;
  padding: 8px 12px;
  border-radius: 25px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.custom-dropdown:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.selected-option {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.85rem;
  padding: 4px 24px 4px 0;
  position: relative;
  transition: all 0.2s ease;
}

.selected-option::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%232c3e50' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  transition: transform 0.3s ease;
}

.dropdown-open .selected-option::after {
  transform: translateY(-50%) rotate(180deg);
}

.dropdown-options {
  position: absolute;
  top: calc(100% + 10px);
  right: -12px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  padding: 6px;
  z-index: 10;
  width: 150px;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  pointer-events: none;
  overflow: hidden;
}

.dropdown-options.open {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.dropdown-option {
  padding: 10px 12px;
  cursor: pointer;
  border-radius: 6px;
  margin: 3px 0;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  color: #2c3e50;
}

.dropdown-option:hover {
  background-color: #f8f9fa;
  color: #42b983;
}

.dropdown-option.active {
  font-weight: 600;
  color: #42b983;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 10px;
  display: inline-block;
}

.testnet-dot {
  background-color: #f59f00;
  box-shadow: 0 0 5px rgba(245, 159, 0, 0.6);
}

.mainnet-dot {
  background-color: #e03131;
  box-shadow: 0 0 5px rgba(224, 49, 49, 0.6);
}

/* Dark Mode Styles */
:deep(.dark-mode) .custom-dropdown {
  background-color: #1e1e1e;
  border: 1px solid #333;
}

:deep(.dark-mode) .custom-dropdown:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
}

:deep(.dark-mode) .dropdown-options {
  background-color: #1e1e1e;
  border: 1px solid #333;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
}

:deep(.dark-mode) .dropdown-option {
  color: #e0e0e0;
}

:deep(.dark-mode) .dropdown-option:hover {
  background-color: #252525;
  color: #4fd1a5;
}

:deep(.dark-mode) .dropdown-option.active {
  color: #4fd1a5;
}

:deep(.dark-mode) .selected-option {
  color: #ffffff;
  font-weight: 600;
}

:deep(.dark-mode) .selected-option::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
}

:deep(.dark-mode) .testnet-dot {
  box-shadow: 0 0 5px rgba(245, 159, 0, 0.8);
}

:deep(.dark-mode) .mainnet-dot {
  box-shadow: 0 0 5px rgba(224, 49, 49, 0.8);
}

@media (max-width: 768px) {
  .chain-selector {
    max-width: 250px;
  }
}
</style>
