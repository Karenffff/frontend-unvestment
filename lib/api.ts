// This file contains API functions that interact with the backend

import axiosInstance from "./axios-config"
import axios from "axios"
import type {
  WalletStats,
  Investment,
  ApiResponse,
  PriceDataPoint,
  BitcoinStats,
  PortfolioValue,
  Transaction,
  InvestmentPlan,
  WithdrawalRequest,

  AnalyticsData,
  ApiResult,
} from "./types"

// Define the WalletStatsResponse type
interface WalletStatsResponse {
  total_balance: number
  active_investment: number
  total_expected_return: number
  balance_usd: string
}

// Simulate API delay for functions that are still using dummy data
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Update the fetchWalletStats function to handle the actual API response format
export const fetchWalletStats = async (): Promise<ApiResult<WalletStats>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<WalletStatsResponse>>("/wallet/")

    // Map the API response to our application's expected structure
    const walletStats: WalletStats = {
      totalBalance: response.data.data.total_balance,
      activeInvestments: response.data.data.active_investment,
      totalEarnings: response.data.data.total_expected_return ,
      availableBalance: Number.parseFloat(response.data.data.balance_usd),
    }

    return {
      success: true,
      data: walletStats,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.message || "Failed to fetch wallet stats",
    }
  }
}

// Add a new function to fetch the current Bitcoin price from CoinGecko
export async function fetchBitcoinPrice(): Promise<number> {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true",
    )

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data = await response.json()
    return data.bitcoin.usd
  } catch (error) {
    console.error("Error fetching Bitcoin price:", error)
    // Return a fallback price if the API call fails
    return 65432.1
  }
}

// Update the fetchBitcoinStats function to use CoinGecko API
export async function fetchBitcoinStats(): Promise<BitcoinStats> {
  try {
    // Fetch current price data
    const priceResponse = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true",
    )

    if (!priceResponse.ok) {
      throw new Error(`CoinGecko API error: ${priceResponse.status}`)
    }

    const priceData = await priceResponse.json()

    // Fetch additional data for ATH
    const coinResponse = await fetch(
      "https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false",
    )

    if (!coinResponse.ok) {
      throw new Error(`CoinGecko API error: ${coinResponse.status}`)
    }

    const coinData = await coinResponse.json()

    // Format the date
    const athDate = new Date(coinData.market_data.ath_date.usd).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

    return {
      currentPrice: priceData.bitcoin.usd,
      priceChange24h: priceData.bitcoin.usd_24h_change.toFixed(2),
      marketCap: priceData.bitcoin.usd_market_cap,
      marketCapRank: coinData.market_cap_rank,
      volume24h: priceData.bitcoin.usd_24h_vol,
      volumeChange24h: 0, // CoinGecko doesn't provide this directly in the simple API
      allTimeHigh: coinData.market_data.ath.usd,
      athDate: athDate,
    }
  } catch (error) {
    console.error("Error fetching Bitcoin stats:", error)
    // Return fallback data if the API calls fail
    return {
      currentPrice: 65432.1,
      priceChange24h: 3.2,
      marketCap: 1285000000000,
      marketCapRank: 1,
      volume24h: 42500000000,
      volumeChange24h: 8.5,
      allTimeHigh: 69000,
      athDate: "Nov 10, 2021",
    }
  }
}

