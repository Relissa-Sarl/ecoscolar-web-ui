<script lang="ts" setup>
import { useSearchAlertsStore } from '~/stores/searchAlertsStore'

const route = useRoute()
const { locale, locales, setLocale } = useI18n()
const localePath = useLocalePath()
const usersStore = useUsersStore()
const searchAlertsStore = useSearchAlertsStore()
const cartStore = useCartStore()

// Main navigation
const navigationLinks = computed(() => [
  {
    to: localePath('/shop'),
    labelKey: 'header.nav_shop',
    slug: 'shop',
    requiresAuth: false,
    icon: 'material-symbols:shopping-bag'
  },
  {
    to: localePath('/favorites'),
    labelKey: 'header.favorites',
    slug: 'favorites',
    requiresAuth: true,
    icon: 'material-symbols:favorite-outline'
  },
  {
    to: localePath('/search-alerts'),
    labelKey: 'header.search_alerts',
    slug: 'search-alerts',
    requiresAuth: true,
    icon: 'material-symbols:circle-notifications'
  },
  {
    to: localePath('/me/support-requests'),
    labelKey: 'header.support_requests',
    slug: 'support-requests',
    requiresAuth: true,
    icon: 'material-symbols:support-agent'
  },
  {
    to: localePath('/cart'),
    labelKey: 'header.cart',
    slug: 'cart',
    requiresAuth: false,
    icon: 'material-symbols:shopping-cart-outline'
  }
])

const visibleLinks = computed(() => {
  return navigationLinks.value.filter(link => !link.requiresAuth || usersStore.isAuthenticated)
})

// Account actions (Login, profile, logout)
const authActions = computed(() => {
  if (usersStore.isAuthenticated) {
    return [
      {
        id: 'profile',
        isAction: false,
        to: localePath('/me/profile'),
        labelKey: 'header.profile',
        icon: 'material-symbols:account-circle',
        baseClass: 'flex items-center gap-2 px-4 py-2 bg-emerald-800 text-white rounded-full hover:bg-emerald-700 transition-colors',
        iconClass: 'w-4 h-4',
        textClass: ''
      },
      {
        id: 'logout',
        isAction: true,
        onClick: () => usersStore.logout(),
        labelKey: 'header.logout',
        icon: 'material-symbols:exit-to-app',
        baseClass: 'flex items-center gap-2 py-2 text-sm font-semibold text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors cursor-pointer',
        iconClass: 'w-5 h-5',
        textClass: 'hidden sm:inline'
      }
    ]
  }

  // Guest
  return [
    {
      id: 'login',
      isAction: false,
      to: localePath('/login'),
      labelKey: 'header.login',
      icon: 'material-symbols:login',
      baseClass: 'flex items-center gap-2 text-gray-700 hover:text-emerald-700 dark:text-gray-300 dark:hover:text-emerald-400 transition-colors',
      iconClass: 'w-4 h-4',
      textClass: ''
    }
  ]
})

const linkIsActive = (slug: string) => {
  const parts = route.path.split('/').filter(Boolean)
  return parts.includes(slug)
}

watch(
  () => usersStore.isAuthenticated,
  async (isAuthenticated) => {
    if (isAuthenticated) {
      await searchAlertsStore.loadAlerts().catch(() => undefined)
    } else {
      searchAlertsStore.clearAlerts()
    }
  },
  { immediate: true }
)

const successfulAlertsCount = computed(() =>
  searchAlertsStore.alerts.filter(alert => (alert.matchedCount ?? 0) > 0).length
)

const navBadgeCount = (slug: string) => {
  if (slug === 'cart')
    return cartStore.totalItems

  if (slug === 'search-alerts')
    return successfulAlertsCount.value

  return 0
}

const formatNavBadgeCount = (count: number) => count > 9 ? '9+' : String(count)
</script>

<template>
  <header
    class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
  >
    <div class="flex items-center">
      <NuxtLink
        :to="localePath('/')"
        aria-label="EcoScolar - Retour à l'accueil"
        class="flex items-center gap-2 text-xl font-bold text-emerald-900 transition-opacity hover:opacity-80 dark:text-emerald-100"
      >
        <IconsEcoScolarLeafIcon class="w-8 h-8 text-emerald-800 dark:text-emerald-500" />
        <span>EcoScolar</span>
      </NuxtLink>
    </div>

    <nav
      aria-label="Navigation principale"
      class="order-3 flex w-full items-center justify-center gap-1 text-sm font-semibold md:order-0 md:flex-1 md:w-auto lg:justify-start lg:pl-8"
    >
      <NuxtLink
        v-for="link in visibleLinks"
        :key="link.slug"
        :class="[
          'relative flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 transition-colors duration-200 hover:bg-slate-50 hover:text-emerald-800 dark:text-gray-300 dark:hover:bg-slate-800 dark:hover:text-emerald-400',
          linkIsActive(link.slug) ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300 font-bold' : ''
        ]"
        :to="link.to"
      >
        <span class="relative inline-flex">
          <Icon
            :name="link.icon"
            class="w-4 h-4 shrink-0"
          />
        </span>
        <span>{{ $t(link.labelKey) }}</span>
        <span
          v-if="navBadgeCount(link.slug) > 0"
          class="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold leading-none text-white ring-2 ring-white dark:ring-slate-900"
          :class="link.slug === 'cart' ? 'bg-emerald-800' : 'bg-red-600'"
        >
          {{ formatNavBadgeCount(navBadgeCount(link.slug)) }}
        </span>
      </NuxtLink>
    </nav>

    <div class="flex shrink-0 items-center gap-4 sm:gap-6">
      <nav
        aria-label="Sélecteur de langue"
        class="flex items-center gap-2"
      >
        <button
          v-for="l in locales"
          :key="l.code"
          :aria-current="locale === l.code ? 'page' : undefined"
          :class="locale === l.code
            ? 'font-bold bg-emerald-100 border-emerald-400 text-emerald-900 dark:bg-emerald-900 dark:border-emerald-500 dark:text-emerald-100'
            : 'bg-transparent border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800'"
          class="px-2 py-1 text-sm border rounded cursor-pointer transition-colors focus:ring-2 focus:ring-emerald-500 outline-none"
          @click="setLocale(l.code)"
        >
          {{ l.code.toUpperCase() }}
        </button>
      </nav>

      <!-- Dynamic lopp for the user actions -->
      <div class="flex items-center gap-4 text-sm font-medium">
        <template
          v-for="item in authActions"
          :key="item.id"
        >
          <!-- Action as button (ex: Logout) -->
          <button
            v-if="item.isAction"
            :class="item.baseClass"
            @click="item.onClick"
          >
            <Icon
              :class="item.iconClass"
              :name="item.icon"
            />
            <span :class="item.textClass">{{ $t(item.labelKey) }}</span>
          </button>

          <!-- Action as NuxtLink (ex: Login, Profil) -->
          <NuxtLink
            v-else
            :class="item.baseClass"
            :to="item.to"
          >
            <Icon
              :class="item.iconClass"
              :name="item.icon"
            />
            <span :class="item.textClass">{{ $t(item.labelKey) }}</span>
          </NuxtLink>
        </template>
      </div>
    </div>
  </header>
</template>
