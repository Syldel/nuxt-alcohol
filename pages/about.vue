<script setup lang="ts">
useHead({
  title: 'À propos',
  meta: [
    { name: 'description', content: 'À propos de ce site' },
  ],
})
</script>

<template>
  <section class="about">
    <h1><span>À propos</span></h1>
    <NuxtLink to="/">
      Retour à l'accueil
    </NuxtLink>
  </section>
</template>

<style lang="sass" scoped>
.about
  p
    color: blue
</style>
