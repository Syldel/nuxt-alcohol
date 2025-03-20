import type { CountryInfo } from '~/types/graphql/types'

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

export function useGraphQL() {
  const fetchCountries = async (variables?: Record<string, any>) => {
    return await useAsyncQuery<GetCountriesResponse>(GET_COUNTRIES, variables)
  }

  return {
    fetchCountries,
  }
}
