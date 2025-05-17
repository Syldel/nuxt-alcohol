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
</script>

<template>
  <div class="alcohol-list">
    <h2>Liste des alcools</h2>
    <ul v-if="alcohols?.length > 0">
      <li v-for="alcohol in alcohols" :key="alcohol.asin">
        <NuxtLink :to="`${generateCanonicalUrl(alcohol, config)}`">
          {{ alcohol.name }}
        </NuxtLink>
      </li>
    </ul>
    <div v-else>
      Aucun produit
    </div>
  </div>
</template>

<style lang="sass" scoped>
//.alcohol-list
</style>