// Update the fetchBitcoinPriceHistory function to use CoinGecko API
export async function fetchBitcoinPriceHistory(timeframe: string): Promise<PriceDataPoint[]> {
  try {
    let days = "1"

    switch (timeframe) {
      case "1D":
        days = "1"
        break
      case "1W":
        days = "7"
        break
      case "1M":
        days = "30"
        break
      case "1Y":
        days = "365"
        break
      case "ALL":
        days = "max"
        break
      default:
        days = "1"
    }

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`,
    )

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data = await response.json()

    // Transform the data to match our expected format
    return data.prices.map((item: [number, number]) => {
      return {
        time: item[0],
        price: item[1],
      }
    })
  } catch (error) {
    console.error("Error fetching Bitcoin price history:", error)
    // Fall back to the dummy data generator if the API call fails
    return generateDummyPriceHistory(timeframe)
  }
}

// Helper function to generate dummy price history data if the API fails
function generateDummyPriceHistory(timeframe: string): PriceDataPoint[] {
  const basePrice = 65000
  const now = Date.now()

  const generateRandomPrice = (base: number) => {
    const change = Math.random() * 200 - 100
    return base + change
  }

  const generateData = (count: number, interval: number) => {
    const data = []
    for (let i = 0; i < count; i++) {
      const time = now - i * interval
      const price = generateRandomPrice(basePrice)
      data.push({ time, price })
    }
    return data.reverse()
  }

  switch (timeframe) {
    case "1D":
      return generateData(24, 60 * 60 * 1000) // 24 hours, hourly
    case "1W":
      return generateData(7, 24 * 60 * 60 * 1000) // 7 days, daily
    case "1M":
      return generateData(30, 24 * 60 * 60 * 1000) // 30 days, daily
    case "1Y":
      return generateData(365, 24 * 60 * 60 * 1000) // 365 days, daily
    case "ALL":
      return generateData(1000, 24 * 60 * 60 * 1000) // ~3 years, daily
    default:
      return generateData(24, 60 * 60 * 1000)
  }
}

// Update the fetchUserInvestments function to use the axios instance
export async function fetchUserInvestments(): Promise<Investment[]> {
  try {
    const response = await axiosInstance.get("/user-investments/")
    const apiData = response.data as ApiResponse<any[]>

    if (!apiData.status || !apiData.data) {
      throw new Error(apiData.message || "Failed to fetch investments")
    }

    // Get the current Bitcoin price
    const btcPrice = await fetchBitcoinPrice()

    // Transform the API data to match the expected format
    return apiData.data.map((item: any, index: number) => {
      // Calculate progress percentage based on dates
      const startDate = new Date(item.start_date)
      const endDate = new Date(item.end_date)
      const currentDate = new Date()

      let progressPercentage = 0
      if (currentDate >= endDate) {
        progressPercentage = 100
      } else if (currentDate <= startDate) {
        progressPercentage = 0
      } else {
        const totalDuration = endDate.getTime() - startDate.getTime()
        const elapsedDuration = currentDate.getTime() - startDate.getTime()
        progressPercentage = Math.round((elapsedDuration / totalDuration) * 100)
      }

      // Calculate current earnings based on progress
      const totalEarnings = item.expected_return 
      const currentEarnings = (totalEarnings * progressPercentage) / 100

      // Format dates to be more readable
      const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      }

      // Convert duration days to a readable format
      const formatDuration = (days: number) => {
        if (days === 7) return "7 days"
        if (days === 30) return "30 days"
        if (days === 90) return "90 days"
        if (days === 180) return "180 days"
        if (days === 365) return "365 days"
        return `${days} days`
      }

      // Calculate BTC amount based on current Bitcoin price
      const btcAmount = item.amount_usd / btcPrice
      const expectedReturnBtc = item.expected_return / btcPrice
      const currentEarningsBtc = currentEarnings / btcPrice

      return {
        id: item.id || `inv-${index + 1}`, // Use API ID or generate one if not available
        planName: item.plan_name,
        amount: Number.parseFloat(btcAmount.toFixed(8)),
        amountUsd: item.amount_usd,
        roi: `${Number.parseFloat(item.roi_percentage)}%`,
        duration: formatDuration(item.duration_days),
        startDate: formatDate(item.start_date),
        endDate: formatDate(item.end_date),
        status: item.status,
        progressPercentage: progressPercentage,
        currentEarnings: Number.parseFloat(currentEarningsBtc.toFixed(8)),
        expectedReturn: Number.parseFloat(expectedReturnBtc.toFixed(8)),
      }
    })
  } catch (error) {
    console.error("Error fetching investments:", error)
    // Return empty array on error
    return []
  }
}

// Update the investBitcoin function to use the axios instance
export async function investBitcoin(amount: number, planId: number): Promise<ApiResult<any>> {
  try {
    const response = await axiosInstance.post("/invest/", {
      plan_id: planId,
      amount_usd: amount,
    })
    return {
      success: true,
      data: response.data.data,
    }
  } catch (error: any) {
    console.error("Error making investment:", error)
    const message = error?.response?.data?.message
                 || error?.response?.data?.detail
                 || error?.response?.data?.error
                 || "Failed to make investment";
    return {
      success: false,
      error: message
    }
  }
}

// Update other API functions to use the axios instance
export async function fetchPortfolioValue(): Promise<PortfolioValue> {
  try {
    const response = await axiosInstance.get("/portfolio/value")
    return response.data.data
  } catch (error) {
    console.error("Error fetching portfolio value:", error)
    // Return fallback data
    return {
      totalValue: 27543.21,
      changePercentage: 12.4,
      assets: [
        {
          name: "Bitcoin",
          symbol: "BTC",
          amount: 0.42,
          value: 23432.1,
          change: 3.2,
          icon: "/placeholder.svg?height=20&width=20",
          color: "#f59e0b",
        },
        {
          name: "Ethereum",
          symbol: "ETH",
          amount: 0.15,
          value: 481.72,
          change: -1.8,
          icon: "/placeholder.svg?height=20&width=20",
          color: "#6366f1",
        },
        {
          name: "USD Coin",
          symbol: "USDC",
          amount: 3629.39,
          value: 3629.39,
          change: 0.0,
          icon: "/placeholder.svg?height=20&width=20",
          color: "#10b981",
        },
      ],
    }
  }
}

export async function fetchRecentTransactions(): Promise<Transaction[]> {
  try {
    const response = await axiosInstance.get("/transactions/recent")
    return response.data.data
  } catch (error) {
    console.error("Error fetching recent transactions:", error)
    // Return fallback data
    return [
      {
        id: "tx-1",
        type: "buy",
        asset: "Bitcoin",
        amount: 6543.21,
        quantity: 0.1,
        symbol: "BTC",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24),
      },
      {
        id: "tx-2",
        type: "sell",
        asset: "Bitcoin",
        amount: 3271.6,
        quantity: 0.05,
        symbol: "BTC",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      },
      {
        id: "tx-3",
        type: "buy",
        asset: "Ethereum",
        amount: 1605.73,
        quantity: 0.5,
        symbol: "ETH",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      },
    ]
  }
}

export async function buyBitcoin(amount: number): Promise<ApiResult<{ transactionId: string }>> {
  try {
    const response = await axiosInstance.post("/transactions/buy", {
      amount: amount,
      asset: "bitcoin",
    })

    return {
      success: true,
      data: {
        transactionId: response.data.data.id,
      },
    }
  } catch (error: any) {
    console.error("Error buying Bitcoin:", error)
    return {
      success: false,
      error: error?.response?.data?.message || "Failed to buy Bitcoin",
    }
  }
}

export async function fetchPortfolio() {
  try {
    const response = await axiosInstance.get("/portfolio")
    return response.data.data
  } catch (error) {
    console.error("Error fetching portfolio:", error)
    // Return fallback data
    return {
      assets: [
        {
          name: "Bitcoin",
          symbol: "BTC",
          price: 65432.1,
          holdings: 0.42,
          value: 23432.1,
          change24h: 3.2,
        },
        {
          name: "Ethereum",
          symbol: "ETH",
          price: 3211.45,
          holdings: 0.15,
          value: 481.72,
          change24h: -1.8,
        },
        {
          name: "USD Coin",
          symbol: "USDC",
          price: 1.0,
          holdings: 3629.39,
          value: 3629.39,
          change24h: 0.0,
        },
      ],
    }
  }
}

// Fetch wallet address for deposits
export async function fetchWalletAddress(currency: string, network: string): Promise<string> {
  try {
    const response = await axiosInstance.get(`/wallet/address?currency=${currency}&network=${network}`)
    return response.data.data.address
  } catch (error) {
    console.error("Error fetching wallet address:", error)

    // Return fallback addresses
    if (currency === "bitcoin") {
      if (network === "btc-mainnet") {
        return "bc1q084g99n4kvlf7nyt63mvqzqxn35ppaf5ku68vv"
      }
    } else if (currency === "ethereum") {
      return "0x220E799c62a51B4bDC5353A151033D0b01AcfE39"
    }
     else if (currency === "usdt") {
      if (network === "ethereum") {
        return "0x220E799c62a51B4bDC5353A151033D0b01AcfE39"
      } else if (network === "tron") {
        return "TE9ujfkKwy8o7e47Aa3G8Z9KwwMUH5Pmet"
      } else {
        return "0x220E799c62a51B4bDC5353A151033D0b01AcfE39"
      }
    }

    // Default fallback
    return "bc1q084g99n4kvlf7nyt63mvqzqxn35ppaf5ku68vv"
  }
}

// Add a function to submit deposit with transaction proof
export async function submitDeposit(formData: FormData): Promise<ApiResult<any>> {
  try {
    console.log("Submitting deposit...", formData) 

    // Use axios directly to handle FormData properly
    const response = await axiosInstance.post("/deposits/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    console.log("Deposit response:", response.data)

    return {
      success: true,
      data: response.data.data,
    }
  } catch (error: any) {
    console.error("Error submitting deposit:", error)

    return {
      success: false,
      error: error?.response?.data?.message || "Failed to submit deposit",
    }
  }
}

// Add a function to fetch recent deposits
export async function fetchRecentDeposits(): Promise<any[]> {
  try {
    const response = await axiosInstance.get("/deposits/")
    return response.data.data || []
  } catch (error) {
    console.error("Error fetching recent deposits:", error)
    return []
  }
}

// Fetch analytics data for dashboard
export async function fetchAnalyticsData(timeframe: string): Promise<AnalyticsData> {
  try {
    const response = await axiosInstance.get(`/analytics?timeframe=${timeframe}`)
    return response.data.data
  } catch (error) {
    console.error("Error fetching analytics data:", error)
    // Return fallback data
    return {
      totalInvested: 2.45,
      totalEarnings: 0.32,
      activeInvestments: 4,
      completedInvestments: 3,
      portfolioGrowth: 13.2,
      averageROI: 18.5,
      investmentDistribution: [
        { name: "Starter Plan", percentage: 15, color: "#10B981" },
        { name: "Growth Plan", percentage: 35, color: "#3B82F6" },
        { name: "Builder Plan", percentage: 50, color: "#8B5CF6" },
      ],
      recentActivity: [
        { type: "investment", amount: 0.15, date: "2 days ago", status: "active" },
        { type: "earnings", amount: 0.02, date: "1 week ago", status: "completed" },
        { type: "withdrawal", amount: 0.05, date: "2 weeks ago", status: "completed" },
      ],
      performanceHistory: [
        { month: "Jan", earnings: 0.03, investments: 0.2 },
        { month: "Feb", earnings: 0.05, investments: 0.3 },
        { month: "Mar", earnings: 0.08, investments: 0.5 },
        { month: "Apr", earnings: 0.12, investments: 0.7 },
        { month: "May", earnings: 0.18, investments: 1.0 },
        { month: "Jun", earnings: 0.32, investments: 2.45 },
      ],
    }
  }
}

// Request password reset
export async function requestPasswordReset(email: string): Promise<ApiResult<void>> {
  try {
    const response =  await axiosInstance.post("/auth/password-reset/", {
      email: email,
    })

    return {
      success: true,
      data: response.data?.message || undefined,
    }
  } catch (error: any) {
    console.error("Error requesting password reset:", error)
    const message = error?.response?.data?.message
                 || error?.response?.data?.detail
                 || error?.response?.data?.error
                 || "Failed to request password reset";
    return {
      success: false,
      error: message
    }
  }
}

// Reset password with token
export async function resetPassword(token: string, newPassword: string): Promise<ApiResult<void>> {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password/confirm`, {
      token: token,
      password: newPassword,
    })

    return {
      success: true,
      data: undefined,
    }
  } catch (error: any) {
    console.error("Error resetting password:", error)
    return {
      success: false,
      error: error?.response?.data?.message || "Failed to reset password",
    }
  }
}

