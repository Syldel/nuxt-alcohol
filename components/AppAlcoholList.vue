<script lang="ts" setup>
withDefaults(
  defineProps<{
    alcohols?: Alcohol[]
  }>(),
  {
    alcohols: () => [],
  },
)

const route = useRoute()
</script>

<template>
  <div class="alcohol-list">
    <h2>Liste des alcools</h2>
    <ul v-if="alcohols?.length > 0">
      <li v-for="alcohol in alcohols" :key="alcohol.asin">
        <NuxtLink :to="`${route.path}/${alcohol.asin}`">
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
@use '@/assets/styles/components/titles'
//.alcohol-list
</style>
