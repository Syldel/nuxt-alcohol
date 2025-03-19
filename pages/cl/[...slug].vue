<script setup lang="ts">
import { useStringUtils } from '@/composables/useStringUtils'

const route = useRoute()

let slugParamArr: string[] = []
if (Array.isArray(route.params.slug)) {
  slugParamArr = route.params.slug
}
else {
  slugParamArr = [route.params.slug]
}

slugParamArr = slugParamArr.filter(s => !!s)

slugParamArr = slugParamArr.map((slug) => {
  if (slug === 'bieres') {
    slug = 'bières'
  }
  return slug
})

const { capitalizeFirstLetter } = useStringUtils()

const slugParamStr = slugParamArr.map(slug => capitalizeFirstLetter(slug)).join(' / ')

// 0 => ex: spiritueux
// 1 => ex: whiskys
// 2 => pays
// 3 => marque

function getPageType() {
  if (slugParamArr.length === 0) {
    return 'root'
  }

  if (slugParamArr.length === 1) {
    const slug = slugParamArr[0].toLowerCase().trim()
    if (['spiritueux', 'spirit'].includes(slug)) {
      return 'spiritueux'
    }
  }

  if (slugParamArr.length === 1) {
    const slug = slugParamArr[0].toLowerCase().trim()
    if (['bières', 'bieres'].includes(slug)) {
      return 'bieres'
    }
  }

  if (slugParamArr.length === 2) {
    const slug = slugParamArr[1].toLowerCase().trim()
    if (['whiskys', 'whiskies', 'whiskeys'].includes(slug)) {
      return 'whiskys'
    }
  }

  return 'unknown'
}

const pageType = getPageType()

useHead({
  title: `${slugParamStr || 'Bières, vins et spiritueux'} | Relaxxed alcohol universe`,
  meta: [
    { name: 'description', content: `${slugParamStr || 'Bières, vins et spiritueux'} | Relaxxed alcohol universe` },
  ],
})
</script>

<template>
  <section class="category-listing">
    <AppBreadcrumbs />
    <h1><span>{{ capitalizeFirstLetter(slugParamArr[slugParamArr.length - 1] || 'Bières, vins et spiritueux') }}</span></h1>

    <div v-if="pageType === 'root'">
      <ul>
        <li>
          <NuxtLink to="/cl/bieres">
            Bières
          </NuxtLink>
        </li>
        <li>
          Vins
        </li>
        <li>
          <NuxtLink to="/cl/spiritueux">
            Spiritueux
          </NuxtLink>
        </li>
      </ul>
    </div>

    <div v-if="pageType === 'spiritueux'">
      <ul>
        <li>
          <NuxtLink :to="`/cl/${slugParamArr.join('/')}/whiskys`">
            Whiskys
          </NuxtLink>
        </li>
        <li>
          Rhums
        </li>
        <li>
          Vodkas
        </li>
      </ul>
    </div>

    <div v-if="pageType === 'bieres'">
      Visitez notre site partenaire :
      <NuxtLink to="https://www.beer-me.fr/">
        https://www.beer-me.fr/
      </NuxtLink>
    </div>

    <div v-if="pageType === 'whiskys'">
      <AppCountryList type="whisky" />
    </div>
  </section>
</template>

<style lang="sass" scoped>
@use '@/assets/styles/components/titles'

.category-listing
  p
    color: blue
</style>
