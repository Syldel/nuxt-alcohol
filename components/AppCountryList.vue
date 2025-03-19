<script lang="ts" setup>
import type { CountryInfo } from '~/types/graphql/types'

const props = defineProps({
  type: {
    type: String,
    default: 'whisky',
  },
  langCode: {
    type: String,
    default: 'fr_FR',
  },
})

const route = useRoute()

const GET_COUNTRIES = gql`
  query {
    getUniqueCountries(filter: { type: "${props.type}", langCode: "${props.langCode}" }) {
      names {
        en
        fr
      }
      iso
      iso3
      regions {
        names {
          en
          fr
        }
        iso
      }
    }
  }
`

interface GetCountriesResponse {
  getUniqueCountries: CountryInfo[]
}

const { data, status, error } = await useAsyncQuery<GetCountriesResponse>(GET_COUNTRIES)

const countriesRef = ref(data.value?.getUniqueCountries)
</script>

<template>
  <div class="country-list">
    <h2>Liste des pays</h2>
    <div v-if="status === 'pending'">
      Chargement...
    </div>
    <div v-else-if="status === 'error'" class="country-list__error">
      {{ error?.message || 'Erreur inconnue' }}
    </div>
    <ul v-else-if="countriesRef">
      <li v-for="country in countriesRef" :key="country.iso">
        <NuxtLink :to="`${route.path}/${country.iso?.toLowerCase()}`">
          {{ country.names.fr }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<style lang="sass" scoped>
.country-list
  &__error
    color: var(--danger700)
</style>
