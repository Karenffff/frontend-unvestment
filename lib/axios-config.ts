import axios from "axios"
import { BASE_URL } from "@/lib/config"


// Base URL for API calls

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("bitcoinyield_access_token")

    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for handling auth errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // If error is 401 Unauthorized and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Here you could implement token refresh logic
        // For example:
        // const refreshToken = localStorage.getItem("refreshToken")
        // const response = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken })
        // const newToken = response.data.token
        // localStorage.setItem("authToken", newToken)

        // For now, we'll just redirect to login
        if (typeof window !== "undefined") {
          // Clear auth data
          localStorage.removeItem("bitcoinyield_access_token")
          localStorage.removeItem("bitcoinyield_user")

          // Redirect to login
          window.location.href = "/login?session_expired=true"
        }

        return Promise.reject(error)
      } catch (refreshError) {
        // If refresh fails, redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("bitcoinyield_access_token")
          localStorage.removeItem("bitcoinyield_user")
          window.location.href = "/login?session_expired=true"
        }

        return Promise.reject(refreshError)
      }
    }

    // Handle other errors
    return Promise.reject(error)
  },
)

export default axiosInstance
