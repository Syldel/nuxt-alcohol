<script setup lang="ts">
import type { Alcohol } from '~/types/graphql/types'

const { getSpiritTypeFromSlug } = usePageUtils()
const route = useRoute()

let typeParamArr: string[] = []
if (Array.isArray(route.params.type)) {
  typeParamArr = route.params.type
}
else {
  typeParamArr = [route.params.type]
}
typeParamArr = typeParamArr.filter(s => !!s)

const productType = typeParamArr[0].trim()

const gqlParamType = getSpiritTypeFromSlug(typeParamArr?.[0] ?? '')
if (!gqlParamType) {
  throw new Error('Unknown alcohol type in route')
}

useHead({
  title: `Liste de ${productType}`,
  meta: [
    { name: 'description', content: `Liste de ${productType}` },
  ],
})

const config = useRuntimeConfig()
const { generateCanonicalUrl } = usePageUtils()

const { fetchAlcoholsForSitemap } = useGraphQL()
const { data, status, error } = await fetchAlcoholsForSitemap({ type: gqlParamType, langCode: 'fr_FR' })

interface GroupedProducts {
  [country: string]: {
    name: string
    brands: {
      [brand: string]: Alcohol[]
    }
  }
}

function groupProducts(products: Alcohol[]) {
  return products.reduce<GroupedProducts>((acc, product: Alcohol) => {
    const countryIso = product.country?.iso || 'Unknown'
    const countryName = product.country?.names.fr || 'Pays inconnu'

    // Trouver la marque dans les détails
    const brandDetail = product.details?.find(detail =>
      ['marque', 'brand'].some(keyword =>
        detail.legend.toLowerCase().includes(keyword.toLowerCase()),
      ),
    )
    const brandName = brandDetail ? brandDetail.value : 'Sans marque'

    // Initialiser le pays s'il n'existe pas
    if (!acc[countryIso]) {
      acc[countryIso] = {
        name: countryName,
        brands: {},
      }
    }

    // Initialiser la marque dans ce pays
    if (!acc[countryIso].brands[brandName]) {
      acc[countryIso].brands[brandName] = []
    }

    // Ajouter le produit
    acc[countryIso].brands[brandName].push(product)
    return acc
  }, {} as GroupedProducts)
}

const groupedProducts = computed(() => groupProducts(data.value?.alcohols || []))
</script>

<template>
  <section class="product-list">
    <h1><span>Liste de {{ productType }}</span></h1>
    <NuxtLink to="/">
      Retour à l'accueil
    </NuxtLink>

    <div v-if="status === 'pending'">
      ⏳ Chargement...
    </div>
    <div v-else-if="status === 'error'" class="product-list__error">
      {{ error?.message || 'Erreur inconnue' }}
    </div>

    <p>Nombre de produits: {{ data?.alcohols.length }}</p>

    <div v-for="(countryData, countryIso) in groupedProducts" :key="countryIso">
      <h2>
        {{ countryData.name }} ({{ countryIso }})
      </h2>

      <ul>
        <li v-for="(products, brand) in countryData.brands" :key="brand" class="product-list__li">
          <h3>{{ brand }}</h3>
          <ul>
            <li v-for="product in products" :key="product.asin">
              <NuxtLink :to="generateCanonicalUrl(product, config)">
                {{ product.name }}
              </NuxtLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </section>
</template>

<style lang="sass" scoped>
.product-list
  &__error
    color: var(--danger700)

  &__li
    margin: size(8) 0
</style>
