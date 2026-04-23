const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export function formatINR(minor: number): string {
  return inr.format(Math.round(minor / 100))
}

export function toMinor(rupees: number): number {
  return Math.round(rupees * 100)
}

export function toRupees(minor: number): number {
  return Math.round(minor / 100)
}
