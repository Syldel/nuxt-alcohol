<script setup lang="ts">
useHead({
  title: 'Accueil',
  meta: [
    { name: 'description', content: 'Relaxxed alcohol universe' },
  ],
})
</script>

<template>
  <section class="home">
    <h1><span>Bienvenue</span> sur ce nouveau site</h1>
    <p>Lorem Ipsum</p>
    <AppSandbox />
  </section>
</template>

<style lang="sass" scoped>
.home
  p
    color: blue
</style>
