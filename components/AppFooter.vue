<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer>
    <div class="footer">
      <div>
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
          <!-- <div class="footer__sub">
            <BlurHashLazyImage :src="githubSvg" :width="18" :height="18" class="footer__img" /> GitHub by <a href="https://github.com/Syldel" class="footer__link">@Syldel</a>.
          </div>
          <div class="footer__sub">
            Using <BlurHashLazyImage :src="vueSvg" :width="18" :height="18" class="footer__img" /> Vue v{{ vueVersion }} and <BlurHashLazyImage :src="nuxtSvg" :width="18" :height="18" class="footer__img" /> Nuxt v{{ nuxtVersion }}
          </div> -->
        </div>
        <div class="footer__line">
          <div class="footer__sub">
            Copyright © {{ currentYear }}. All rights reserved.
          </div>
        </div>
      </div>
      <div>
        <div class="footer__icons">
          <!-- <BlurHashLazyImage :src="vueSvg" :width="18" :height="18" class="footer__img" />
          <BlurHashLazyImage :src="nuxtSvg" :width="18" :height="18" class="footer__img" /> -->
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="sass" scoped>
@use '@/assets/styles/base/nav-mixin' as *

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
    //background-color: rgba(137, 127, 117, 0.1)

    flex-direction: row
    @include until-breakpoint(verysmall)
      flex-direction: column
      gap: size(15)

    > div
      &:first-child
        flex: 1
      &:last-child,
      .footer__icons
        display: flex
        align-items: center

    &__line,
    &__sub
      display: flex
      align-items: center
      margin: 0

    &__line
      flex-wrap: wrap
      &:first-child
        margin-bottom: size(3)

    &__sub
      &:first-child
        margin-right: size(5)
        .footer__img
          &:first-child
            margin-left: 0

    &__link
      margin-left: size(3)

    &__img
      margin-right: size(3)
      margin-left: size(5)
      width: size(18)
      height: size(18)

    @include nav(#aaa, size(7))
</style>
