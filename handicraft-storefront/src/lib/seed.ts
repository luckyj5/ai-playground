import type { Product } from '../types'

/** Inline SVG "photos" used as seed imagery so the demo ships without binary assets. */
function svgDataUrl(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function motifSvg(opts: {
  bg: string
  ink: string
  accent: string
  label: string
}): string {
  const { bg, ink, accent, label } = opts
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="${bg}"/>
  <g fill="${ink}" opacity="0.9">
    <circle cx="200" cy="200" r="120" fill="none" stroke="${ink}" stroke-width="3"/>
    <circle cx="200" cy="200" r="80" fill="none" stroke="${ink}" stroke-width="3"/>
    <circle cx="200" cy="200" r="24"/>
    ${Array.from({ length: 12 })
      .map((_, i) => {
        const a = (i * Math.PI) / 6
        const x = 200 + Math.cos(a) * 150
        const y = 200 + Math.sin(a) * 150
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="8" fill="${accent}"/>`
      })
      .join('')}
    ${Array.from({ length: 8 })
      .map((_, i) => {
        const a = (i * Math.PI) / 4 + Math.PI / 8
        const x = 200 + Math.cos(a) * 105
        const y = 200 + Math.sin(a) * 105
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" fill="${accent}"/>`
      })
      .join('')}
  </g>
  <text x="200" y="370" text-anchor="middle" font-family="Georgia, serif" font-size="18" fill="${ink}" opacity="0.75">${label}</text>
</svg>`
}

const now = Date.now()

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'seed-ajrakh-stole',
    name: 'Indigo Ajrakh Mulmul Stole',
    description:
      'A hand-printed mulmul stole from Kutch, finished through the sixteen-step Ajrakh process with madder red and indigo. Featherlight, deep-dyed, built for everyday drape.',
    story:
      'Printed through the legendary sixteen-step Ajrakh process by Khatri master printers of Ajrakhpur — a marriage of indigo, madder and iron.',
    imageDataUrl: svgDataUrl(
      motifSvg({ bg: '#17315C', ink: '#FBF6EC', accent: '#E08E12', label: 'Ajrakh · Kutch' }),
    ),
    priceMinor: 249900,
    mrpMinor: 349900,
    category: 'Textiles & Sarees',
    tradition: 'Ajrakh',
    origin: 'Kutch, Gujarat',
    artisan: 'Ismail Mohammed Khatri',
    tags: ['ajrakh', 'kutch', 'natural-dye', 'handmade'],
    stock: 12,
    createdAt: now - 1000 * 60 * 60 * 24 * 14,
    published: true,
  },
  {
    id: 'seed-madhubani-coasters',
    name: 'Madhubani Fish-Motif Coaster Set',
    description:
      'Set of four hand-painted Madhubani coasters on seasoned MDF, sealed with a matte finish. Each coaster carries the auspicious fish and lotus motifs of Mithila.',
    story:
      'Painted by women of Mithila in Bihar with twigs and natural pigments — a ritual art once drawn on wedding walls.',
    imageDataUrl: svgDataUrl(
      motifSvg({ bg: '#FBEFE8', ink: '#9A4722', accent: '#1B2A59', label: 'Madhubani · Mithila' }),
    ),
    priceMinor: 89900,
    mrpMinor: 129900,
    category: 'Paintings & Folk Art',
    tradition: 'Madhubani',
    origin: 'Madhubani, Bihar',
    artisan: 'Sita Devi',
    tags: ['madhubani', 'mithila', 'coasters', 'giftable'],
    stock: 34,
    createdAt: now - 1000 * 60 * 60 * 24 * 9,
    published: true,
  },
  {
    id: 'seed-dhokra-horse',
    name: 'Bastar Dhokra Brass Horse',
    description:
      'A seven-inch lost-wax brass horse cast by Ghadwa artisans of Bastar. Each strand and bridle is a single wax thread, lost forever to the mould.',
    story:
      'Cast in bell-metal using the four-thousand-year-old lost-wax technique — every piece is a one-off.',
    imageDataUrl: svgDataUrl(
      motifSvg({ bg: '#F3E9D2', ink: '#3B2A1A', accent: '#B56E09', label: 'Dhokra · Bastar' }),
    ),
    priceMinor: 279900,
    mrpMinor: 359900,
    category: 'Metal & Brassware',
    tradition: 'Dhokra (Lost-wax Brass)',
    origin: 'Bastar, Chhattisgarh',
    artisan: 'Sukhiram Ghadwa',
    tags: ['dhokra', 'bastar', 'lost-wax', 'tribal'],
    stock: 6,
    createdAt: now - 1000 * 60 * 60 * 24 * 21,
    published: true,
  },
  {
    id: 'seed-channapatna-stacker',
    name: 'Channapatna Rainbow Stacker',
    description:
      'A seven-ring lacquered stacker turned on a traditional lathe in Channapatna. Finished with food-safe vegetable dyes — safe for babies from six months.',
    story:
      'Turned on a lathe and finished with lac and vegetable dyes — a toy tradition GI-tagged to Channapatna.',
    imageDataUrl: svgDataUrl(
      motifSvg({ bg: '#FFE9BF', ink: '#9A4722', accent: '#1B2A59', label: 'Channapatna · Karnataka' }),
    ),
    priceMinor: 79900,
    mrpMinor: 119900,
    category: 'Wood Craft',
    tradition: 'Channapatna Wood',
    origin: 'Channapatna, Karnataka',
    artisan: 'Ramesh M.',
    tags: ['channapatna', 'toys', 'non-toxic', 'kids'],
    stock: 28,
    createdAt: now - 1000 * 60 * 60 * 24 * 5,
    published: true,
  },
  {
    id: 'seed-blue-pottery-planter',
    name: 'Jaipur Blue Pottery Planter',
    description:
      'A cobalt-glazed planter with a floral trellis, hand-thrown from quartz dough in Jaipur. Drainage-friendly and safe for succulents indoors.',
    story:
      'Jaipur Blue Pottery uses no clay at all — just quartz, fuller’s earth and glass, glazed cobalt and fired low.',
    imageDataUrl: svgDataUrl(
      motifSvg({ bg: '#DCE7F5', ink: '#17315C', accent: '#9A4722', label: 'Blue Pottery · Jaipur' }),
    ),
    priceMinor: 149900,
    mrpMinor: 199900,
    category: 'Pottery & Terracotta',
    tradition: 'Blue Pottery',
    origin: 'Jaipur, Rajasthan',
    artisan: 'Kripal Singh Shekhawat Studio',
    tags: ['blue-pottery', 'jaipur', 'planter', 'home'],
    stock: 18,
    createdAt: now - 1000 * 60 * 60 * 24 * 30,
    published: true,
  },
  {
    id: 'seed-meenakari-jhumka',
    name: 'Meenakari Peacock Jhumka',
    description:
      'Silver-plated jhumka earrings enamelled in the Jaipur Meenakari tradition. Peacock blues, pink lotus, gold outlines — hand-finished by the Meenakar.',
    story:
      'Meenakari enamelling fuses colour into metal at furnace heat — a craft rooted in the Mughal courts of Jaipur.',
    imageDataUrl: svgDataUrl(
      motifSvg({ bg: '#1B2A59', ink: '#FFD680', accent: '#E08E12', label: 'Meenakari · Jaipur' }),
    ),
    priceMinor: 179900,
    mrpMinor: 249900,
    category: 'Jewelry',
    tradition: 'Meenakari',
    origin: 'Jaipur, Rajasthan',
    artisan: 'Meenakar Karigar Collective',
    tags: ['meenakari', 'jaipur', 'earrings', 'festive'],
    stock: 22,
    createdAt: now - 1000 * 60 * 60 * 24 * 2,
    published: true,
  },
]
