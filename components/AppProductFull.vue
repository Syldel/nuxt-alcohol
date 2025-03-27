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
</script>

<template>
  <div class="product-full">
    WIP
  </div>
</template>

<style lang="sass" scoped>
// @use '@/assets/styles/components/titles'
//.product-full
</style>
