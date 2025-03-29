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

/**
 * Generates all parent URLs for a given URL path.
 * @param url - The URL path to process.
 * @returns An array of parent URLs.
 */
function generateParentUrls(url: string): string[] {
  const parts = url.split('/').filter(Boolean)
  const parents: string[] = []

  for (let i = 1; i <= parts.length; i++) {
    parents.push(`/${parts.slice(0, i).join('/')}`)
  }

  return parents
}

/**
 * Generates a set of unique parent URLs from a set or array of URLs.
 * @param routes - The set or array of URL paths.
 * @returns A sorted array of unique parent URLs.
 */
export function generateUniqueParentUrls(routes: Set<string> | string[]): string[] {
  const allParents = new Set<string>()

  routes.forEach((url) => {
    generateParentUrls(url).forEach(parent => allParents.add(parent))
  })

  return Array.from(allParents).sort()
}
