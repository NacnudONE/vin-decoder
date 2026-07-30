const BASE = 'https://vpic.nhtsa.dot.gov/api'

export const decodeVin = (vin) =>
  fetch(`${BASE}/vehicles/decodevin/${vin.toUpperCase()}?format=json`).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    return r.json()
  })

export const getVariables = () =>
  fetch(`${BASE}/vehicles/getvehiclevariablelist?format=json`).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    return r.json()
  })
