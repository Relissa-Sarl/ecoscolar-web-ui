<template>
  <div class="flex flex-col min-h-screen bg-white dark:bg-gray-950">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-emerald-600 focus:text-white"
    >
      Passer au contenu principal
    </a>

    <LayoutAppHeader />

    <main
      id="main-content"
      class="flex-1 p-8"
    >
      <slot />
    </main>

    <LayoutAppFooter />
  </div>
</template>
