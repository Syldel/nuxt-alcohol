<script lang="ts" setup>
import type { Alcohol } from '~/types/graphql/types'

const props = defineProps<{
  alcohol: Alcohol
}>()

const alcohol = props.alcohol

const { getAmazonImageUrl } = useAmznUtils()

const thumbnailId = alcohol.images?.thumbnails?.[0]
const thumbnailUrl = thumbnailId
  ? getAmazonImageUrl(thumbnailId, { width: 320, height: 320 })
  : undefined

useSeoMeta({
  title: `${alcohol.ai?.metaTitle || alcohol.name}`,
  description: `${alcohol.ai?.metaDescription || alcohol.name}`,
  ogTitle: `${alcohol.ai?.og?.title || alcohol.name}`,
  ogDescription: `${alcohol.ai?.og?.description || alcohol.name}`,
  // ogUrl: `https://www.maboutique.com/produit/${productAsin}`,
  ogImage: thumbnailUrl,
})

const thumbAlts = computed(() => alcohol.images?.thumbnails?.map((id, index) => `${alcohol.name} - Thumbnail ${index + 1}`))

const config = useRuntimeConfig()
const amazonTag = config.public.amazonTag
const amazonProductLink = `https://www.amazon.fr/dp/${alcohol.asin}/?tag=${amazonTag}`

function redirectToProduct() {
  window.open(amazonProductLink, '_blank')
}

function getBrand(alcohol: Alcohol): string | undefined {
  const details = alcohol.ai?.details ?? alcohol.details ?? []
  const brandDetail = details.find(item => item.legend === 'Marque')
  return brandDetail?.value
}

function cleanAndTruncate(input: string, maxLength = 300): string {
  if (!input)
    return ''

  // Supprimer les balises HTML
  const textOnly = input
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (textOnly.length <= maxLength)
    return textOnly

  // Tronquer à la dernière phrase complète (.)
  const truncated = textOnly.slice(0, maxLength)
  const lastPeriod = truncated.lastIndexOf('.')

  if (lastPeriod > 50) {
    // S’il y a un point suffisamment tôt, on coupe là
    return truncated.slice(0, lastPeriod + 1).trim()
  }

  // Sinon, on coupe proprement au dernier espace
  const lastSpace = truncated.lastIndexOf(' ')
  return `${truncated.slice(0, lastSpace).trim()}…`
}

function convertCurrencySymbolToISO(symbol: string): string {
  const map: Record<string, string> = {
    '€': 'EUR',
    '$': 'USD',
    '£': 'GBP',
  }
  return map[symbol] || symbol
}

const jsonLdProduct = computed(() => {
  const a = props.alcohol
  if (!a || !(alcohol.ai?.h1 || alcohol.name) || !a.asin || !amazonTag)
    return null

  const name = alcohol.ai?.h1 || alcohol.name
  const rawDescription = alcohol.ai?.description || alcohol.description?.product || ''
  const description = rawDescription
    ? cleanAndTruncate(rawDescription)
    : `Découvrez ${name}, disponible sur Amazon.`
  const brand = getBrand(a) || 'Marque inconnue'
  const priceDetail = a.prices?.[0]?.priceToPay ?? a.prices?.[0]?.basisPrice
  const price = priceDetail?.price
  const currency = convertCurrencySymbolToISO(priceDetail?.currency ?? 'EUR')

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    'image': thumbnailUrl ? [thumbnailUrl] : [],
    description,
    'sku': a.asin,
    'brand': {
      '@type': 'Brand',
      'name': brand,
    },
    'offers': price
      ? {
          '@type': 'Offer',
          'url': amazonProductLink,
          'priceCurrency': currency,
          'price': price,
          'availability': 'https://schema.org/InStock',
        }
      : undefined,
    'aggregateRating': a.reviews?.rating
      ? {
          '@type': 'AggregateRating',
          'ratingValue': a.reviews.rating,
          'reviewCount': a.reviews.ratingCount || 1,
        }
      : undefined,
  }
})

const jsonLdFAQ = computed(() => {
  const faq = props.alcohol.ai?.faq
  if (!faq || faq.length === 0)
    return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faq.map(item => ({
      '@type': 'Question',
      'name': item.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.answer,
      },
    })),
  }
})

const jsonLdCocktails = computed(() => {
  const cocktails = props.alcohol.ai?.cocktails
  if (!cocktails || cocktails.length === 0)
    return []

  return cocktails.map(cocktail => ({
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    'name': cocktail.title,
    'description': `Cocktail idea featuring ${alcohol.ai?.metaTitle || alcohol.name}`,
    'recipeIngredient': cocktail.ingredients,
    'recipeInstructions': cocktail.instructions,
    'recipeCategory': 'Cocktail',
  }))
})

