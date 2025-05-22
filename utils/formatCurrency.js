export const formatCurrency = (money, locale = 'it-IT', currency = 'VND') => {
  if (typeof money !== 'number' || Number.isNaN(money) || money === Infinity || money === 0) {
    return 0
  }
  return money.toLocaleString(`${locale}`, { style: 'currency', currency: `${currency}`, minimumFractionDigits: 0 })
}
