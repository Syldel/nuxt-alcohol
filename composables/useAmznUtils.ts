export function useAmznUtils() {
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
        /\/([a-z]{2,}\/){0,2}([A-Z0-9]{10,})/i,
      )
      return match ? match[2] : null // Retourner seulement l'ASIN (match[2])
    }
    catch (error) {
      console.error('Erreur lors de l\'extraction de l\'ASIN :', error)
      return null
    }
  }

  return {
    extractASIN,
  }
}
