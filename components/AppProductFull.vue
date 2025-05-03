<script lang="ts" setup>
import type { Alcohol } from '~/types/graphql/types'

const props = defineProps<{
  alcohol: Alcohol
}>()

const alcohol = props.alcohol

useSeoMeta({
  title: `${alcohol.name}`,
  description: `${alcohol.name}`,
  ogTitle: `${alcohol.name}`,
  ogDescription: `${alcohol.name}`,
  // ogUrl: `https://www.maboutique.com/produit/${productAsin}`,
  // ogImage: 'https://example.com/image.png',
})

const thumbAlts = computed(() => alcohol.images?.thumbnails?.map((id, index) => `${alcohol.name} - Thumbnail ${index + 1}`))

function redirectToProduct() {
  window.location.href = `${alcohol.shortlink}`
}
</script>

<template>
  <div class="product-full">
    <AppHorizontalImages
      :ids="alcohol.images?.thumbnails || []"
      :alts="thumbAlts"
    />

    <div class="product-details">
      <h2>Détails</h2>
      <ul>
        <li v-for="(item, index) in alcohol.details" :key="index">
          <strong>{{ item.legend }}:</strong> {{ item.value }}
        </li>
      </ul>

      <h2>À propos</h2>
      <ul>
        <li v-for="(item, index) in alcohol.features" :key="index">
          {{ item }}
        </li>
      </ul>

      <h2>Description</h2>
      <div v-html="alcohol.description?.product" />
    </div>

    <AppBuyButton label="Voir sur Amazon" :on-click="redirectToProduct" />
  </div>
</template>

<style lang="sass" scoped>
@use '@/assets/styles/components/titles'
.product-full
  min-height: size(700)

  display: flex
  flex-direction: column
  gap: size(12)
</style>
