<script setup lang="ts">
const searchInput = defineModel<string>({ required: true })

defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  search: []
}>()

const headingId = useId()

const submit = () => {
  emit('search')
}

const handleKeyEnter = () => submit()
</script>

<template>
  <section
    class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 px-6 py-10 text-white shadow-lg sm:px-10"
    :aria-labelledby="headingId"
  >
    <div class="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
    <div class="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-emerald-600/40 blur-3xl" />

    <div class="relative max-w-3xl">
      <h2
        :id="headingId"
        class="text-2xl font-bold tracking-tight sm:text-3xl"
      >
        {{ $t('catalog.hero.title') }}
      </h2>
      <p class="mt-2 text-emerald-100/95 text-base sm:text-lg">
        {{ $t('catalog.hero.subtitle') }}
      </p>
    </div>

    <div class="relative mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch">
      <div class="flex flex-1 items-center gap-3 rounded-full bg-white/95 px-4 py-3 text-emerald-950 shadow-inner ring-1 ring-white/30 dark:bg-emerald-50">
        <span
          class="text-emerald-700"
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle
              cx="11"
              cy="11"
              r="8"
            />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </span>
        <input
          v-model="searchInput"
          type="search"
          class="min-w-0 flex-1 border-0 bg-transparent text-base outline-none placeholder:text-emerald-800/45"
          :placeholder="$t('catalog.hero.search_placeholder')"
          :aria-labelledby="headingId"
          autocomplete="off"
          @keydown.enter.prevent="handleKeyEnter"
        >
      </div>
      <button
        type="button"
        class="inline-flex shrink-0 items-center justify-center rounded-full bg-emerald-950 px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-70"
        :disabled="loading"
        @click="submit"
      >
        {{ $t('catalog.hero.search_cta') }}
      </button>
    </div>
  </section>
</template>
