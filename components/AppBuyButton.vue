<script lang="ts" setup>
const props = defineProps<{
  label?: string
  onClick?: () => void
}>()

function handleClick() {
  if (props.onClick)
    props.onClick()
}
</script>

<template>
  <div class="buy-button-container">
    <button class="buy-button" @click="handleClick">
      {{ label }}
    </button>
    <div class="partner-mention">
      En tant que Partenaire Amazon, nous réalisons un bénéfice sur les achats remplissant les conditions requises.
    </div>
  </div>
</template>

<style lang="sass" scoped>
@use '@/assets/styles/components/alcohol-basic-button'

.buy-button-container
  position: sticky
  bottom: 0
  z-index: 1000
  background-color: var(--area300)
  padding: size(12)
  text-align: center
  box-shadow: 0 size(2) size(5) rgba(0, 0, 0, 0.1)
  margin: 0 size(-24)
  display: flex
  flex-direction: column
  gap: size(8)
  align-items: center
  justify-content: center

  .buy-button
    border-radius: size(10)
    width: 90%
    max-width: size(400)

  .partner-mention
    font-size: size(12)
</style>
