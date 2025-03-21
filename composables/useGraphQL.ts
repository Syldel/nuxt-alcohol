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

const GET_ALCOHOLS = gql`
  query GetAlcohols($detailValue: String, $type: String, $langCode: String) {
    alcohols(filter: { detail: { value: $detailValue }, type: $type, langCode: $langCode }) {
      asin
      name
    }
  }
`

interface GetAlcoholsResponse {
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

  const fetchAlcohols = async (variables?: Record<string, any>) => {
    return await useAsyncQuery<GetAlcoholsResponse>(GET_ALCOHOLS, variables)
  }

  return {
    fetchCountries,
    fetchDetails,
    fetchAlcohols,
  }
}
