<script setup lang="ts">
useHead({
  title: 'Design system',
  meta: [
    { name: 'description', content: 'Relaxxed alcohol universe' },
  ],
})
</script>

<template>
  <section class="demo">
    <h1><span>Design system</span></h1>
    <p>Lorem Ipsum</p>
    <NuxtLink to="/">
      Retour à l'accueil
    </NuxtLink>
    <AppSandbox />
  </section>
</template>

<style lang="sass" scoped>
.demo
  p
    color: blue
</style>
