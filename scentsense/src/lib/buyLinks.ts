import type { BuyLink, Fragrance } from "./types";

/**
 * Build multi-retailer affiliate buy links for a fragrance. Each retailer can
 * use its own affiliate id via env vars — swap these in once the programs are
 * approved (Amazon Associates, Sephora/Rakuten, The Perfumed Court, etc.).
 *
 * Why multi-retailer: a $300 niche fragrance converts better on decant sites
 * (people want to try before committing). Designer fragrances convert better
 * on Amazon / Sephora. We show both; the user picks.
 */

const AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_TAG || "scentsense-20";
const SEPHORA_REF = process.env.NEXT_PUBLIC_SEPHORA_REF || "scentsense";
const DECANT_REF = process.env.NEXT_PUBLIC_DECANT_REF || "scentsense";

function encodeQuery(f: Fragrance): string {
  return encodeURIComponent(`${f.brand} ${f.name}`);
}

function amazonLink(f: Fragrance): BuyLink {
  const q = encodeQuery(f);
  return {
    retailer: "amazon",
    label: "Amazon",
    url: `https://www.amazon.com/s?k=${q}&tag=${AMAZON_TAG}`,
    note: "Usually in stock · 1-2 day ship",
  };
}

function sephoraLink(f: Fragrance): BuyLink {
  const q = encodeQuery(f);
  return {
    retailer: "sephora",
    label: "Sephora",
    url: `https://www.sephora.com/search?keyword=${q}&ref=${SEPHORA_REF}`,
    note: "Beauty insider points",
  };
}

function fragranceNetLink(f: Fragrance): BuyLink {
  const q = encodeQuery(f);
  return {
    retailer: "fragrancenet",
    label: "FragranceNet",
    url: `https://www.fragrancenet.com/search?search=${q}&refid=${DECANT_REF}`,
    note: "Discount designer",
  };
}

function decantLink(f: Fragrance): BuyLink {
  const q = encodeQuery(f);
  return {
    retailer: "decant",
    label: "Decant (Perfumed Court)",
    url: `https://www.theperfumedcourt.com/Search?ProductName=${q}&ref=${DECANT_REF}`,
    note: "Try before committing · samples from $6",
  };
}

export function buyLinksFor(f: Fragrance): BuyLink[] {
  // Niche / luxury fragrances → lead with decant site.
  // Designer / accessible → lead with Amazon + Sephora.
  const niche = f.price_tier === "luxury" || f.price_tier === "niche";
  if (niche) {
    return [decantLink(f), sephoraLink(f), amazonLink(f)];
  }
  return [amazonLink(f), sephoraLink(f), fragranceNetLink(f), decantLink(f)];
}

export function primaryBuyLinkFor(f: Fragrance): string {
  return buyLinksFor(f)[0]?.url ?? "";
}
