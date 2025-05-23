import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const usdToBTC = (usd: number, btcPrice: number): string => {
  if (!btcPrice || btcPrice <= 0) return "0.00000"
  return (usd / btcPrice).toFixed(5)
}
