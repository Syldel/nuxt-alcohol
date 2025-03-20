<script lang="ts" setup>
import type { CountryInfo } from '~/types/graphql/types'

withDefaults(
  defineProps<{
    countries?: CountryInfo[]
  }>(),
  {
    countries: () => [],
  },
)

const route = useRoute()
</script>

<template>
  <div class="country-list">
    <h2>Liste des pays</h2>
    <ul v-if="countries?.length > 0">
      <li v-for="country in countries" :key="country.iso">
        <NuxtLink :to="`${route.path}/${country.iso?.toLowerCase()}`">
          {{ country.names.fr }}
        </NuxtLink>
      </li>
    </ul>
    <div v-else>
      Aucun pays
    </div>
  </div>
</template>

<style lang="sass" scoped>
//.country-list
</style>
