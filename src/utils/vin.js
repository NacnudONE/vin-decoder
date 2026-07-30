// ISO 3779: латиниця та цифри без I, O, Q; max 17 символів
export const validateVin = (vin) => {
  if (!vin?.trim()) return 'Введіть VIN-код'
  if (vin.length > 17) return 'VIN не може перевищувати 17 символів'
  if (!/^[A-HJ-NPR-Z0-9]+$/i.test(vin))
    return 'VIN містить недопустимі символи (I, O, Q заборонені стандартом)'
  return null
}
