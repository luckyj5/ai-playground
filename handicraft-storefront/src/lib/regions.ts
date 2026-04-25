import type { PaymentMethod } from '../types'

export type CountryCode =
  | 'IN'
  | 'US'
  | 'GB'
  | 'DE'
  | 'FR'
  | 'NL'
  | 'AU'
  | 'CA'
  | 'AE'
  | 'SG'
  | 'JP'
  | 'OTHER'

export type Currency =
  | 'INR'
  | 'USD'
  | 'GBP'
  | 'EUR'
  | 'AUD'
  | 'CAD'
  | 'AED'
  | 'SGD'
  | 'JPY'

export const COUNTRIES: ReadonlyArray<{
  code: CountryCode
  name: string
  currency: Currency
}> = [
  { code: 'IN', name: 'India', currency: 'INR' },
  { code: 'US', name: 'United States', currency: 'USD' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
  { code: 'DE', name: 'Germany', currency: 'EUR' },
  { code: 'FR', name: 'France', currency: 'EUR' },
  { code: 'NL', name: 'Netherlands', currency: 'EUR' },
  { code: 'AU', name: 'Australia', currency: 'AUD' },
  { code: 'CA', name: 'Canada', currency: 'CAD' },
  { code: 'AE', name: 'United Arab Emirates', currency: 'AED' },
  { code: 'SG', name: 'Singapore', currency: 'SGD' },
  { code: 'JP', name: 'Japan', currency: 'JPY' },
  { code: 'OTHER', name: 'Other (international)', currency: 'USD' },
]

const COUNTRY_BY_CODE = new Map(COUNTRIES.map((c) => [c.code, c]))

export function getCountry(code: CountryCode) {
  return COUNTRY_BY_CODE.get(code) ?? COUNTRIES[0]
}

export function isIndia(code: CountryCode): boolean {
  return code === 'IN'
}

/** Region the checkout uses to pick a payment rail. */
export type Region = 'IN' | 'INTL'
export function regionFor(code: CountryCode): Region {
  return code === 'IN' ? 'IN' : 'INTL'
}

/** Payment methods grouped by region. India uses Razorpay rails; rest of the
 *  world uses Stripe / PayPal / wallet rails. */
export const PAYMENT_METHODS_BY_REGION: Record<Region, PaymentMethod[]> = {
  IN: ['UPI', 'Card', 'Netbanking', 'COD'],
  INTL: ['Card', 'PayPal', 'ApplePay', 'GooglePay', 'BankTransfer'],
}

export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  UPI: 'UPI (GPay · PhonePe · Paytm)',
  Card: 'Credit / Debit card',
  Netbanking: 'Netbanking',
  COD: 'Cash on Delivery',
  PayPal: 'PayPal',
  ApplePay: 'Apple Pay',
  GooglePay: 'Google Pay',
  BankTransfer: 'Bank transfer (SWIFT / SEPA / ACH)',
}

export const PAYMENT_HINT: Record<PaymentMethod, string> = {
  UPI: 'Instant · zero fees · recommended for Indian shoppers',
  Card: 'Visa · Mastercard · Amex · RuPay (IN) · 3-D Secure',
  Netbanking: 'All major Indian banks supported',
  COD: '₹29 handling · pay when it arrives',
  PayPal: 'Buyer-protected · pay with your PayPal balance or linked card',
  ApplePay: 'One-tap on iPhone, iPad and Mac',
  GooglePay: 'One-tap on Android and Chrome',
  BankTransfer: 'Best for large/wholesale orders · 2–4 business days',
}

// All amounts are stored in INR minor units (paise). For display in foreign
// currencies we apply an indicative FX rate. In production these come from
// a live FX provider (e.g. Stripe FX, Razorpay FX or fixer.io) and are locked
// at checkout for ~10 minutes.
const FX_PER_INR: Record<Currency, number> = {
  INR: 1,
  USD: 1 / 83,
  GBP: 1 / 105,
  EUR: 1 / 90,
  AUD: 1 / 55,
  CAD: 1 / 60,
  AED: 1 / 22.6,
  SGD: 1 / 62,
  JPY: 1 / 0.55,
}

const CURRENCY_LOCALE: Record<Currency, string> = {
  INR: 'en-IN',
  USD: 'en-US',
  GBP: 'en-GB',
  EUR: 'en-IE',
  AUD: 'en-AU',
  CAD: 'en-CA',
  AED: 'en-AE',
  SGD: 'en-SG',
  JPY: 'ja-JP',
}

export function convertFromInrMinor(
  inrMinor: number,
  currency: Currency,
): number {
  const rupees = inrMinor / 100
  const converted = rupees * FX_PER_INR[currency]
  // For zero-decimal currencies (JPY) integer; otherwise 2-decimal.
  if (currency === 'JPY') return Math.round(converted)
  // Round to 2 decimals.
  return Math.round(converted * 100) / 100
}

export function formatMoney(inrMinor: number, currency: Currency): string {
  const value = convertFromInrMinor(inrMinor, currency)
  return new Intl.NumberFormat(CURRENCY_LOCALE[currency], {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'JPY' || currency === 'INR' ? 0 : 2,
  }).format(value)
}

// ---------- Shipping & tax ----------

const FREE_DOMESTIC_THRESHOLD_INR_MINOR = 150000 // ₹1,500
const FLAT_DOMESTIC_SHIPPING_INR_MINOR = 9900 // ₹99
const FLAT_INTL_SHIPPING_INR_MINOR = 249900 // ₹2,499
const FREE_INTL_THRESHOLD_INR_MINOR = 1000000 // ₹10,000

export function shippingMinorFor(
  country: CountryCode,
  subtotalMinor: number,
): number {
  if (subtotalMinor === 0) return 0
  if (country === 'IN') {
    return subtotalMinor >= FREE_DOMESTIC_THRESHOLD_INR_MINOR
      ? 0
      : FLAT_DOMESTIC_SHIPPING_INR_MINOR
  }
  return subtotalMinor >= FREE_INTL_THRESHOLD_INR_MINOR
    ? 0
    : FLAT_INTL_SHIPPING_INR_MINOR
}

export function taxFor(
  country: CountryCode,
  subtotalMinor: number,
): { minor: number; label: string; note?: string } {
  if (country === 'IN') {
    return {
      minor: Math.round(subtotalMinor * 0.05),
      label: 'GST (5%)',
    }
  }
  return {
    minor: 0,
    label: 'Duties & taxes',
    note: 'Collected by the carrier on delivery — varies by country.',
  }
}
