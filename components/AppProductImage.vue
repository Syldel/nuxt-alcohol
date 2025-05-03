<script setup>
import { ref } from 'vue'

defineProps({
  src: { type: String, required: true },
  lqipSrc: { type: String, required: true },
  lqipRatio: { type: Number, default: 0.25 },
  alt: { type: String, default: '' },
  width: { type: Number, default: 200 },
  height: { type: Number, default: 200 },
  preload: { type: Boolean, default: false },
})

const loaded = ref(false)
</script>

<template>
  <div class="product-image-wrapper" :style="{ width: `${width}px`, height: `${height}px` }">
    <!-- Image floue (LQIP) -->
    <NuxtImg
      :src="lqipSrc"
      :width="width * lqipRatio"
      :height="height * lqipRatio"
      class="product-image lqip"
      :alt="alt"
      aria-hidden="true"
      :preload="preload"
    />

    <!-- Image nette -->
    <NuxtImg
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      class="product-image main"
      :class="{ visible: loaded }"
      :preload="preload"
      @load="loaded = true"
    />
  </div>
</template>

<style lang="sass" scoped>
.product-image-wrapper
  position: relative
  overflow: hidden

  .product-image
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    object-fit: cover
    transition: opacity 0.5s ease

    &.lqip
      filter: blur(20px)
      z-index: 1

    &.main
      opacity: 0
      z-index: 2

      &.visible
        opacity: 1
</style>
