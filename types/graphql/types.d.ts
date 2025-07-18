export interface Alcohol {
  _id: string
  asin: string
  breadcrumbs?: string[]
  country?: CountryInfo
  description?: Description
  details?: Details[]
  familyLinks?: FamilyLink[]
  features?: string[]
  images?: Images
  langCode?: string
  name: string
  newerVersion?: FamilyLink
  prices?: PriceItem[]
  reviews?: Reviews
  shortlink: string
  type: string
  updatedAt: string
  createdAt: string
  ai?: AIContent
}

export interface CountryInfo {
  iso: string
  iso3: string
  names: NameTranslations
  regions?: RegionInfo[]
}

export interface Description {
  cocktail?: boolean
  images?: string[]
  manufacturer?: string
  product?: string
}

export interface Details {
  legend: string
  value: string
}

export interface FamilyLink {
  asin: string
  thumbSrc: string
  title: string
}

export interface Images {
  bigs?: string[]
  thumbnails?: string[]
}

export interface NameTranslations {
  en: string
  fr: string
}

export interface PriceDetail {
  currency: string
  price: number
}

export interface PriceItem {
  basisPrice?: PriceDetail
  priceToPay?: PriceDetail
  timestamp: number
}

export interface RegionInfo {
  iso: string
  names: NameTranslations
}

export interface Reviews {
  rating?: number
  ratingCount?: number
}

export interface AlcoholFilterInput {
  // Define filter input if needed
}

export interface CreateAlcoholInput {
  // Define create input if needed
}

/* ************************* AIContent ************************* */

export interface AIContent {
  metaTitle?: string
  metaDescription?: string
  description?: string
  details?: Details[]
  slug?: string
  h1?: string
  keywords?: string[]
  faq?: FAQ[]
  og?: OG
  cocktails?: Cocktail[]
}

export interface FAQ {
  question: string
  answer: string
}

export interface OG {
  title: string
  description: string
}

export interface Cocktail {
  title: string
  ingredients: string[]
  instructions: string
}
