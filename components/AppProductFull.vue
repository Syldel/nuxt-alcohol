<script lang="ts" setup>
import type { Alcohol } from '~/types/graphql/types'

defineProps<{
  alcohol: Alcohol
}>()
</script>

<template>
  <div class="product-full">
    <p>{{ alcohol?.name }}</p>
  </div>
</template>

<style lang="sass" scoped>
// @use '@/assets/styles/components/titles'
//.product-full
</style>
