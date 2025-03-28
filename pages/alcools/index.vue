<script setup lang="ts">
useHead({
  title: 'Liste de alcools',
  meta: [
    { name: 'description', content: 'Liste de alcools' },
  ],
})
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
          <li>
            <NuxtLink to="/alcools/whiskys">
              Whiskys
            </NuxtLink>
          </li>
          <li>
            Rhums
          </li>
          <li>
            Vodkas
          </li>
        </ul>
      </li>
    </ul>
  </section>
</template>

<style lang="sass" scoped>
// .alcools
</style>
