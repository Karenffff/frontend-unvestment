// lib/crypto.ts
import axios from "axios"

export async function getBTCPriceInUSD(): Promise<number | null> {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: {
          ids: "bitcoin",
          vs_currencies: "usd",
        },
      }
    )
    return response.data.bitcoin.usd
  } catch (err) {
    console.error("Failed to fetch BTC price:", err)
    return null
  }
}
