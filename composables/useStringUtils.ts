export function useStringUtils() {
  const capitalizeFirstLetter = (str: string): string => {
    if (str.length === 0)
      return str
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  const truncateString = (str: string, maxLength: number = 100): string => {
    if (str.length <= maxLength)
      return str
    return `${str.slice(0, maxLength)}...`
  }

  const camelCaseToHumanReadable = (str: string): string => {
    return str.replace(/([A-Z])/g, ' $1').replace(/^./, str[0].toUpperCase())
  }

  return {
    capitalizeFirstLetter,
    truncateString,
    camelCaseToHumanReadable,
  }
}
