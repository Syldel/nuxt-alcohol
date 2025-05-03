<script lang="ts" setup>
interface Props {
  ids: string[]
  alts?: string[]
}
const props = defineProps<Props>()

const { getAmazonImageUrl } = useAmznUtils()

const wrapperRef = ref<HTMLElement | null>(null)

const containerWidth = ref(0)

// Info: Il faut prendre en compte le padding du container pour que les breakpoints correspondent à ceux en CSS
const containerPadding = 24

// Info : Voir CSS main max-width: size($main-container-width)
const maxContainerWidth = 1200

const computedImageSize = computed(() => {
  // Info: 16px étant le gap
  const gapSize = 16

  const mainContainerWidth = containerWidth.value

  if ((mainContainerWidth + 2 * containerPadding) < 320) { // verysmall (< 320px)
    return { size: mainContainerWidth }
  }
  else if ((mainContainerWidth + 2 * containerPadding) < 480) { // small
    return { size: (mainContainerWidth - 0 * gapSize) / 1 }
  }
  else if ((mainContainerWidth + 2 * containerPadding) < 768) { // phone
    return { size: (mainContainerWidth - 1 * gapSize) / 2 }
  }
  else if ((mainContainerWidth + 2 * containerPadding) < 1024) { // tablet
    return { size: (mainContainerWidth - 2 * gapSize) / 3 }
  }
  else if ((mainContainerWidth + 2 * containerPadding) < 1200) { // desktop
    return { size: (mainContainerWidth - 3 * gapSize) / 4 }
  }
  else { // large
    return { size: (mainContainerWidth - 4 * gapSize) / 5 }
  }
})

const imagesPerRow = computed(() => {
  return Math.floor((containerWidth.value + 2 * containerPadding) / computedImageSize.value.size)
})

const visibleImages = computed(() => {
  return props.ids.slice(0, imagesPerRow.value)
})

const visibleAlts = computed(() => {
  return props.alts?.slice(0, imagesPerRow.value) ?? []
})

const isLoading = ref(true)

onMounted(() => {
  isLoading.value = false
})

const { width } = useElementSize(wrapperRef)

watch(width, (newWidth) => {
  let windowInnerWidth = 0
  if (typeof window !== 'undefined') {
    windowInnerWidth = (window as Window).innerWidth
  }

  if (!isLoading.value && ((newWidth + 2 * containerPadding) < maxContainerWidth)) {
    containerWidth.value = windowInnerWidth - 2 * containerPadding
  }
  else {
    containerWidth.value = newWidth
  }
}, { immediate: true })
</script>

<template>
  <div ref="wrapperRef" class="image-wrapper">
    <div class="image-grid">
      <template v-if="isLoading">
        <div
          v-for="n in props.ids?.length"
          :key="`skeleton-${n}`"
          class="image-card skeleton"
        />
      </template>
      <template v-else>
        <div
          v-for="(imageId, index) in visibleImages"
          :key="index"
          class="image-card"
        >
          <AppProductImage
            :lqip-src="getAmazonImageUrl(imageId, { width: computedImageSize.size * 0.21, height: computedImageSize.size * 0.21 })"
            :lqip-ratio="0.21"
            :src="getAmazonImageUrl(imageId, { width: computedImageSize.size, height: computedImageSize.size })"
            :width="computedImageSize.size"
            :height="computedImageSize.size"
            :alt="visibleAlts[index] || `Image ${index + 1}`"
            :preload="true"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.image-wrapper
  overflow-x: auto

  .image-grid
    display: grid
    gap: size(16)
    grid-template-columns: 1fr
    position: relative
    min-height: 0

    +from-breakpoint(small)
      grid-template-columns: repeat(2, 1fr)

    +from-breakpoint(phone)
      grid-template-columns: repeat(3, 1fr)

    +from-breakpoint(tablet)
      grid-template-columns: repeat(4, 1fr)

    +from-breakpoint(desktop)
      grid-template-columns: repeat(5, 1fr)

    // Si la grid est vide, créer un ::before "phantom block"
    &:empty::before
      content: ''
      width: 100%
      aspect-ratio: 1 / 1 // simule la hauteur d'une .image-card
      display: block

    .skeleton
      background-color: var(--area300) !important
      animation: pulse 1.2s ease-in-out infinite

    @keyframes pulse
      0%, 100%
        opacity: 1
      50%
        opacity: 0.4

    .image-card
      aspect-ratio: 1 / 1
      background-color: #ffffff
      border-radius: size(8)
      overflow: hidden

      display: none // cacher tout par défaut

      // verysmall (max 1 colonne)
      &:nth-child(-n+1)
        display: block

      +from-breakpoint(small) // ≥ 480px → 2 colonnes
        &:nth-child(-n+2)
          display: block

      +from-breakpoint(phone) // ≥ 768px → 3 colonnes
        &:nth-child(-n+3)
          display: block

      +from-breakpoint(tablet) // ≥ 1024px → 4 colonnes
        &:nth-child(-n+4)
          display: block

      +from-breakpoint(desktop) // ≥ 1200px → 5 colonnes
        &:nth-child(-n+5)
          display: block
</style>
