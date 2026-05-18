<template>
  <!-- Fond gris très clair (maquette) ; cartes / panneaux en blanc à l’intérieur des pages -->
  <div class="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-emerald-600 focus:p-4 focus:text-white"
    >
      Passer au contenu principal
    </a>

    <LayoutAppHeader />

    <!-- Pleine largeur : gouttières modestes uniquement -->
    <main
      id="main-content"
      class="flex-1 min-h-0 min-w-0 w-full bg-slate-50 px-5 py-8 sm:px-8 xl:px-12 2xl:px-14 dark:bg-slate-950"
    >
      <slot />
    </main>

    <LayoutAppFooter />
  </div>
</template>
