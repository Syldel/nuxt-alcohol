<script setup lang="ts">
useHead({
  title: 'Accueil',
  meta: [
    { name: 'description', content: 'Relaxxed spirits' },
  ],
})
</script>

<template>
  <section class="home">
    <h1><span>Bienvenue</span> sur "Relaxxed spirits"</h1>
    <NuxtLink to="/cl">
      Bières, vins et spiritueux
    </NuxtLink>
    <ul>
      <li>
        <NuxtLink to="/cl/bieres">
          Bières
        </NuxtLink>
      </li>
      <li>
        Vins
      </li>
      <li>
        <NuxtLink to="/cl/spiritueux">
          Spiritueux
        </NuxtLink>
      </li>
    </ul>
    <p>Ici, on parle de tout ce qui se boit, avec plaisir et sans prise de tête : bières, vins, spiritueux… On est là pour partager avec vous nos coups de cœur, des bons plans, et plein de conseils pour bien choisir ce que vous allez lever dans votre verre. Que vous soyez plutôt bière artisanale, vin de qualité ou un bon vieux whisky, vous allez trouver de quoi satisfaire vos envies.</p>
    <p>Sur le site, on vous raconte tout ce qu’il faut savoir sur vos boissons préférées : les secrets de fabrication, les meilleures associations, et même des petites anecdotes sympas sur les producteurs. Bref, on est là pour vous faire découvrir des saveurs, des histoires, et vous accompagner dans vos choix. Pas besoin d’être un expert, on s’adresse à tout le monde, des curieux aux passionnés.</p>
    <p>Alors, rejoignez-nous et profitez de conseils simples et accessibles pour épicer vos moments de dégustation. Vous allez vite comprendre qu’il y a toujours quelque chose de nouveau à découvrir dans l’univers de l’alcool !</p>
  </section>
</template>

<style lang="sass" scoped>
// .home
</style>
