<script setup lang="ts">
const localePath = useLocalePath()
</script>

<template>
<div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
    <NuxtLink
    :to="localePath('/shop')"
    class="px-6 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow transition-all cursor-pointer text-sm"
    >
    {{ $t('cart.success.continue_shopping') }}
    </NuxtLink>
    <NuxtLink
    :to="localePath('/')"
    class="px-6 py-3 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer text-sm"
    >
    {{ $t('cart.success.back_home') }}
    </NuxtLink>
</div>
</template>