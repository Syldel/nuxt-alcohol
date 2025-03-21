<script lang="ts" setup>
withDefaults(
  defineProps<{
    brands?: srting[]
  }>(),
  {
    brands: () => [],
  },
)

const route = useRoute()
</script>

<template>
  <div class="brand-list">
    <h2>Liste des marques</h2>
    <ul v-if="brands?.length > 0">
      <li v-for="brand in brands" :key="brand">
        <NuxtLink :to="`${route.path}/${brand?.toLowerCase()}`">
          {{ brand }}
        </NuxtLink>
      </li>
    </ul>
    <div v-else>
      Aucune marque
    </div>
  </div>
</template>

<style lang="sass" scoped>
//.brand-list
</style>
