export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl

  const rules = `User-agent: *\nSitemap: ${siteUrl}/sitemap.xml`

  setHeader(event, 'Content-Type', 'text/plain')
  return rules
})
