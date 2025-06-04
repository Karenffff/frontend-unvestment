// Type definitions for the API responses and data structures

// API response wrapper
export interface ApiResponse<T> {
  status: boolean
  message: string
  data: T
}

// Update the WalletStats interface to match the actual API response
export interface WalletStatsResponse {
  balance_usd: string
  active_investment: number
  total_expected_return: number
  total_balance: number
}

// Keep the existing WalletStats interface for internal app use
export interface WalletStats {
  totalBalance: number
  activeInvestments: number
  totalEarnings: number
  availableBalance: number
}

// Investment details
export interface Investment {
  id: string | number
  planName: string
  amount: number
  amountUsd: number
  roi: string
  duration: string
  startDate: string
  endDate: string
  status: string
  progressPercentage: number
  currentEarnings: number
  expectedReturn: number
}

// Bitcoin price data point
export interface PriceDataPoint {
  time: number
  price: number
}

// Bitcoin statistics
export interface BitcoinStats {
  currentPrice: number
  priceChange24h: number | string
  marketCap: number
  marketCapRank: number
  volume24h: number
  volumeChange24h: number
  allTimeHigh: number
  athDate: string
}

// Portfolio asset
export interface PortfolioAsset {
  name: string
  symbol: string
  price?: number
  holdings?: number
  amount?: number
  value: number
  change?: number
  change24h?: number
  icon?: string
  color?: string
}

// Portfolio value
export interface PortfolioValue {
  totalValue: number
  changePercentage: number
  assets: PortfolioAsset[]
}

// Transaction
export interface Transaction {
  id: string
  type: string
  asset: string
  amount: number
  quantity: number
  symbol: string
  date: Date | string
}

// Investment plan
export interface InvestmentPlan {
  id: number
  name: string
  duration: string
  roi: string
  minInvestment: number
  minInvestmentUSD: number
  category: string
  roiPayment: string
  earlyWithdrawal: string
}

// Analytics data
export interface AnalyticsData {
  totalInvested: number
  totalEarnings: number
  activeInvestments: number
  completedInvestments: number
  portfolioGrowth: number
  averageROI: number
  investmentDistribution: Array<{
    name: string
    percentage: number
    color: string
  }>
  recentActivity: Array<{
    type: string
    amount: number
    date: string
    status: string
  }>
  performanceHistory: Array<{
    month: string
    earnings: number
    investments: number
  }>
}

// Withdrawal request
export interface WithdrawalRequest {
  amount: number
  payoutMethod: "bitcoin" | "cashapp" | "paypal"
  bitcoinAddress?: string
  network?: string
  cashappTag?: string
  paypalEmail?: string
}

// Withdrawal response
export interface Withdrawal {
  id: string | number
  amount?: number
  amountUsd?: number
  address?: string
  network?: string
  payoutMethod?: string
  cashappTag?: string
  paypalEmail?: string
  status: string
  createdAt: string
  completedAt?: string
  transactionId?: string
}

// API response wrappers
export interface ApiSuccessResponse<T> {
  success: true
  data: T
}

export interface ApiErrorResponse {
  success: false
  error: string
}

export type ApiResult<T> = ApiSuccessResponse<T> | ApiErrorResponse
