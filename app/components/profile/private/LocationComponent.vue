<script setup lang="ts">
import type { UserLocation } from '~/types/user'

/**
* Props definition for the ProfileInfos component.
*/
const props = defineProps<{
  location: UserLocation | null
}>()

/**
 * Computed property to generate a display string of the user's location.
 * It checks if the profile belongs to the logged-in user and if location data is available,
 * then it combines the city and region into a single string. If the profile is not the user's own or if location data is missing, it returns an empty string.
 */
const displayLocation = computed(() => {
  if (!props.location)
    return ''

  const { city, region } = props.location
  return [city, region].filter(Boolean).join(', ')
})
</script>

<template>
  <div
    class="flex justify-between items-center"
  >
    <span class="text-slate-500 dark:text-slate-400">{{ $t('profile.location') }}</span>
    <span class="font-semibold text-slate-800 dark:text-slate-200">{{ displayLocation }}</span>
  </div>
</template>
