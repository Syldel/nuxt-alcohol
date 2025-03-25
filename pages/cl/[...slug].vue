<script setup lang="ts">
import type { Alcohol, CountryInfo } from '~/types/graphql/types'

const route = useRoute()

let slugParamArr: string[] = []
if (Array.isArray(route.params.slug)) {
  slugParamArr = route.params.slug
}
else {
  slugParamArr = [route.params.slug]
}

slugParamArr = slugParamArr.filter(s => !!s)

// 0 => ex: spiritueux
// 1 => ex: whiskys
// 2 => country
// 3 => brand
// 4 => product

const { extractASIN } = useAmznUtils()

const productASIN = extractASIN(slugParamArr.join('/'))

function getPageType() {
  if (slugParamArr.length === 0) {
    return 'root'
  }

  if (slugParamArr.length === 1) {
    const slug = slugParamArr[0].toLowerCase().trim()
    if (['spiritueux', 'spirit'].includes(slug)) {
      return 'spiritueux'
    }
  }

  if (slugParamArr.length === 1) {
    const slug = slugParamArr[0].toLowerCase().trim()
    if (['bières', 'bieres'].includes(slug)) {
      return 'bieres'
    }
  }

  if (slugParamArr.length === 2) {
    const slug = slugParamArr[1].toLowerCase().trim()
    if (['whiskys', 'whiskies', 'whiskeys'].includes(slug)) {
      return 'whiskys'
    }
  }

  if (slugParamArr.length === 3) {
    return 'country'
  }

  if (slugParamArr.length === 4) {
    return 'brand'
  }

  if (productASIN) {
    return 'product'
  }

  return 'unknown'
}

const pageType = getPageType()

const countriesRef = ref<CountryInfo[]>([])
const statusRef = ref()
const errorRef = ref()

const brandsRef = ref<string[]>([])
const alcoholsRef = ref<Alcohol[]>([])

const langCode = 'fr_FR'
const type = 'whisky'

if (slugParamArr.length >= 2) {
  const { fetchCountries } = useGraphQL()
  const { data, status, error } = await fetchCountries({ type, langCode })

  statusRef.value = status
  errorRef.value = error
  countriesRef.value = data?.value?.getUniqueCountries || []
}

if (pageType === 'country') {
  const { fetchDetails } = useGraphQL()
  const iso = slugParamArr[2]
  const { data, status, error } = await fetchDetails({ legend: 'Marque', iso, type, langCode })

  statusRef.value = status
  errorRef.value = error
  brandsRef.value = data?.value?.getUniqueDetails || []
}

if (pageType === 'brand') {
  const { fetchAlcohols } = useGraphQL()
  const brand = slugParamArr[3]
  const { data, status, error } = await fetchAlcohols({ detailValue: brand, type, langCode })

  statusRef.value = status
  errorRef.value = error
  alcoholsRef.value = data?.value?.alcohols || []
}

if (pageType === 'product') {
  const { fetchAlcoholFull } = useGraphQL()
  const { data, status, error } = await fetchAlcoholFull({ asin: productASIN, type, langCode })

  statusRef.value = status
  errorRef.value = error
  alcoholsRef.value = data?.value?.alcohols || []
}

slugParamArr = slugParamArr.map((slug) => {
  if (slug === 'bieres') {
    slug = 'bières'
  }
  if (pageType === 'country') {
    slug = countriesRef.value.find(country => country.iso.toLowerCase() === slug)?.names.fr || slug
  }
  if (pageType === 'product') {
    slug = alcoholsRef.value[0]?.name || slug
  }
  return slug
})

const { capitalizeFirstLetter } = useStringUtils()

const slugParamStr = slugParamArr.map(slug => capitalizeFirstLetter(slug)).join(' / ')

useHead({
  title: `${slugParamStr || 'Bières, vins et spiritueux'} | Relaxxed spirits`,
  meta: [
    { name: 'description', content: `${slugParamStr || 'Bières, vins et spiritueux'} | Relaxxed spirits` },
  ],
})
</script>

<template>
  <section class="category-listing">
    <AppBreadcrumbs :countries="countriesRef" />
    <h1><span>{{ capitalizeFirstLetter(slugParamArr[slugParamArr.length - 1] || 'Bières, vins et spiritueux') }}</span></h1>

    <div v-if="statusRef?.value === 'pending'">
      <div class="spinner-loader" />
    </div>
    <div v-else-if="statusRef?.value === 'error'" class="category-listing__error">
      {{ errorRef?.value?.message || 'Erreur inconnue' }}
    </div>

    <div v-if="pageType === 'root'">
      <ul>
        <li>
          <NuxtLink to="/cl/bieres">
            Bières
          </NuxtLink>
        </li>
        <li>
          Vins
        </li>
        <li>
          <NuxtLink to="/cl/spiritueux">
            Spiritueux
          </NuxtLink>
        </li>
      </ul>
    </div>

    <div v-else-if="pageType === 'spiritueux'">
      <ul>
        <li>
          <NuxtLink :to="`/cl/${slugParamArr.join('/')}/whiskys`">
            Whiskys
          </NuxtLink>
        </li>
        <li>
          Rhums
        </li>
        <li>
          Vodkas
        </li>
      </ul>
    </div>

    <div v-else-if="pageType === 'bieres'">
      Visitez notre site partenaire :
      <NuxtLink to="https://www.beer-me.fr/">
        https://www.beer-me.fr/
      </NuxtLink>
    </div>

    <div v-else-if="pageType === 'whiskys'">
      <AppCountryList :countries="countriesRef" />
    </div>

    <div v-else-if="pageType === 'country'">
      <AppBrandList :brands="brandsRef" />
    </div>

    <div v-else-if="pageType === 'brand'">
      <AppAlcoholList :alcohols="alcoholsRef" />
    </div>

    <div v-else-if="pageType === 'product'">
      <AppProductFull :alcohol="alcoholsRef[0]" />
    </div>
  </section>
</template>

<style lang="sass" scoped>
@use '@/assets/styles/components/spinner-loader'
@use '@/assets/styles/components/titles'

.category-listing
  &__error
    color: var(--danger700)
</style>
