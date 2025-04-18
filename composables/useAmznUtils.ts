export function useAmznUtils() {
  /**
   * Extracts the ASIN from a given URL.
   *
   * @param {string} url - The URL string containing the ASIN.
   * @returns {string | null} - The extracted ASIN, or null if no ASIN is found.
   */
  const extractASIN = (url: string): string | null => {
    try {
      let decodedUrl: string
      try {
        decodedUrl = decodeURIComponent(url)
      }
      catch (decodeError) {
        console.error('Erreur de décodage URI :', decodeError)
        return null
      }

      const match = decodedUrl.match(
        /([A-Z0-9]{10,})/,
      )
      return match ? match[1] : null // Retourner seulement l'ASIN (match[1])
    }
    catch (error) {
      console.error('Erreur lors de l\'extraction de l\'ASIN :', error)
      return null
    }
  }

  /**
   * Génère une URL vers une image Amazon avec options (taille, crop, format)
   */
  const getAmazonImageUrl = (
    id: string,
    {
      width,
      height,
      crop = true,
      sr = true, // utilise `_SRw,h`
    }: {
      width?: number
      height?: number
      crop?: boolean
      sr?: boolean
    } = {},
  ): string => {
    if (!id)
      return '/images/default-thumbnail.jpg'

    let modifiers = ''
    if (crop)
      modifiers += '._AC'
    if (sr && width && height)
      modifiers += `._SR${width},${height}`

    const format = 'jpg'
    return `https://m.media-amazon.com/images/I/${id}${modifiers}.${format}`
  }

  return {
    extractASIN,
    getAmazonImageUrl,
  }
}