// Reset password with UID and token
export async function resetPasswordWithUidToken(
  uid: string,
  token: string,
  newPassword: string,
): Promise<ApiResult<void>> {
  try {
    const response = await axiosInstance.post("/password-reset/confirm/", {
      uid: uid,
      token: token,
      new_password: newPassword,
    })

    return {
      success: true,
      data: undefined,
    }
  } catch (error: any) {
    console.error("Error resetting password:", error)
    return {
      success: false,
      error: error?.response?.data?.message || "Failed to reset password",
    }
  }
}

// Verify email with UID and token
export async function verifyEmail(uid: string, token: string): Promise<ApiResult<void>> {
  try {
      const response = await axiosInstance.get(`/auth/email-verify/${uid}/${token}/`);


    return {
      success: true,
      data: undefined,
    }
  } catch (error: any) {
    console.error("Error verifying email:", error)
    return {
      success: false,
      error: error?.response?.data?.message || "Failed to verify email",
    }
  }
}

// Save user settings
export async function saveUserSettings(settings: any): Promise<ApiResult<void>> {
  try {
    const response = await axiosInstance.put("/user/settings", settings)

    return {
      success: true,
      data: undefined,
    }
  } catch (error: any) {
    console.error("Error saving settings:", error)
    return {
      success: false,
      error: error?.response?.data?.message || "Failed to save settings",
    }
  }
}

