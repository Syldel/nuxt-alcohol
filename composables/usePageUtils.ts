import type { RuntimeConfig } from 'nuxt/schema'
import type { Alcohol } from '~/types/graphql/types'

export function usePageUtils() {
  /**
   * Removes accents from a given string.
   * Converts characters like "é" to "e" or "à" to "a".
   *
   * @param {string} str - The input string containing accented characters.
   * @returns {string} - The string without accents.
   */
  const removeAccents = (str: string): string => {
    return str.normalize('NFD').replace(/[\u0300-\u036F]/g, '')
  }

  /**
   * Removes duplicate values from an array of strings while preserving order.
   *
   * @param input - The input array of strings.
   * @returns A new array without duplicate values.
   */
  function removeDuplicates(input: string[]): string[] {
    return Array.from(new Set(input))
  }

  /**
   * Formats a string into a URL-friendly format by replacing spaces with hyphens,
   * removing special characters, converting to lowercase, and trimming extra hyphens.
   *
   * @param {string} text - The input string to be formatted.
   * @returns {string} - The formatted string suitable for use in a URL.
   */
  const formatUrl = (text: string): string => {
    text = removeAccents(text)
    text = text.replace(/[^a-z0-9]+/gi, '-')
    text = text.replace(/\s+/g, '-')
    text = text.replace(/-+/g, '-')
    text = text.toLowerCase()
    text = text.replace(/^-+|-+$/g, '')
    return text
  }

  /**
   * Removes specific words from the string.
   *
   * @param {string} text - The input string.
   * @param {string[]} wordsToRemove - The list of words to remove from the string.
   * @returns {string} - The resulting string with specific words removed.
   */
  function removeSpecificWords(text: string, wordsToRemove: string[]): string {
    const regex = new RegExp(`\\b(${wordsToRemove.join('|')})\\b`, 'gi')
    return text.replace(regex, '').replace(/\s+/g, ' ').trim()
  }

  function canonicalProductName(pName: string, wordsToRemove: string[]): string {
    let name = transformAlcoolDegreeString(pName)
    name = formatUrl(name)
    name = removeSpecificWords(name, wordsToRemove)
    name = name.replace('-milliliters', '-ml')
    name = transformUnitsString(name, ['ml', 'cl', 'an', 'year', 'l', 'degre', 'verre', 'carat'])
    name = removeDuplicates(name.split('-')).join('-')
    name = name.replace(/-+/g, '-').replace(/^-+|-+$/g, '')
    return name
  }

  const getCanonicalUrl = (slugParamArr: string[], config: RuntimeConfig) => {
    const siteUrl = config.public.siteUrl

    const slugConvertedArr = slugParamArr.map((slug, index) => {
      if (index <= 3) {
        slug = formatUrl(slug)
      }
      if (index === 4) { // convert product name
        console.warn('You should use generateCanonicalUrl!')
        return ''
      }
      return slug
    })

    const canonicalUrl = `${siteUrl}/cl/${slugConvertedArr.join('/')}`
    return canonicalUrl
  }

  const blacklistWords = [
    'd',
    'a',
    'de',
    'et',
    'en',
    'le',
    'la',
    'du',
    'un',
    'une',
    'ou',
    'au',
    'in',
    'sur',
    'les',
    'des',
    'pour',
    'sous',
    'avec',
    'cette',
    'notes',
    'origine',
    'bouteille',
    'degustation',
    'pendant',
    'minimum',
    'servir',
    'glace',
    'explorez',
    'monde',
    'selection',
    'exception',
    'experience',
    'guidee',
    'unique',
    'amateurs',
    'livraison',
    'offerte',
    'connaisseurs',
    'offrir',
    'cadeau',
    'homme',
    'femme',
    'feuille',
    'certificat',
    'or',
    'affinage',
    'futs',
    'premium',
    'medaille',
    'concours',
    'mondial',
    'general',
    'agricole',
    'maturation',
    'style',
    'onctueux',
    'elegant',
    'riche',
    'vieilli',
    'giftbox',
    'specially',
    'selected',
    'patissieres',
    'minis',
    'balles',
    'golf',
    'triplement',
    'distille',
    'offre',
  ]

  /**
   * Rounds a number to the nearest integer, handling both dot and comma decimal separators.
   *
   * @param value - The numeric value as a string or number (e.g., "51.4", "51,14", 51.4).
   * @returns The rounded integer.
   */
  function roundToInteger(value: string | number): number {
    const normalized = typeof value === 'string' ? Number.parseFloat(value.replace(',', '.')) : value
    return Math.round(normalized)
  }

  /**
   * Converts string formats like '18-ans' to '18ans', '100-ans' to '100ans',
   * and '1 an' to '1an' by replacing hyphens and ensuring the correct singular/plural form.
   *
   * @param input - The input string to transform.
   * @param keywords - An array of keywords to normalize (e.g., ['ans', 'years', 'cl', 'ml']).
   * @returns The formatted string with correct spacing.
   */
  function transformUnitsString(input: string, keywords: string[]): string {
    const regex = new RegExp(`(\\d+)-(${keywords.join('|')})`, 'gi')
    return input.replace(regex, (_, number, unit) => {
      return `${number}${unit}`
    })
  }

  /**
   * Converts string formats like '40,25°' to '40 degrés'
   *
   * @param input - The input string to transform.
   * @returns The formatted string
   */
  function transformAlcoolDegreeString(input: string, keywords = ['°', '%', 'pour cent']): string {
    const regex = new RegExp(`([\\d,.]+)\\s?(${keywords.join('|')})`, 'gi')
    return input.replace(regex, (_, number) => {
      return `${roundToInteger(number)} degrés`
    })
  }

  const generateCanonicalUrl = (alcohol: Alcohol, config: RuntimeConfig) => {
    const siteUrl = config.public.siteUrl

    if (!alcohol) {
      return `${siteUrl}`
    }

    let category = '-'
    let type = '-'
    if (alcohol.type === 'whisky') {
      category = 'spiritueux'
      type = 'whiskys'
    }
    const countryIso = alcohol?.country?.iso ? alcohol?.country?.iso.toLowerCase() : '-'
    let brand = alcohol.details
      ? alcohol.details.find(detail =>
        ['marque', 'brand'].some(keyword =>
          detail.legend.toLowerCase().includes(keyword.toLowerCase()),
        ),
      )?.value || '-'
      : '-'
    brand = formatUrl(brand)

    const name = canonicalProductName(alcohol.name, [category, 'whisky', 'whiskey', 'whiksy', 'drink', brand, ...blacklistWords])
    const canonicalUrl = `${siteUrl}/cl/${category}/${type}/${countryIso}/${brand}/${alcohol.asin}-${name}`
    return canonicalUrl
  }

  const getPageType = (slugParamArr: string[]) => {
    // 0 => ex: spiritueux
    // 1 => ex: whiskys
    // 2 => country
    // 3 => brand
    // 4 => product

    const { extractASIN } = useAmznUtils()

    const productASIN = extractASIN(slugParamArr.join('/'))

    if (slugParamArr.length === 0) {
      return 'root'
    }

    if (slugParamArr.length === 1) {
      const slug = slugParamArr[0].toLowerCase().trim()
      if (['spiritueux', 'spirit'].includes(slug)) {
        return 'spiritueux'
      }
    }

    if (slugParamArr.length === 1) {
      const slug = slugParamArr[0].toLowerCase().trim()
      if (['bières', 'bieres'].includes(slug)) {
        return 'bieres'
      }
    }

    if (slugParamArr.length === 2) {
      const slug = slugParamArr[1].toLowerCase().trim()
      if (['whiskys', 'whiskies', 'whiskeys'].includes(slug)) {
        return 'whiskys'
      }
    }

    if (slugParamArr.length === 3) {
      return 'country'
    }

    if (slugParamArr.length === 4) {
      return 'brand'
    }

    if (productASIN) {
      return 'product'
    }

    return 'unknown'
  }

  return {
    removeAccents,
    formatUrl,
    removeSpecificWords,
    getPageType,
    getCanonicalUrl,
    generateCanonicalUrl,
  }
}
