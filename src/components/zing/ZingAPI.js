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

/**
 * Fetches transaction data from the API
 * @param {string} network - The network (mainnet/testnet)
 * @returns {Array} List of transactions
 */
export async function fetchTransactions (network) {
  // For mainnet, return empty array since contract is not deployed yet
  if (network === 'mainnet') {
    return []
  }

  try {
    const response = await fetch(`${API_BASE_URL}/zing/transactions`)
    if (response.ok) {
      const data = await response.json()
      return Array.isArray(data) ? data : []
    }
  } catch (error) {
    console.error('Error fetching transactions:', error)
  }

  return []
}

// Function to fetch a specific transaction by hash
export async function fetchTransactionDetails (network, transactionHash) {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 800))

  // Simulate random error (about 30% of the time) for testing error UI
  if (Math.random() < 0.3) {
    throw new Error('Network error: Failed to fetch transaction details')
  }

  // In a real app, this would be an API call to your backend
  // const response = await fetch(`/api/zing/${network}/transactions/${transactionHash}`);
  // return response.json();

  // For demo purposes, returning mock data
  return {
    destinationAddress: '0x2fef53A901D213c41a82e9f7dFBA867d6c06D253',
    sourceAddress: '0x3Fb3537b14e2Bdc85c5a32CDb52491969c1541f6',
    transactionHash,
    gasPrice: '0.0000002747748584',
    blockNumber: 7959316,
    timestamp: '2025-03-22 22:31:02',
    amount: {
      value: '0.20',
      currency: 'USD'
    },
    status: 'success',
    email: 'alozyuche@gmail.com'
  }
}
