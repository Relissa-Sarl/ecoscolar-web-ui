<script setup lang="ts">
const localePath = useLocalePath()
</script>

<template>
  <div class="max-w-2xl mx-auto py-10">
    <h1 class="text-3xl font-bold">
      {{ $t('cart.title') }}
    </h1>
    <p class="mt-4 text-gray-600">
      {{ $t('cart.empty') }}
    </p>
    <NuxtLink
      :to="localePath('/')"
      class="mt-6 inline-flex items-center gap-2 text-emerald-600 no-underline"
    >
      <span aria-hidden="true">←</span>
      <span class="border-b border-current pb-px">{{ $t('common.back_to_home') }}</span>
    </NuxtLink>
  </div>
</template>
