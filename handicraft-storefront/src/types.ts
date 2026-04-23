export type CraftCategory =
  | 'Textiles & Sarees'
  | 'Home Decor'
  | 'Paintings & Folk Art'
  | 'Jewelry'
  | 'Pottery & Terracotta'
  | 'Wood Craft'
  | 'Metal & Brassware'
  | 'Stationery & Gifting'

export type CraftTradition =
  | 'Block Print (Bagru/Sanganeri)'
  | 'Ajrakh'
  | 'Kalamkari'
  | 'Bandhani'
  | 'Chikankari'
  | 'Ikat'
  | 'Madhubani'
  | 'Pattachitra'
  | 'Pichwai'
  | 'Warli'
  | 'Gond'
  | 'Dhokra (Lost-wax Brass)'
  | 'Channapatna Wood'
  | 'Blue Pottery'
  | 'Terracotta'
  | 'Meenakari'
  | 'Other'

export type Product = {
  id: string
  name: string
  description: string
  story: string
  imageDataUrl: string
  /** INR, minor units (paise). e.g. 79900 = ₹799.00 */
  priceMinor: number
  /** optional MRP for strike-through */
  mrpMinor?: number
  category: CraftCategory
  tradition: CraftTradition
  origin: string // e.g. "Kutch, Gujarat"
  artisan: string
  tags: string[]
  stock: number
  createdAt: number
  /** true = published in the public catalog; false = draft */
  published: boolean
}

export type CartLine = {
  productId: string
  qty: number
}

export type Address = {
  name: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  country: 'India'
}

export type PaymentMethod = 'UPI' | 'Card' | 'Netbanking' | 'COD'

export type OrderStatus =
  | 'placed'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'return_requested'
  | 'returned'
  | 'refunded'
  | 'cancelled'

export type OrderLine = {
  productId: string
  name: string
  imageDataUrl: string
  qty: number
  unitPriceMinor: number
}

export type Order = {
  id: string
  createdAt: number
  lines: OrderLine[]
  subtotalMinor: number
  shippingMinor: number
  taxMinor: number
  totalMinor: number
  address: Address
  payment: PaymentMethod
  status: OrderStatus
  statusHistory: { status: OrderStatus; at: number; note?: string }[]
}

export type User = {
  email: string
  name: string
  phone?: string
  addresses: Address[]
  /** if true, can publish listings in this demo */
  isSeller: boolean
}
