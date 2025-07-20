<script lang="ts" setup>
import type { Alcohol } from '~/types/graphql/types'

withDefaults(
  defineProps<{
    alcohols?: Alcohol[]
  }>(),
  {
    alcohols: () => [],
  },
)

const config = useRuntimeConfig()
const { generateCanonicalUrl } = usePageUtils()
const { getAmazonImageUrl } = useAmznUtils()
</script>

<template>
  <div class="alcohol-list">
    <h2>Liste des alcools</h2>
    <ul v-if="alcohols?.length > 0" class="alcohol-grid">
      <li v-for="alcohol in alcohols" :key="alcohol.asin" class="alcohol-item">
        <NuxtLink :to="generateCanonicalUrl(alcohol, config)" class="alcohol-link">
          <img
            v-if="alcohol.images?.thumbnails?.[0]"
            :src="getAmazonImageUrl(alcohol.images.thumbnails[0], { width: 320, height: 320 })"
            :alt="alcohol.ai?.h1 || alcohol.name"
            class="alcohol-thumbnail"
          >
          <span class="alcohol-name">
            {{ alcohol.ai?.h1 || alcohol.name }}
          </span>
        </NuxtLink>
      </li>
    </ul>
    <div v-else>
      Aucun produit
    </div>
  </div>
</template>

<style lang="sass" scoped>
.alcohol-list
  .alcohol-grid
    display: grid
    grid-template-columns: repeat(auto-fill, minmax(size(160), 1fr))
    gap: size(16)
    list-style: none
    padding: 0
    margin: size(32) 0

  .alcohol-item
    background-color: rgba(217, 209, 184, 0.45)
    border-radius: size(8)
    overflow: hidden
    box-shadow: 0 size(2) size(4) rgba(0, 0, 0, 0.05)
    text-align: center
    transition: transform 0.2s ease

    &:hover
      transform: translateY(size(-2))

  .alcohol-link
    display: flex
    flex-direction: column
    align-items: center
    text-decoration: none
    color: inherit
    padding: size(16)

  .alcohol-thumbnail
    max-width: 100%
    height: auto
    object-fit: contain
    margin-bottom: size(8)
    border-radius: size(4)

  .alcohol-name
    font-size: size(14)
    text-align: center
</style>
