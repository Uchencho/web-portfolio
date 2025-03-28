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
    // Handle chain parameter
    let chainParam = chain

    // Special handling for BNB chains
    if (chainParam.toLowerCase() === 'bnb' || chainParam.toLowerCase() === 'tbnb') {
      chainParam = 'bnbTestnet'
    }
    // AVAX Fuji should be preserved as 'avaxFuji' with correct casing
    // AVAX mainnet should be preserved as 'avax' with correct casing

    // Fetch USDC token balance with tokenType parameter
    const usdcResponse = await fetch(`${API_BASE_URL}/zing/balance?type=token&chain=${chainParam}&tokenType=usdc`, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
      mode: 'cors',
      credentials: 'same-origin'
    })

    if (usdcResponse.ok) {
      const usdcData = await usdcResponse.json()
      balances.usdc = usdcData.value || '0.00'
    }

    // Fetch USDT token balance with tokenType parameter
    const usdtResponse = await fetch(`${API_BASE_URL}/zing/balance?type=token&chain=${chainParam}&tokenType=usdt`, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
      mode: 'cors',
      credentials: 'same-origin'
    })

    if (usdtResponse.ok) {
      const usdtData = await usdtResponse.json()
      balances.usdt = usdtData.value || '0.00'
    }

    // Fetch native token (ETH/SEP/BNB) balance
    const ethResponse = await fetch(`${API_BASE_URL}/zing/balance?type=eth&chain=${chainParam}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
      mode: 'cors',
      credentials: 'same-origin'
    })

    if (ethResponse.ok) {
      const ethData = await ethResponse.json()
      balances.eth = ethData.value || '0.00'
    }
  } catch (error) {
    // Handle potential CORS errors
    if (error.message.includes('NetworkError') || error.message.includes('CORS')) {
      console.error('CORS Error when fetching balances:', error)
    } else {
      console.error('Error fetching balances:', error)
    }
  }

  return balances
}

/**
 * Fetches transaction data from the API
 * @param {string} network - The network (mainnet/testnet)
 * @param {string} [chain] - Optional chain parameter to filter transactions by chain
 * @returns {Array} List of transactions
 */
export async function fetchTransactions (network, chain) {
  // For mainnet, return empty array since contract is not deployed yet
  if (network === 'mainnet') {
    return []
  }

  try {
    let url = `${API_BASE_URL}/zing/transactions`

    // If chain is provided, add it as a query parameter
    if (chain) {
      // Handle chain value
      let chainValue = chain

      // Special handling for BNB chains
      if (chainValue.toLowerCase() === 'bnb' || chainValue.toLowerCase() === 'tbnb') {
        chainValue = 'bnbTestnet'
      }
      // AVAX Fuji should be preserved as 'avaxFuji' with correct casing
      // AVAX mainnet should be preserved as 'avax' with correct casing

      url += `?chain=${chainValue}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
      mode: 'cors',
      credentials: 'same-origin'
    })

    if (response.ok) {
      const data = await response.json()
      return Array.isArray(data) ? data : []
    }
  } catch (error) {
    // Handle potential CORS errors
    if (error.message.includes('NetworkError') || error.message.includes('CORS')) {
      console.error('CORS Error when fetching transactions:', error)
    } else {
      console.error('Error fetching transactions:', error)
    }
  }

  return []
}

/**
 * Fetches a specific transaction by its hash
 * @param {string} network - The network (mainnet/testnet)
 * @param {string} transactionHash - The hash of the transaction to fetch
 * @param {string} [chain] - Optional chain parameter to specify which chain the transaction is on
 * @returns {Promise<Object>} Transaction details
 * @throws {Error} If transaction cannot be fetched
 */
