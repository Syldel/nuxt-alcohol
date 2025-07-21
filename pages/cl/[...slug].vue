<script setup lang="ts">
import type { Alcohol, CountryInfo } from '~/types/graphql/types'

import { ESpiritType } from '@/types/alcohol.type'

const spiritTypes = Object.values(ESpiritType)

const route = useRoute()

let slugParamArr: string[] = []
if (Array.isArray(route.params.slug)) {
  slugParamArr = route.params.slug
}
else {
  slugParamArr = [route.params.slug]
}

slugParamArr = slugParamArr.filter(s => !!s)

const { extractASIN } = useAmznUtils()
const productASIN = extractASIN(slugParamArr.join('/'))

const config = useRuntimeConfig()
const { getPageType, getCanonicalUrl, generateCanonicalUrl, formatUrl, getSpiritTypeFromSlug } = usePageUtils()

const pageType = getPageType(slugParamArr)

function isSpiritType(value: string): value is ESpiritType {
  return spiritTypes.includes(value as ESpiritType)
}
const isSpiritPageType = computed(() => isSpiritType(pageType))

const countriesRef = ref<CountryInfo[]>([])
const statusRef = ref()
const errorRef = ref()

const brandsRef = ref<string[]>([])
const alcoholsRef = ref<Alcohol[]>([])

const langCode = 'fr_FR'
let type: ESpiritType = ESpiritType.WHISKY
if (slugParamArr.length >= 2) {
  const detectedType = getSpiritTypeFromSlug(slugParamArr[1])
  if (detectedType) {
    type = detectedType
  }
}

let allBrands: string[] = []

if (slugParamArr.length >= 2) {
  const { fetchCountries, fetchDetails } = useGraphQL()
  const { data, status, error } = await fetchCountries({ type, langCode })
  const { data: brandData } = await fetchDetails({ legend: 'Marque', type, langCode })

  allBrands = brandData?.value?.getUniqueDetails || []

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
  const { fetchAlcoholsByDetailValue } = useGraphQL()
  const brand = allBrands.find(brand => formatUrl(brand) === slugParamArr[3])
  const { data, status, error } = await fetchAlcoholsByDetailValue({ detailValue: brand, type, langCode })

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

const slugConvertedArr = slugParamArr.map((slug, index) => {
  if (slug === 'beer') {
    slug = 'bières'
  }
  if (index === 2) { // convert country iso
    slug = countriesRef.value.find(country => country.iso.toLowerCase() === slug)?.names.fr || slug
  }
  if (index === 3) { // convert brand name
    slug = allBrands.find(brand => formatUrl(brand) === slug) || slug
  }
  if (index === 4) { // convert product name
    slug = alcoholsRef.value[0]?.ai?.h1 || alcoholsRef.value[0]?.name || slug
  }
  return slug
})

const { capitalizeFirstLetter } = useStringUtils()

if (slugConvertedArr.length > 1) {
  slugConvertedArr.shift()
}

const slugParamStr = slugConvertedArr.map(slug => capitalizeFirstLetter(slug)).join(' / ')

const canonicalUrl = (pageType === 'product' && alcoholsRef.value[0]) ? generateCanonicalUrl(alcoholsRef.value[0], config) : getCanonicalUrl(slugParamArr, config)

useHead({
  title: `${slugParamStr || 'Bières, vins et spiritueux'}`,
  meta: [
    { name: 'description', content: `${slugParamStr || 'Bières, vins et spiritueux'}` },
  ],
  link: [
    {
      rel: 'canonical',
      href: canonicalUrl,
    },
  ],
})

if (pageType === 'product' && alcoholsRef.value[0]) {
  useSeoMeta({
    ogUrl: canonicalUrl ?? undefined,
  })
}
</script>

<template>
  <section class="category-listing">
    <AppBreadcrumbs :countries="countriesRef" :brands="allBrands" :title="slugConvertedArr[slugConvertedArr.length - 1]" />
    <h1 v-if="pageType !== 'product'">
      <span>{{ capitalizeFirstLetter(slugConvertedArr[slugConvertedArr.length - 1] || 'Bières, vins et spiritueux') }}</span>
    </h1>

    <div v-if="statusRef?.value === 'pending'">
      ⏳ Chargement...
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
        <li v-for="spiritType in spiritTypes" :key="spiritType">
          <NuxtLink :to="`/cl/${slugParamArr.join('/')}/${spiritType}s`">
            {{ capitalizeFirstLetter(spiritType) }}s
          </NuxtLink>
        </li>
      </ul>
    </div>

    <div v-else-if="pageType === 'beer'">
      Visitez notre site partenaire :
      <NuxtLink to="https://www.beer-me.fr/">
        https://www.beer-me.fr/
      </NuxtLink>
    </div>

    <div v-else-if="isSpiritPageType">
      <AppCountryList :countries="countriesRef" />
    </div>

    <div v-else-if="pageType === 'country'">
      <AppBrandList :brands="brandsRef" />
    </div>

    <div v-else-if="pageType === 'brand'">
      <AppAlcoholList :alcohols="alcoholsRef" />
    </div>

    <div v-else-if="pageType === 'product'">
      <AppProductFull v-if="alcoholsRef[0]" :alcohol="alcoholsRef[0]" />
      <div v-else class="category-listing__error">
        Produit non trouvé!
      </div>
    </div>
  </section>
</template>

<style lang="sass" scoped>
.category-listing
  display: flex
  flex-direction: column
  gap: size(8)

  &__error
    color: var(--danger700)
</style>
