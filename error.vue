<script setup lang="ts">
const error = useError()

useHead({
  title: computed(() => `${error?.value?.statusCode || 'Erreur inconnue'} | Relaxxed spirits`),
  meta: [
    {
      name: 'robots',
      content: computed(() => (error?.value?.statusCode === 404 ? 'noindex, follow' : 'noindex, nofollow')),
    },
    { name: 'description', content: computed(() => error?.value?.statusMessage || 'Une erreur est survenue.') },
  ],
})
</script>

<template>
  <NuxtLayout>
    <div class="error-page">
      <div class="error-content">
        <h1>{{ error?.statusCode || 'Oops!' }}</h1>
        <p>{{ error?.statusMessage || 'Something went wrong' }}</p>
        <NuxtLink to="/" class="error-link">
          <button>Retour à l'accueil</button>
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>

<style lang="sass" scoped>
@use '@/assets/styles/components/alcohol-button'

.error-page
  display: flex
  align-items: center
  justify-content: center
  text-align: center

  .error-content
    h1
      font-size: 5rem
      font-weight: bold

    p
      font-size: 1.5rem
      margin-top: 0.5rem
</style>
