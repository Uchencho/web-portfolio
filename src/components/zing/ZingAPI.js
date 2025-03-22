const API_BASE_URL = 'https://em28dw3dg6.execute-api.us-east-1.amazonaws.com/dev'

/**
 * Fetches balance information from the API
 * @param {string} network - The network (mainnet/testnet)
 * @param {string} chain - The blockchain (sepolia/eth)
 * @returns {Object} Balance information
 */
export async function fetchBalances (network, chain) {
  // For mainnet, return zero balances since contract is not deployed yet
  if (network === 'mainnet') {
    return {
      usdc: '0.00',
      usdt: '0.00',
      eth: '0.00'
    }
  }

  const balances = {
    usdc: '0.00',
    usdt: '0.00',
    eth: '0.00'
  }

  try {
    // Fetch token (USDC) balance
    const usdcResponse = await fetch(`${API_BASE_URL}/zing/balance?type=token&chain=${chain}`)
    if (usdcResponse.ok) {
      const usdcData = await usdcResponse.json()
      balances.usdc = usdcData.value || '0.00'
    }

    // Fetch native token (ETH/SEP) balance
    const ethResponse = await fetch(`${API_BASE_URL}/zing/balance?type=eth&chain=${chain}`)
    if (ethResponse.ok) {
      const ethData = await ethResponse.json()
      balances.eth = ethData.value || '0.00'
    }
  } catch (error) {
    console.error('Error fetching balances:', error)
  }

  return balances
}
