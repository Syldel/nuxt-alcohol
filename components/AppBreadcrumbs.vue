<script setup lang="ts">
import type { CountryInfo } from '~/types/graphql/types'

const props = withDefaults(
  defineProps<{
    countries?: CountryInfo[]
    brands?: string[]
    title?: string
  }>(),
  {
    countries: () => [],
    brands: () => [],
    title: () => '',
  },
)

const route = useRoute()

const { capitalizeFirstLetter } = useStringUtils()
const { formatUrl } = usePageUtils()

const normalizePath = (path: string): string => `/${path.replace(/^\/+|\/+$/g, '')}`

const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl

function removeAsin(name: string) {
  return name.replace(/\sB[0-9A-Z]{9,10}$/, '')
}

const breadcrumbs = computed(() =>
  route.path.split('/').filter(Boolean).map((segment, index, arr) => {
    const isLast = index === arr.length - 1
    const lowerName = segment.toLowerCase()

    if (lowerName === 'cl')
      segment = 'Bières, vins et spiritueux'
    else if (lowerName === 'bieres')
      segment = 'Bières'

    segment = props.countries.find(country => country.iso.toLowerCase() === lowerName)?.names.fr || segment
    segment = props.brands.find(brand => formatUrl(brand) === lowerName) || segment

    let nameFormatted = capitalizeFirstLetter(decodeURIComponent(removeAsin(segment.replace(/-/g, ' '))))
    if (isLast && props.title?.trim()) {
      nameFormatted = capitalizeFirstLetter(props.title.trim())
    }

    const path = normalizePath(`/${arr.slice(0, index + 1).join('/')}`)

    return { name: nameFormatted, path, isLast }
  }),
)

const breadcrumbJsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': breadcrumbs.value.map((crumb, index) => ({
    '@type': 'ListItem',
    'position': index + 1,
    'name': crumb.name,
    'item': `${siteUrl}${crumb.path}`,
  })),
}))

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(breadcrumbJsonLd.value),
    },
  ],
})

// To remove the last element
const filteredBreadcrumbs = computed(() => breadcrumbs.value.slice(0, breadcrumbs.value.length - 1))
</script>

<template>
  <nav aria-label="Fil d'Ariane" class="breadcrumbs">
    <ul>
      <!-- <li>
        <NuxtLink to="/">
          Accueil
        </NuxtLink>
      </li> -->
      <li v-for="(crumb, index) in filteredBreadcrumbs" :key="index">
        <span v-if="crumb.isLast">{{ crumb.name }}</span>
        <NuxtLink v-else :to="crumb.path">
          {{ crumb.name }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style lang="sass" scoped>
.breadcrumbs
  font-size: size(14)

  ul
    list-style: none
    display: flex
    gap: 5px
    padding: 0
    margin: 0
    flex-flow: wrap

    li
      display: flex
      align-items: center

      &:not(:last-child)::after
        content: "›"
        margin: 0 size(5)
</style>
