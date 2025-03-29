import type { RuntimeConfig } from 'nuxt/schema'

import type { Alcohol } from '~/types/graphql/types'

import { gql } from 'graphql-tag'

import { createApolloClient } from '../apollo/client'
import { usePageUtils } from '../composables/usePageUtils'

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
        iso
      }
      type
      langCode
      updatedAt
    }
  }
`

/* ****************************************************************************** */

export async function getAlcoholRoutes(variables: { type: string, langCode: string }, nuxtRuntimeConfig: RuntimeConfig, options?: { removeBaseUrl: boolean }): Promise<string[]> {
  const { generateCanonicalUrl } = usePageUtils()

  // ✅ Récupérer le client Apollo (côté serveur)
  const apolloClient = createApolloClient(nuxtRuntimeConfig)

  let alcohols: Alcohol[] = []

  try {
    const { data } = await apolloClient.query({
      query: GET_ALCOHOLS_FOR_SITEMAP,
      variables,
      fetchPolicy: 'no-cache', // Ne pas utiliser de cache pour récupérer les données fraîches
    })

    if (!data?.alcohols) {
      return []
    }

    alcohols = data?.alcohols || []
  }
  catch (error) {
    console.error('GraphQL Error:', error)
    return []
  }

  let urls = alcohols.map(alcohol => generateCanonicalUrl(alcohol, nuxtRuntimeConfig))
  if (options?.removeBaseUrl) {
    urls = urls.map(url => url.replace(nuxtRuntimeConfig.public.siteUrl, ''))
  }
  return urls
}
