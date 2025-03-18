<script setup lang="ts">
import logoSvgImage from '@/assets/images/relaxxed-alcohol-universe-logo.svg'
</script>

<template>
  <header>
    <div class="header">
      <div class="short-zone">
        <img :src="logoSvgImage" alt="relaxxed" width="100" height="100">
      </div>
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
          <!-- <li>
            <NuxtLink to="/contact">
              Contact
            </NuxtLink>
          </li> -->
        </ul>
      </nav>
      <div class="short-zone end-part">
        <!-- Empty for now -->
      </div>
    </div>
  </header>
</template>

<style lang="sass" scoped>
@use '@/assets/styles/base/nav-mixin' as *

header
  background-color: var(--area300)

  .header
    display: flex
    justify-content: center
    align-items: center
    gap: size(10)
    width: 100%
    max-width: size($main-container-width)
    margin: 0 auto
    //background-color: rgba(137, 127, 117, 0.1)

    flex-direction: row
    @include until-breakpoint(phone)
      flex-direction: column

    .short-zone
      flex: 1
      margin: size(10) size(24)

    @include nav(#aaa, size(14) size(16))

    nav
      flex: 1

      width: 70%
      @include until-breakpoint(phone)
        width: 100%

    .end-part
      display: flex
      flex-direction: row
      align-items: center
      gap: size(28)
</style>
