<template>
  <div class="max-w-2xl mx-auto py-10">
    <h1 class="text-3xl font-bold">{{ $t('cart.title') }}</h1>
    <p class="mt-4 text-gray-600">{{ $t('cart.empty') }}</p>
    <NuxtLink :to="localePath('/')" class="mt-6 inline-block text-emerald-600 underline">
      {{ $t('common.back_to_home') }}
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
</script>
