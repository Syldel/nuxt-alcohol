import type { Alcohol } from '~/types/graphql/types'

import { gql } from 'graphql-tag'

import { createApolloClient } from '~/apollo/client'
import { usePageUtils } from '~/composables/usePageUtils'

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

export default defineEventHandler(async (event) => {
  const { generateCanonicalUrl } = usePageUtils()

  // ✅ Récupérer le client Apollo (côté serveur)
  const apolloClient = createApolloClient()

  const langCode = 'fr_FR'
  const type = 'whisky'

  let alcohols: Alcohol[] = []

  try {
    const { data } = await apolloClient.query({
      query: GET_ALCOHOLS_FOR_SITEMAP,
      variables: { type, langCode },
      fetchPolicy: 'no-cache',
    })

    if (!data?.alcohols) {
      return send(event, 404, 'No alcohols found')
    }

    alcohols = data?.alcohols || []
  }
  catch (error) {
    console.error('GraphQL Error:', error)
    return send(event, 500, 'Internal Server Error')
  }

  const urls = alcohols.map(alcohol => ({
    loc: generateCanonicalUrl(alcohol),
    lastmod: new Date(alcohol.updatedAt).toISOString(),
  }))

  setHeader(event, 'Content-Type', 'application/xml')
  return generateSitemap(urls)
})

function generateSitemap(urls: { loc: string, lastmod: string }[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.map(url => `
      <url>
        <loc>${url.loc}</loc>
        <lastmod>${url.lastmod}</lastmod>
      </url>`).join('')}
  </urlset>`
}
