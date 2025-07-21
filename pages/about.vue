<script setup lang="ts">
useHead({
  title: 'À propos',
  meta: [
    { name: 'description', content: 'À propos de ce site' },
  ],
})
</script>

<template>
  <section class="about-page">
    <h1>À propos</h1>

    <br>
    <nav class="back-nav">
      <NuxtLink to="/" class="back-link">
        ← Retour à l’accueil
      </NuxtLink>
    </nav>
    <br>

    <section>
      <h2>Qui sommes-nous ?</h2>
      <p>
        Nous sommes des passionnés de spiritueux, de découvertes gustatives et d'expériences authentiques.
        Notre mission : proposer une plateforme claire, informative et agréable à explorer pour toutes celles
        et ceux qui souhaitent mieux connaître l’univers des alcools.
      </p>
    </section>

    <section>
      <h2>Notre approche</h2>
      <p>
        Nous combinons expertise humaine et technologies modernes pour vous offrir des fiches produits enrichies,
        des recommandations de cocktails, et des informations utiles, toujours avec le souci du détail.
      </p>
      <p>
        Chaque fiche est conçue pour vous aider à mieux comprendre l’histoire, les caractéristiques et les usages
        de chaque boisson, qu’il s’agisse de whisky, rhum, gin ou autres spiritueux.
      </p>
    </section>

    <section>
      <h2>Pourquoi ce site ?</h2>
      <p>
        L’idée est née d’un constat simple : il existe de nombreuses boutiques en ligne, mais peu de sites réellement
        pédagogiques sur les spiritueux. Nous avons voulu créer un espace où l’on apprend autant que l’on découvre,
        que vous soyez néophyte ou amateur averti.
      </p>
    </section>

    <section>
      <h2>Performances &amp; hébergement</h2>
      <p>
        Notre site est hébergé sur l'infrastructure de <strong>Cloudflare</strong>, ce qui nous permet de garantir des
        performances optimales, un chargement rapide dans le monde entier et une sécurité renforcée.
      </p>
      <p>
        Grâce à cette technologie, nous offrons une expérience fluide, même sur mobile ou en connexion lente.
      </p>
    </section>

    <section>
      <h2>Et la suite ?</h2>
      <p>
        Nous continuons d’améliorer notre plateforme en intégrant de nouveaux contenus, fonctionnalités et recommandations.
        Votre retour est précieux, alors n’hésitez pas à nous contacter ou à partager vos suggestions.
      </p>
    </section>
  </section>
</template>

<style lang="sass" scoped>
// .about-page
</style>
