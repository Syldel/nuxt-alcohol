export function useElementSize(elRef: Ref<HTMLElement | null>) {
  const width = ref(0)
  const height = ref(0)

  let observer: ResizeObserver | null = null

  onMounted(() => {
    if (elRef.value) {
      observer = new ResizeObserver(([entry]) => {
        width.value = entry.contentRect.width
        height.value = entry.contentRect.height
      })
      observer.observe(elRef.value)
    }
  })

  onBeforeUnmount(() => {
    if (observer && elRef.value) {
      observer.disconnect()
    }
  })

  return { width, height }
}
