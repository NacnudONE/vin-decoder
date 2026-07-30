import { useState } from 'react'

const KEY = 'vin_history'

export const useVinHistory = () => {
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]')
    } catch {
      return []
    }
  })

  const addVin = (vin) => {
    const next = [vin, ...history.filter((v) => v !== vin)].slice(0, 3)
    setHistory(next)
    localStorage.setItem(KEY, JSON.stringify(next))
  }

  return { history, addVin }
}
