import { useRuntimeConfig } from '#imports'

import { getAlcoholRoutes } from '../../utils/getRoutes'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  let allRoutes: string[] = []

  const type = 'whisky'
  const langCode = 'fr_FR'

  try {
    allRoutes = await getAlcoholRoutes({ type, langCode }, config, { removeBaseUrl: false })
  }
  catch (error) {
    console.error('GraphQL Error:', error)
    return send(event, 500, 'Internal Server Error')
  }

  const urls = allRoutes.map(urls => ({
    loc: urls,
    lastmod: new Date().toISOString(),
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
