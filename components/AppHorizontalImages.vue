<script lang="ts" setup>
interface Props {
  ids: string[]
  alts?: string[]
}
const props = defineProps<Props>()

const { getAmazonImageUrl } = useAmznUtils()

useSeoMeta({
  ogImage: props?.ids?.[0]
    ? getAmazonImageUrl(props.ids[0], { width: 320, height: 320 })
    : undefined,
})
</script>

<template>
  <div class="image-wrapper">
    <div class="image-grid">
      <div
        v-for="(imageId, index) in props.ids"
        :key="index"
        class="image-card"
      >
        <NuxtImg
          :src="getAmazonImageUrl(imageId, { width: 320, height: 320 })"
          :width="320"
          :height="320"
          sizes="320px"
          :alt="(props.alts || props.ids.map(() => ''))[index] || `Image ${index + 1}`"
          loading="eager"
          preload
          fetchpriority="high"
        />
      </div>
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

      img
        width: 100%
        height: 100%
        object-fit: cover
</style>
