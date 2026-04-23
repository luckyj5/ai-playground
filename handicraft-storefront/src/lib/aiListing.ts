import type { CraftCategory, CraftTradition } from '../types'

export type ListingSuggestion = {
  name: string
  description: string
  story: string
  category: CraftCategory
  tradition: CraftTradition
  origin: string
  priceMinor: number
  mrpMinor: number
  tags: string[]
}

/**
 * Deterministic "AI" listing generator used for the demo.
 *
 * In a production build this would call a vision LLM (GPT-4o / Gemini /
 * Claude Vision) with the uploaded image. Here we seed from a hash of
 * the image so a given photo always yields the same suggestion, while
 * different photos produce varied listings. Users can edit any field
 * before publishing.
 */

const TRADITIONS: {
  tradition: CraftTradition
  category: CraftCategory
  origin: string
  nouns: string[]
  adjectives: string[]
  story: string
  basePrice: number // ₹
}[] = [
  {
    tradition: 'Block Print (Bagru/Sanganeri)',
    category: 'Textiles & Sarees',
    origin: 'Bagru, Rajasthan',
    nouns: ['Dupatta', 'Saree', 'Stole', 'Kurta', 'Cushion Cover'],
    adjectives: ['Indigo-dyed', 'Natural-dye', 'Mud-resist'],
    story:
      'Hand-stamped with hand-carved teak blocks by third-generation chhipa artisans of Bagru, using natural dyes mixed in iron and jaggery vats.',
    basePrice: 1499,
  },
  {
    tradition: 'Ajrakh',
    category: 'Textiles & Sarees',
    origin: 'Kutch, Gujarat',
    nouns: ['Stole', 'Dupatta', 'Shirting', 'Yardage', 'Saree'],
    adjectives: ['16-step', 'Natural-dye', 'Resist-printed'],
    story:
      'Printed through the legendary sixteen-step Ajrakh process — a marriage of indigo, madder and iron that takes weeks from loom to finish.',
    basePrice: 2499,
  },
  {
    tradition: 'Kalamkari',
    category: 'Paintings & Folk Art',
    origin: 'Srikalahasti, Andhra Pradesh',
    nouns: ['Wall Hanging', 'Scroll', 'Panel', 'Cushion Cover', 'Dupatta'],
    adjectives: ['Hand-painted', 'Pen-drawn', 'Vegetable-dye'],
    story:
      'Drawn with a bamboo kalam dipped in fermented jaggery-iron ink, then washed in the river — a narrative tradition devoted to temple cloth.',
    basePrice: 1999,
  },
  {
    tradition: 'Bandhani',
    category: 'Textiles & Sarees',
    origin: 'Jamnagar, Gujarat',
    nouns: ['Dupatta', 'Saree', 'Odhani', 'Bandhej Suit'],
    adjectives: ['Tie-and-dye', 'Ghar-chola', 'Fingertip-tied'],
    story:
      'Each dot is tied individually with thread by Khatri women before dyeing — a single dupatta can hold over twenty thousand knots.',
    basePrice: 1799,
  },
  {
    tradition: 'Chikankari',
    category: 'Textiles & Sarees',
    origin: 'Lucknow, Uttar Pradesh',
    nouns: ['Kurta', 'Dupatta', 'Anarkali', 'Blouse'],
    adjectives: ['Shadow-work', 'Whitework-embroidered', 'Mulmul'],
    story:
      'Over forty named stitches are whispered through fine mulmul by the chikan karigars of Lucknow, a craft refined in the courts of Awadh.',
    basePrice: 2299,
  },
  {
    tradition: 'Ikat',
    category: 'Textiles & Sarees',
    origin: 'Pochampally, Telangana',
    nouns: ['Saree', 'Dupatta', 'Yardage', 'Cushion Cover'],
    adjectives: ['Double-ikat', 'Resist-dyed', 'Handloom'],
    story:
      'Threads are tied and dyed before they ever reach the loom — the weaver aligns colour across warp and weft until the motif emerges.',
    basePrice: 2799,
  },
  {
    tradition: 'Madhubani',
    category: 'Paintings & Folk Art',
    origin: 'Mithila, Bihar',
    nouns: ['Painting', 'Wall Art', 'Coaster Set', 'Notebook Cover'],
    adjectives: ['Hand-painted', 'Mithila', 'Fish-motif'],
    story:
      'Painted by Mithila women on handmade paper with twigs, matchsticks and natural pigments — a ritual art once reserved for wedding walls.',
    basePrice: 899,
  },
  {
    tradition: 'Pattachitra',
    category: 'Paintings & Folk Art',
    origin: 'Raghurajpur, Odisha',
    nouns: ['Scroll', 'Painting', 'Coaster Set', 'Pendant'],
    adjectives: ['Tussar-primed', 'Natural-pigment', 'Raghurajpur'],
    story:
      'Painted on cloth stiffened with tamarind paste using pigments from conch, lamp-black and hingula — a temple art from coastal Odisha.',
    basePrice: 1299,
  },
  {
    tradition: 'Pichwai',
    category: 'Paintings & Folk Art',
    origin: 'Nathdwara, Rajasthan',
    nouns: ['Wall Hanging', 'Painting', 'Panel'],
    adjectives: ['Nathdwara', 'Lotus-motif', 'Devotional'],
    story:
      'Painted behind the deity of Shrinathji at Nathdwara — cows, lotuses and peacocks gather in gold-leafed devotion.',
    basePrice: 3499,
  },
  {
    tradition: 'Warli',
    category: 'Paintings & Folk Art',
    origin: 'Palghar, Maharashtra',
    nouns: ['Painting', 'Wall Art', 'Tote', 'Coaster Set'],
    adjectives: ['Tribal', 'Rice-paste', 'Stick-figure'],
    story:
      'Triangles and circles dance across the canvas — Warli painting is one of India’s oldest tribal traditions, drawn with rice paste on ochre.',
    basePrice: 799,
  },
  {
    tradition: 'Gond',
    category: 'Paintings & Folk Art',
    origin: 'Mandla, Madhya Pradesh',
    nouns: ['Painting', 'Wall Art', 'Poster'],
    adjectives: ['Dot-and-line', 'Forest-motif', 'Acrylic-on-canvas'],
    story:
      'Every leaf and bird is built from repeating dots and dashes — a contemporary folk form rooted in the forest stories of the Gond people.',
    basePrice: 1599,
  },
  {
    tradition: 'Dhokra (Lost-wax Brass)',
    category: 'Metal & Brassware',
    origin: 'Bastar, Chhattisgarh',
    nouns: ['Figurine', 'Candle Stand', 'Wall Hook', 'Horse', 'Owl'],
    adjectives: ['Lost-wax', 'Tribal', 'Hand-cast'],
    story:
      'Cast in bell-metal using the four-thousand-year-old lost-wax technique by the Ghadwa community of Bastar — every piece is a one-off.',
    basePrice: 1999,
  },
  {
    tradition: 'Channapatna Wood',
    category: 'Wood Craft',
    origin: 'Channapatna, Karnataka',
    nouns: ['Toy', 'Rattle', 'Stacker', 'Bangle', 'Pen Holder'],
    adjectives: ['Lacquered', 'Ivory-wood', 'Non-toxic'],
    story:
      'Turned on a lathe and finished with lac and vegetable dyes — a toy-making tradition patronised by Tipu Sultan and still GI-tagged today.',
    basePrice: 499,
  },
  {
    tradition: 'Blue Pottery',
    category: 'Pottery & Terracotta',
    origin: 'Jaipur, Rajasthan',
    nouns: ['Bowl', 'Planter', 'Coaster Set', 'Vase', 'Tile'],
    adjectives: ['Cobalt-glazed', 'Egyptian-paste', 'Low-fire'],
    story:
      'Shaped from a dough of quartz, fuller’s earth and glass — Jaipur Blue Pottery uses no clay at all, and fires a brilliant cobalt glaze.',
    basePrice: 699,
  },
  {
    tradition: 'Terracotta',
    category: 'Pottery & Terracotta',
    origin: 'Molela, Rajasthan',
    nouns: ['Plaque', 'Planter', 'Diya Set', 'Figurine', 'Wall Tile'],
    adjectives: ['Sun-dried', 'Wheel-thrown', 'Earth-fired'],
    story:
      'Hand-shaped and fired in open kilns — terracotta keeps its prayers, its planters and its lamps breathing through the clay.',
    basePrice: 599,
  },
  {
    tradition: 'Meenakari',
    category: 'Jewelry',
    origin: 'Jaipur, Rajasthan',
    nouns: ['Earrings', 'Jhumka', 'Pendant', 'Choker', 'Bangle'],
    adjectives: ['Enamelled', 'Kundan-set', 'Hand-painted'],
    story:
      'Colour is fused into metal at furnace heat — Meenakari enamelling turns silver and gold into jewelled miniatures of birds and flowers.',
    basePrice: 1299,
  },
]