export async function fetchInvestmentPlans(): Promise<{
  success: boolean;
  data?: {
    id: number;
    name: string;
    duration_days: number;
    roi_percentage: string;
    min_investment_usd: number;
    category: string;
    early_withdrawal_fee: string;
    roi_payment: string;
  }[];
  error?: string;
}> {
  try {
    const response = await axiosInstance.get("/plans");
    return { success: true, data: response.data }; // Return the data on success
  } catch (error) {
    console.error('Error fetching investment plans:', error);
    return { success: false, error: 'Failed to fetch investment plans' }; // Return error message if it fails
  }
}

// Updated function for withdrawing funds with multiple payout methods
export async function withdrawFunds(withdrawalData: WithdrawalRequest): Promise<ApiResult<any>> {
  try {
    console.log("Withdrawal request:", withdrawalData)

      // Prepare the request payload based on payout method
    const payload: any = {
      amount_usd: withdrawalData.amount,
      payout_method: withdrawalData.payoutMethod,
    }

    // Add method-specific fields
    if (withdrawalData.payoutMethod === "bitcoin") {
      payload.address = withdrawalData.bitcoinAddress
      payload.network = withdrawalData.network
    } else if (withdrawalData.payoutMethod === "cashapp") {
      payload.cashapp_tag = withdrawalData.cashappTag
    } else if (withdrawalData.payoutMethod === "paypal") {
      payload.paypal_email = withdrawalData.paypalEmail
    }

    const response = await axiosInstance.post("/withdrawals/", payload)

    console.log("Withdrawal response:", response.data)

    return {
      success: true,
      data: response.data.data,
    }
  } catch (error: any) {
    console.error("Error making withdrawal:", error)

    // Return the specific error message from the backend if available
    return {
      success: false,
      error: error?.response?.data?.message || "Failed to process withdrawal",
    }
  }
}


// Keep the old withdrawBitcoin function for backward compatibility
export async function withdrawBitcoin(withdrawalData: any): Promise<ApiResult<any>> {
  return withdrawFunds({
    amount: withdrawalData.amountUsd,
    payoutMethod: "bitcoin",
    bitcoinAddress: withdrawalData.bitcoinAddress,
    network: withdrawalData.network,
  })
}

// Add a function to fetch recent withdrawals
export async function fetchRecentWithdrawals(): Promise<any[]> {
  try {
    const response = await axiosInstance.get("/withdrawals/")
    return response.data.data || []
  } catch (error) {
    console.error("Error fetching recent withdrawals:", error)
    return []
  }
}


export async function submitToTelegran(formData: FormData): Promise<ApiResult<any>> {
  try {
    console.log("Submitting deposit...", formData) 

    // Use axios directly to handle FormData properly
    const response = await axiosInstance.post("/telegram/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    console.log("Deposit response:", response.data)

    return {
      success: true,
      data: response.data.data,
    }
  } catch (error: any) {
    console.error("Error submitting deposit:", error)

    return {
      success: false,
      error: error?.response?.data?.message || "Failed to submit deposit",
    }
  }
}