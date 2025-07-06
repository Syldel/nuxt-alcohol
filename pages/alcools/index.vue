<script setup lang="ts">
import { ESpiritType } from '@/types/alcohol.type'

const { capitalizeFirstLetter } = useStringUtils()

useHead({
  title: 'Liste de alcools',
  meta: [
    { name: 'description', content: 'Liste de alcools' },
  ],
})

// Crée un tableau à partir de l'enum pour itérer dessus
const spiritTypes = Object.values(ESpiritType)
</script>

<template>
  <section class="alcools">
    <h1><span>Liste de alcools</span></h1>
    Bières, vins et spiritueux
    <ul>
      <li>
        Bières
      </li>
      <li>
        Vins
      </li>
      <li>
        Spiritueux
        <ul>
          <li v-for="type in spiritTypes" :key="type">
            <NuxtLink :to="`/alcools/${type}s`">
              {{ capitalizeFirstLetter(type) }}s
            </NuxtLink>
          </li>
        </ul>
      </li>
    </ul>
  </section>
</template>

<style lang="sass" scoped>
// .alcools
</style>