function hashString(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = (h * 16777619) >>> 0
  }
  return h >>> 0
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length]
}

function titleCase(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase())
}

export function suggestListing(imageDataUrl: string): ListingSuggestion {
  // Seed from the image bytes so the same photo gives the same suggestion.
  const seed = hashString(imageDataUrl.slice(0, 2048))
  const trad = TRADITIONS[seed % TRADITIONS.length]
  const noun = pick(trad.nouns, seed >> 3)
  const adj = pick(trad.adjectives, seed >> 7)
  const name = titleCase(`${adj} ${trad.tradition.split(' (')[0]} ${noun}`)
  const priceMinor =
    Math.round((trad.basePrice + ((seed >> 11) % 9) * 150) / 10) * 10 * 100
  const mrpMinor = Math.round(priceMinor * 1.35)

  const tagBank = [
    'handmade',
    'india',
    'artisan',
    'heritage',
    'GI-tagged',
    'small-batch',
    'natural-dye',
    'eco-friendly',
    'giftable',
    'wedding',
    'festive',
  ]
  const tags = Array.from(
    new Set([
      trad.tradition.split(' (')[0].toLowerCase(),
      trad.origin.split(',')[0].toLowerCase(),
      pick(tagBank, seed),
      pick(tagBank, seed >> 5),
      pick(tagBank, seed >> 9),
    ]),
  )

  const description =
    `An ${adj.toLowerCase()} ${noun.toLowerCase()} crafted in the ${trad.tradition.replace(
      / \(.+\)/,
      '',
    )} tradition of ${trad.origin}. ${trad.story} Slight variations in line, ` +
    `colour and weave are the signature of the hand — no two pieces are alike.`

  return {
    name,
    description,
    story: trad.story,
    category: trad.category,
    tradition: trad.tradition,
    origin: trad.origin,
    priceMinor,
    mrpMinor,
    tags,
  }
}

export const TRADITION_OPTIONS: CraftTradition[] = [
  'Block Print (Bagru/Sanganeri)',
  'Ajrakh',
  'Kalamkari',
  'Bandhani',
  'Chikankari',
  'Ikat',
  'Madhubani',
  'Pattachitra',
  'Pichwai',
  'Warli',
  'Gond',
  'Dhokra (Lost-wax Brass)',
  'Channapatna Wood',
  'Blue Pottery',
  'Terracotta',
  'Meenakari',
  'Other',
]

export const CATEGORY_OPTIONS: CraftCategory[] = [
  'Textiles & Sarees',
  'Home Decor',
  'Paintings & Folk Art',
  'Jewelry',
  'Pottery & Terracotta',
  'Wood Craft',
  'Metal & Brassware',
  'Stationery & Gifting',
]