const ldScripts = computed(() => {
  const scripts = []

  if (jsonLdProduct.value) {
    scripts.push({
      type: 'application/ld+json',
      children: JSON.stringify(jsonLdProduct.value),
    })
  }

  if (jsonLdFAQ.value) {
    scripts.push({
      type: 'application/ld+json',
      children: JSON.stringify(jsonLdFAQ.value),
    })
  }

  if (jsonLdCocktails.value.length) {
    jsonLdCocktails.value.forEach((entry) => {
      scripts.push({
        type: 'application/ld+json',
        children: JSON.stringify(entry),
      })
    })
  }

  return scripts
})

useHead(() => ({
  script: ldScripts.value,
}))
</script>

<template>
  <article class="product-full">
    <header>
      <h1>{{ alcohol.ai?.h1 || alcohol.name }}</h1>
    </header>

    <section class="product-images">
      <AppHorizontalImages
        :ids="alcohol.images?.thumbnails || []"
        :alts="thumbAlts"
      />
    </section>

    <div class="product-layout">
      <section class="product-layout__left product-card product-details">
        <h2>Détails</h2>
        <dl>
          <template v-for="(item, index) in (alcohol.ai?.details && alcohol.ai.details.length > 0 ? alcohol.ai.details : alcohol.details)" :key="index">
            <dt>{{ item.legend }}</dt>
            <dd>{{ item.value }}</dd>
          </template>
        </dl>
      </section>

      <section
        v-if="alcohol.ai?.description || alcohol.description?.product"
        class="product-layout__right product-card product-description"
      >
        <h2>Description</h2>
        <div v-html="alcohol.ai?.description || alcohol.description?.product" />
      </section>
    </div>

    <!-- TODO: Remove this later -->
    <section v-if="!alcohol.ai?.description" class="product-card">
      <h2>À propos</h2>
      <ul>
        <li v-for="(item, index) in alcohol.features" :key="index">
          {{ item }}
        </li>
      </ul>
    </section>

    <section
      v-if="alcohol.ai?.faq && alcohol.ai.faq.length > 0"
      class="product-card product-faq"
    >
      <h2>Foire aux questions (FAQ)</h2>
      <dl>
        <div v-for="(item, index) in alcohol.ai.faq" :key="index">
          <dt>
            {{ item.question }}
          </dt>
          <dd>
            {{ item.answer }}
          </dd>
        </div>
      </dl>
    </section>

    <section
      v-if="alcohol.ai?.cocktails?.length"
      class="product-card product-cocktails"
    >
      <h2>Idées de cocktails</h2>
      <div class="cocktail-grid">
        <article
          v-for="(cocktail, index) in alcohol.ai.cocktails"
          :key="index"
          class="product-card"
        >
          <h3 class="cocktail-title">
            {{ cocktail.title }}
          </h3>

          <h4>Ingrédients</h4>
          <ul class="cocktail-ingredients">
            <li v-for="(ingredient, i) in cocktail.ingredients" :key="i">
              {{ ingredient }}
            </li>
          </ul>

          <h4>Instructions</h4>
          <p class="cocktail-instructions">
            {{ cocktail.instructions }}
          </p>
        </article>
      </div>
    </section>

    <AppBuyButton label="Voir sur Amazon" :on-click="redirectToProduct" />
  </article>
</template>

<style lang="sass" scoped>
.product-full
  min-height: size(700)

  display: flex
  flex-direction: column
  gap: size(16)

  .product-card
    background-color: rgba(217, 209, 184, 0.15)
    padding: size(18)
    border-radius: size(8)
    box-shadow: 0 size(4) size(12) rgba(0, 0, 0, 0.1)

    h2
      margin-bottom: size(12)

  .product-details
    dl
      margin: 0
      dt
        margin-top: size(10)
        letter-spacing: 0.05em
        position: relative
        padding-left: size(16)
        font-weight: 600

        &::before
          content: "■"
          color: var(--primary500)
          position: absolute
          left: 0
          top: 50%
          transform: translateY(-50%)

        &:first-child
          margin-top: 0

      dd
        margin-left: size(16)
        margin-top: size(2)
        color: var(--primary500)

  .product-layout
    display: flex
    gap: size(16)

    @include until-breakpoint(phone)
      flex-direction: column

    &__left
      width: 30%
      @include until-breakpoint(phone)
        width: 100%

    &__right
      width: 70%
      @include until-breakpoint(phone)
        width: 100%

  .product-faq
    dl
      display: flex
      flex-direction: column
      gap: size(12)

      dt
        font-weight: bold

      dd
        margin-left: size(8)

  .product-cocktails
    .cocktail-grid
      display: flex
      flex-wrap: wrap
      gap: size(12)

      .product-card
        flex: 1 1 calc((100% / 3) - size(12))
        min-width: size(250)
        margin-bottom: size(6)

        .cocktail-title
          font-weight: bold
          margin-bottom: size(4)

        h4
          font-size: size(16)
          margin-top: size(10)
          margin-bottom: size(4)
          color: var(--primary300)

        .cocktail-ingredients
          list-style: disc inside
          margin: 0

        .cocktail-instructions
          font-style: italic
          margin: 0
</style>
