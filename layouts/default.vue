<template>
  <div class="default-layout">
    <AppHeader />
    <main>
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style lang="sass" scoped>
.default-layout
  display: flex
  flex-direction: column
  height: 100%

  main
    flex: 1
    width: 100%
    max-width: size($main-container-width)
    margin: 0 auto
    padding: size(24)
    background-color: rgba(137, 127, 117, 0.2)
</style>
