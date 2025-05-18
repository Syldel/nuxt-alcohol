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

  /**
   * Removes '100 %' or '100%' from the given string.
   *
   * @param {string} pName - The input string.
   * @returns {string} - The modified string without '100 %' or '100%'.
   */
  function removePercentage(pName: string): string {
    return pName.replace(/100\s?%/g, '')
  }

  /**
   * Nettoie un slug en supprimant certaines parties conditionnellement.
   *
   * Pour chaque paire [mustExist, toRemove], la fonction supprime `toRemove`
   * du slug uniquement si `mustExist` est déjà présent dans le slug.
   *
   * Exemple :
   *   cleanSlugWithRules('super-blended-blend', [['blended', 'blend']])
   *   => 'super-blended'
   *
   * @param slug - Le slug à nettoyer (ex. 'super-blended-blend-japon')
   * @param rules - Un tableau de paires [condition, cibleÀSupprimer]
   * @returns Le slug nettoyé
   */
  function cleanSlugWithRules(slug: string, rules: [string, string][]): string {
    for (const [mustExist, toRemove] of rules) {
      if (slug.includes(mustExist)) {
        const regex = new RegExp(`${toRemove}(?=-|$)`, 'i')
        slug = slug.replace(regex, '')
      }
    }
    return slug
  }

  /**
   * Nettoie un slug selon un ensemble fixe de règles définies en dur.
   *
   * @param slug - Le slug brut à nettoyer
   * @returns Le slug nettoyé
   */
  function cleanProductSlug(slug: string): string {
    const rules: [string, string][] = [
      ['blended', 'blend'],
      ['roasted', 'roast'],
      ['smoked', 'smoke'],
      ['tennessee', 'tenessee'],
    ]

    return cleanSlugWithRules(slug, rules)
  }

  function canonicalProductName(pName: string, wordsToRemove: string[]): string {
    let name = removePercentage(pName)
    name = transformAlcoolDegreeString(name)
    name = formatUrl(name)
    name = removeSpecificWords(name, wordsToRemove)
    name = cleanProductSlug(name)
    name = name.replace('-milliliters', '-ml').replace('-millilitres', '-ml')
    name = name.replace('-milliliter', '-ml').replace('-millilitre', '-ml')
    name = name.replace('-centiliters', '-cl').replace('-centilitres', '-cl')
    name = name.replace('-centiliter', '-cl').replace('-centilitre', '-cl')
    name = name.replace('-liters', '-l').replace('-litres', '-l')
    name = name.replace('-liter', '-l').replace('-litre', '-l')
    name = transformUnitsString(name, ['ml', 'cl', 'l', 'an', 'year', 'degre', 'verre', 'carat'])
    name = name.replace('-1ans', '-1an')
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

    let canonicalUrl = `${siteUrl}/cl/${slugConvertedArr.join('/')}`
    if (canonicalUrl.endsWith('/')) {
      canonicalUrl = canonicalUrl.slice(0, -1)
    }

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
    'specially',
    'selected',
    'patissieres',
    'minis',
    'balles',
    'golf',
    'triplement',
    'distille',
    'offre',
    'deguster',
  ]

  const whitelistWords = [
    'whiskey',
    'whisky',
    'bourbon',
    'blended',
    'blend',
    'scotch',
    'single',
    'triple',
    'malt',
    'tourbé',
    'coffret',
    'giftbox',
  ]

  /**
   * Filters out the words in the input string that are present in the whitelistWords array.
   * @param inputString - The string to filter.
   * @param whitelistWords - The array of allowed keywords.
   * @returns A string containing only the keywords from whitelistWords found in the inputString.
   */
  function filterWhitelistWords(inputString: string, whitelistWords: string[]): string {
    const cleanText = inputString.replace(/[^a-z0-9]+/gi, ' ').replace(/ +/g, ' ')
    const words = cleanText.split(/\s+/)
    const filteredWords = words.filter(word =>
      whitelistWords.some(keyword => word.toLowerCase() === keyword.toLowerCase()),
    )
    return filteredWords.join(' ')
  }

  /**
   * Extracts the first word that appears after a given word in a sentence, case-insensitively.
   * If the first word after the target is numeric, also returns the second word as a concatenated string.
   * If the first word is less than 2 characters long and not numeric, returns the next word instead.
   * @param inputString - The input.
   * @param targetWord - The word to search for.
   * @returns The first word after the target word, or an adjusted word based on conditions, or null if not found.
   */
  function getFirstWordAfter(inputString: string, targetWord: string, skipWords?: string[]): string | null {
    const cleanText = inputString.replace(/[^a-z0-9]+/gi, ' ').replace(/ +/g, ' ')
    const words = cleanText.split(/\s+/)
    const lowerTarget = targetWord.toLowerCase()
    const index = words.findIndex(word => word.toLowerCase() === lowerTarget)

    if (index !== -1 && index < words.length - 1) {
      let nextIndex = index + 1
      let firstWord = words[nextIndex]

      // Skip if word is in skipWords
      while (
        skipWords?.some(skip => skip.toLowerCase() === firstWord.toLowerCase())
        && nextIndex < words.length - 1
      ) {
        nextIndex++
        firstWord = words[nextIndex]
      }

      if (!Number.isNaN(Number(firstWord)) && nextIndex < words.length - 1) {
        return `${firstWord} ${words[nextIndex + 1]}`
      }

      if (firstWord.length <= 2 && Number.isNaN(Number(firstWord)) && nextIndex < words.length - 1) {
        return words[nextIndex + 1]
      }

      return firstWord
    }

    return null
  }

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

  /**
   * Extracts a value from the details of an alcohol object based on given keywords.
   * @param details - The list of details.
   * @param keywords - The keywords to search for.
   * @param defaultValue - The default value to return if no match is found (optional).
   * @returns The found value or the default value.
   */
  function extractDetail(details: { legend: string, value: string }[] | undefined, keywords: string[], defaultValue = '-'): string {
    return details
      ? details.find(detail =>
        keywords.some(keyword => detail.legend.toLowerCase().startsWith(keyword.toLowerCase())),
      )?.value || defaultValue
      : defaultValue
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

    let brand = extractDetail(alcohol.details, ['marque', 'brand'])
    brand = formatUrl(brand)

    const typeAlcohol = extractDetail(alcohol.details, ['type'])
    let country = '-'
    let region = '-'
    if (alcohol.country?.iso === 'GB') {
      country = alcohol.country?.regions ? alcohol.country?.regions[0]?.names?.fr : extractDetail(alcohol.details, ['pays', 'country'])
      region = extractDetail(alcohol.details, ['région', 'region'])
    }
    else {
      country = alcohol.country?.names?.fr || extractDetail(alcohol.details, ['pays', 'country'])
      region = alcohol.country?.regions ? alcohol.country?.regions[0]?.names?.fr : extractDetail(alcohol.details, ['région', 'region'])
    }

    if (alcohol.country?.iso === 'US') {
      country = '-'
    }

    const age = extractDetail(alcohol.details, ['âge', 'age'])
    const volume = extractDetail(alcohol.details, ['volume'])
    const unite = extractDetail(alcohol.details, ['unité'])

    let volumeUnit = volume
    if (volume && (volume.includes(',') || volume.includes('.'))) {
      if (unite && (unite.includes(',') || unite.includes('.'))) {
        volumeUnit = ''
      }
      else {
        volumeUnit = unite
      }
    }

    const name = canonicalProductName(
      [getFirstWordAfter(alcohol.name, brand, ['whisky', 'whiskey', 'whiksy']), filterWhitelistWords(alcohol.name, whitelistWords), typeAlcohol, country, region, age, volumeUnit].join(' '),
      [category, 'whisky', 'whiskey', 'whiksy', 'whiskys', brand, ...blacklistWords],
    )
    const canonicalUrl = `${siteUrl}/cl/${category}/${type}/${countryIso}/${brand}/${name}-${alcohol.asin}`
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
