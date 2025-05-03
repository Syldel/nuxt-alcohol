<script setup lang="ts">
import type { CountryInfo } from '~/types/graphql/types'

const props = withDefaults(
  defineProps<{
    countries?: CountryInfo[]
    brands?: string[]
  }>(),
  {
    countries: () => [],
    brands: () => [],
  },
)
const nuxtApp = useNuxtApp()
const route = useRoute()

const siteOrigin = ref('')

const { capitalizeFirstLetter } = useStringUtils()
const { formatUrl } = usePageUtils()

const normalizePath = (path: string): string => `/${path.replace(/^\/+|\/+$/g, '')}`

const breadcrumbs = computed(() =>
  route.path.split('/').filter(Boolean).map((segment, index, arr) => {
    const lowerName = segment.toLowerCase()
    if (lowerName === 'cl') {
      segment = 'Bières, vins et spiritueux'
    }
    if (lowerName === 'bieres') {
      segment = 'Bières'
    }

    segment = props.countries.find(country => country.iso.toLowerCase() === lowerName)?.names.fr || segment

    segment = props.brands.find(brand => formatUrl(brand) === lowerName) || segment

    const path = normalizePath(`/${arr.slice(0, index + 1).join('/')}`)
    return { name: capitalizeFirstLetter(decodeURIComponent(segment.replace(/-/g, ' '))), path, isLast: index === arr.length - 1 }
  }),
)

// Attendre la fin de l'hydratation avant de récupérer `window.location.origin`
onMounted(() => {
  if (nuxtApp.isHydrating && !nuxtApp.payload.serverRendered) {
    const checkHydration = setInterval(() => {
      if (!nuxtApp.isHydrating) {
        siteOrigin.value = window.location.origin
        clearInterval(checkHydration)
      }
    }, 200)
  }
  else {
    // Si déjà client, récupère immédiatement
    siteOrigin.value = window.location.origin
  }
})

const breadcrumbJsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': breadcrumbs.value.map((crumb, index) => ({
    '@type': 'ListItem',
    'position': index + 1,
    'name': crumb.name,
    'item': `${siteOrigin.value}${crumb.path}`, // Utilise l'URL client après hydratation
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
