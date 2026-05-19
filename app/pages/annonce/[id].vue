<script setup lang="ts">
import Breadcrumb from '~/components/common/Breadcrumb.vue'

const route = useRoute()
const localePath = useLocalePath()
const { data: advert } = await useAdvert(String(route.params.id))

const breadcrumbItems = computed(() => [
  { label: 'Shop', to: '/' },
  { label: advert.value?.category || '', to: undefined },
  { label: advert.value?.title || '', to: undefined }
])

const handleAskQuestion = (_text: string) => {
  // TODO: send question to API
}

// Génère un objet advert plus petit pour le passer au composant ActionButtons pour le favori
const advertSummary = computed(() => {
  if (!advert.value) return null

  return {
    id: advert.value.id,
    title: advert.value.title,
    category: advert.value.category,
    condition: advert.value.condition,
    price: advert.value.price,
    image: advert.value.image || advert.value.images?.[0] || ''
  }
})
</script>

<template>
  <div class="min-h-screen">
    <Breadcrumb :items="breadcrumbItems" />

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-8">
      <!-- Bouton de retour -->
      <div class="mb-8">
        <NuxtLink
          :to="localePath('/shop')"
          class="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-400 hover:underline font-medium focus:ring-2 focus:ring-emerald-500 outline-none rounded"
        >
          <span aria-hidden="true">←</span> {{ $t('common.back_to_catalog') }}
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left: Image Gallery -->
        <div class="lg:col-span-2">
          <AdvertGallery
            :images="advert?.images || []"
            :title="advert?.title || ''"
          />
        </div>

        <!-- Right: Advert Details -->
        <div class="lg:col-span-1">
          <AdvertInfo
            v-if="advert"
            :condition="advert.condition"
            :featured="advert.featured"
            :title="advert.title"
            :authors="advert.authors"
            :price="advert.price"
            :old-price="advert.oldPrice"
          />
          <AdvertMetadata
            v-if="advert"
            :isbn="advert.isbn"
            :subject="advert.subject"
            :grade="advert.grade"
            :school="advert.school"
          />
          <AdvertSellerCard
            v-if="advert"
            :seller="advert.seller"
            @view-profile="() => {}"
          />
          <AdvertActionButtons
            :advert="advertSummary"
          />
        </div>
      </div>

      <!-- Description Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        <div class="lg:col-span-2">
          <AdvertDescription :description="advert?.description || ''" />
        </div>

        <!-- Condition Details -->
        <AdvertConditionDetails :conditions="advert?.conditions || []" />
      </div>

      <!-- Public Questions Section -->
      <div class="mt-12">
        <AdvertPublicQuestions
          v-if="advert"
          :seller="advert.seller"
          :questions="advert.questions || []"
          :answers="advert.answers || []"
          @ask-question="handleAskQuestion"
        />
      </div>
    </div>
  </div>
</template>
