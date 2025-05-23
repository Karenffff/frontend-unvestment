"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import axios from "axios"
import { BASE_URL } from "@/lib/config"

export type User = {
  id: string
  name: string
  email: string
  avatar?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {},
})

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("bitcoinyield_user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Authentication error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    try {
      const res = await axios.post(`${BASE_URL}/login/`, { email, password })

      const user: User = {
        id: res.data.user.id,
        name: res.data.user.name,
        email: res.data.user.email,
        avatar: res.data.user.avatar || "/placeholder.svg?height=40&width=40",
      }

      localStorage.setItem("bitcoinyield_user", JSON.stringify(user))
      localStorage.setItem("bitcoinyield_access_token", res.data.token.access)
      localStorage.setItem("bitcoinyield_refresh_token", res.data.token.refresh)
      setUser(user)

      return { success: true }
    } catch (error: any) {
      const errorData = error.response?.data
      const errorMessage = errorData
        ? Object.entries(errorData).map(([_, messages]) => (messages as string[]).join(", ")).join(" | ")
        : "Network error or server not responding."

      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    try {
      const res = await axios.post(`${BASE_URL}/register/`, { name, email, password })

      const user: User = {
        id: res.data.user.id,
        name: res.data.user.name,
        email: res.data.user.email,
        avatar: res.data.user.avatar || "/placeholder.svg?height=40&width=40",
      }

      localStorage.setItem("bitcoinyield_user", JSON.stringify(user))
      localStorage.setItem("bitcoinyield_access_token", res.data.token.access)
      localStorage.setItem("bitcoinyield_refresh_token", res.data.token.refresh)     
      setUser(user)

      return { success: true }
    } catch (error: any) {
      const errorData = error.response?.data
      const errorMessage = errorData
        ? Object.entries(errorData).map(([_, messages]) => (messages as string[]).join(", ")).join(" | ")
        : "Network error or server not responding."

      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("bitcoinyield_access_token")
    localStorage.removeItem("bitcoinyield_refresh_token")
    localStorage.removeItem("bitcoinyield_user")
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
