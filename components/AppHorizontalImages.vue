<script lang="ts" setup>
interface Props {
  ids: string[]
  alts?: string[]
}
const props = defineProps<Props>()

const emit = defineEmits(['ready'])

const { getAmazonImageUrl } = useAmznUtils()

const wrapperRef = ref<HTMLElement | null>(null)
const { width: containerWidth } = useElementSize(wrapperRef)

const computedImageSize = computed(() => {
  // Info: 16px étant le gap
  const gapSize = 16
  const mainContainerWidth = containerWidth.value
  if (mainContainerWidth < 480) {
    return { size: mainContainerWidth }
  }
  else if (mainContainerWidth < 700) {
    return { size: (mainContainerWidth - 1 * gapSize) / 2 }
  }
  else if (mainContainerWidth < 1024) {
    return { size: (mainContainerWidth - 2 * gapSize) / 3 }
  }
  else if (mainContainerWidth < 1200) {
    return { size: (mainContainerWidth - 3 * gapSize) / 4 }
  }
  else {
    return { size: (mainContainerWidth - 4 * gapSize) / 5 }
  }
})

const imagesPerRow = computed(() => Math.floor(containerWidth.value / computedImageSize.value.size))

const visibleImages = computed(() => {
  return props.ids.slice(0, imagesPerRow.value)
})

const visibleAlts = computed(() => props.alts?.slice(0, imagesPerRow.value) ?? [])

onMounted(() => {
  emit('ready')
})
</script>

<template>
  <div class="image-wrapper">
    <div ref="wrapperRef" />
    <div class="image-row">
      <div
        v-for="(imageId, index) in visibleImages"
        :key="index"
        class="image-item"
        :style="{ width: `${computedImageSize.size}px`, height: `${computedImageSize.size}px` }"
      >
        <img
          :src="getAmazonImageUrl(imageId, { width: computedImageSize.size, height: computedImageSize.size })"
          :width="computedImageSize.size"
          :height="computedImageSize.size"
          :alt="visibleAlts[index] || `Image ${index + 1}`"
        >
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.image-wrapper
  overflow-x: auto

  .image-row
    display: flex
    flex-direction: row
    gap: size(16)

    .image-item
      flex-shrink: 0
      border-radius: size(8)
      overflow: hidden
</style>
