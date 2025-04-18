import type { Alcohol, CountryInfo } from '~/types/graphql/types'

const GET_COUNTRIES = gql`
  query GetCountries($type: String, $langCode: String) {
    getUniqueCountries(filter: { type: $type, langCode: $langCode }) {
      names {
        fr
      }
      iso
      iso3
      regions {
        names {
          fr
        }
        iso
      }
    }
  }
`

interface GetCountriesResponse {
  getUniqueCountries: CountryInfo[]
}

/* ****************************************************************************** */

const GET_DETAILS = gql`
  query GetUniqueDetails($legend: String!, $iso: String, $type: String, $langCode: String) {
    getUniqueDetails(legend: $legend, iso: $iso, filter: { type: $type, langCode: $langCode })
  }
`

interface GetDetailsResponse {
  getUniqueDetails: string[]
}

/* ****************************************************************************** */

const GET_ALCOHOLS_BY_DETAIL_VALUE = gql`
  query GetAlcoholsByDetailValue($detailValue: String, $type: String, $langCode: String) {
    alcohols(filter: { detail: { value: $detailValue }, type: $type, langCode: $langCode }) {
      asin
      name
      images {
        thumbnails
      }
      details {
        legend
        value
      }
      country {
        names {
          fr
        }
        iso
        regions {
          names {
            fr
          }
          iso
        }
      }
      type
    }
  }
`

interface GetAlcoholsResponse {
  alcohols: Alcohol[]
}

/* ****************************************************************************** */

const GET_ALCOHOLS_FOR_SITEMAP = gql`
  query GetAlcoholsForSitemap($type: String, $langCode: String) {
    alcohols(filter: { type: $type, langCode: $langCode }) {
      asin
      name
      details {
        legend
        value
      }
      country {
        names {
          fr
        }
        iso
        regions {
          names {
            fr
          }
          iso
        }
      }
      type
      langCode
      updatedAt
    }
  }
`

/* ****************************************************************************** */

const GET_ALCOHOL_FULL = gql`
  query GetAlcohols($asin: String, $type: String, $langCode: String) {
    alcohols(filter: { asin: $asin, type: $type, langCode: $langCode }) {
      _id
      asin
      name
      details {
        legend
        value
      }
      description {
        images
        product
        manufacturer
      }
      familyLinks{
        asin
        thumbSrc
        title
      }
      features
      images {
        bigs
        thumbnails
      }
      country {
        names {
          fr
        }
        iso
        iso3
        regions {
          names {
            fr
          }
          iso
        }
      }
      newerVersion {
        asin
        thumbSrc
        title
      }
      prices {
        basisPrice {currency price}
        priceToPay {currency price}
      }
      reviews {rating ratingCount}
      shortlink
      type
      langCode
    }
  }
`

interface GetAlcoholFullResponse {
  alcohols: Alcohol[]
}

/* ****************************************************************************** */

export function useGraphQL() {
  const fetchCountries = async (variables?: Record<string, any>) => {
    return await useAsyncQuery<GetCountriesResponse>(GET_COUNTRIES, variables)
  }

  const fetchDetails = async (variables?: Record<string, any>) => {
    return await useAsyncQuery<GetDetailsResponse>(GET_DETAILS, variables)
  }

  const fetchAlcoholsByDetailValue = async (variables?: Record<string, any>) => {
    return await useAsyncQuery<GetAlcoholsResponse>(GET_ALCOHOLS_BY_DETAIL_VALUE, variables)
  }

  const fetchAlcoholsForSitemap = async (variables?: Record<string, any>) => {
    return await useAsyncQuery<GetAlcoholsResponse>(GET_ALCOHOLS_FOR_SITEMAP, variables)
  }

  const fetchAlcoholFull = async (variables?: Record<string, any>) => {
    return await useAsyncQuery<GetAlcoholFullResponse>(GET_ALCOHOL_FULL, variables)
  }

  return {
    fetchCountries,
    fetchDetails,
    fetchAlcoholsByDetailValue,
    fetchAlcoholsForSitemap,
    fetchAlcoholFull,
  }
}