export async function fetchTransactionDetails (network, transactionHash, chain) {
  // For mainnet, reject with an appropriate error since it's not available
  if (network === 'mainnet') {
    const error = new Error('Mainnet transactions are not available yet')
    console.error(error)
    return Promise.reject(error)
  }

  try {
    let url = `${API_BASE_URL}/zing/transactions/${transactionHash}`

    // If chain is provided, add it as a query parameter
    if (chain) {
      // Handle chain value
      let chainValue = chain

      // Special handling for BNB chains
      if (chainValue.toLowerCase() === 'bnb' || chainValue.toLowerCase() === 'tbnb') {
        chainValue = 'bnbTestnet'
      }
      // AVAX Fuji should be preserved as 'avaxFuji' with correct casing
      // AVAX mainnet should be preserved as 'avax' with correct casing

      url += `?chain=${chainValue}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
      mode: 'cors',
      credentials: 'same-origin'
    })

    if (!response.ok) {
      let errorMessage
      try {
        // Try to parse error response
        const errorData = await response.json()
        errorMessage = errorData.message || `Failed to fetch transaction details: ${response.status} ${response.statusText}`
      } catch (e) {
        // Fallback if response is not JSON
        errorMessage = `Failed to fetch transaction details: ${response.status} ${response.statusText}`
      }

      const error = new Error(errorMessage)
      console.error(error)
      return Promise.reject(error)
    }
    return await response.json()
  } catch (error) {
    // Handle specific CORS errors
    if (error.message.includes('NetworkError') || error.message.includes('CORS')) {
      console.error('CORS Error when fetching transaction details:', error)
      return Promise.reject(new Error('Network request failed. This may be due to CORS restrictions. Please try again later.'))
    }

    console.error('Error fetching transaction details:', error)
    return Promise.reject(error)
  }
}

/**
 * Submits a payout request to the API
 * @param {Object} payoutData - The payout data
 * @param {Object} payoutData.amount - Amount information
 * @param {string} payoutData.amount.value - Amount value
 * @param {string} payoutData.amount.currency - Amount currency (USD)
 * @param {string} payoutData.destinationAddress - Destination wallet address
 * @param {string} payoutData.chain - Blockchain chain (sepolia/eth)
 * @param {string} [payoutData.email] - Optional email address
 * @param {string} [payoutData.tokenType] - Token type (usdc/usdt)
 * @param {string} payoutData.networkType - Network type (testnet/mainnet)
 * @param {Object} [customHeaders] - Optional custom headers to include in the request
 * @returns {Promise<Object>} API response
 * @throws {Error} If the payout submission fails
 */
export async function submitPayout (payoutData, customHeaders = {}) {
  try {
    // Create a new payload and preserve case for avaxFuji
    let chainValue = payoutData.chain

    // Special handling for BNB chains
    if (chainValue.toLowerCase() === 'bnb' || chainValue.toLowerCase() === 'tbnb') {
      chainValue = 'bnbTestnet'
    }
    // AVAX Fuji should be preserved as 'avaxFuji' with correct casing
    // AVAX mainnet should be preserved as 'avax' with correct casing

    const payload = {
      ...payoutData,
      chain: chainValue
    }

    // Merge default headers with custom headers
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...customHeaders
    }

    const response = await fetch(`${API_BASE_URL}/zing/payout`, {
      method: 'POST',
      headers,
      mode: 'cors', // Explicitly set CORS mode
      credentials: 'same-origin', // Include credentials if needed
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      let errorMessage
      try {
        // Try to parse error response
        const errorData = await response.json()
        errorMessage = errorData.message || `Failed with status: ${response.status} ${response.statusText}`
      } catch (e) {
        // Fallback if response is not JSON
        errorMessage = `Failed with status: ${response.status} ${response.statusText}`
      }

      throw new Error(errorMessage)
    }

    return await response.json()
  } catch (error) {
    // Handle specific CORS errors
    if (error.message.includes('NetworkError') || error.message.includes('CORS')) {
      console.error('CORS Error:', error)
      throw new Error('Network request failed. This may be due to CORS restrictions. Please try again later.')
    }

    console.error('Error submitting payout:', error)
    throw error
  }
}
