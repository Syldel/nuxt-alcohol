<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer>
    <div class="footer">
      <div class="footer__line">
        <nav>
          <ul>
            <li>
              <NuxtLink to="/">
                Accueil
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/about">
                À propos
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
      <div class="footer__main">
        <div>
          <div class="footer__line footer__partner">
            <span class="footer__sub">Partenaires:</span><a href="https://www.beer-me.fr/" target="_blank">www.beer-me.fr</a>
          </div>
          <div class="footer__line">
            <div class="footer__sub">
              Copyright © {{ currentYear }}. All rights reserved.
            </div>
          </div>
        </div>
        <div class="footer__line">
          <div class="footer__legal-mention">
            <div>La vente de boissons alcoolisées aux mineurs de moins de 18 ans est interdite.</div>
            <div>L'abus d'alcool est dangereux pour la santé. À consommer avec modération.</div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="sass" scoped>
@use '@/assets/styles/components/nav-mixin' as *

footer
  background-color: var(--area300)

  .footer
    padding: size(24)
    font-size: size(12)
    display: flex
    align-items: center
    flex-wrap: wrap

    width: 100%
    max-width: size($main-container-width)
    margin: 0 auto
    flex-direction: column
    gap: size(15)

    > div
      &:first-child
        flex: 1

    &__main
      display: flex
      align-items: flex-end
      margin: 0
      gap: size(15)

    &__line,
    &__sub
      display: flex
      align-items: center
      margin: 0
      gap: size(15)

    &__line
      display: flex
      flex-wrap: wrap

    &__sub
      &:first-child
        margin-right: size(5)

    &__link
      margin-left: size(3)

    &__partner
      margin-bottom: size(8)
      gap: 0

    &__legal-mention
      text-align: right
      font-style: italic

    @include nav(#aaa, size(7))
</style>
