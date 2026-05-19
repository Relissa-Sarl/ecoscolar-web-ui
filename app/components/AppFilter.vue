<template>
  <aside class="w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900 xl:max-w-xs">
    <div class="mb-5">
      <h3 class="text-lg font-semibold">
        Filtres
      </h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Affinez votre recherche
      </p>
    </div>
    <nav class="space-y-2">
      <a
        class="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-600 transition dark:text-gray-300 dark:hover:bg-gray-600 hover:bg-gray-100"
        href="#"
      ><span
        class="text-gray-400 dark:text-gray-500"
        data-icon="inventory_2"
      >inventory_2</span><span>Fournitures</span></a>
      <a
        class="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-600 transition dark:text-gray-300 dark:hover:bg-gray-600 hover:bg-gray-100"
        href="#"
      ><span
        class="text-gray-400 dark:text-gray-500"
        data-icon="menu_book"
      >menu_book</span><span>Manuels</span></a>
      <a
        class="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-600 transition dark:text-gray-300 dark:hover:bg-gray-600 hover:bg-gray-100"
        href="#"
      ><span
        class="text-gray-400 dark:text-gray-500"
        data-icon="school"
      >school</span><span>Tutorat</span></a>
      <a
        class="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-600 transition dark:text-gray-300 dark:hover:bg-gray-600 hover:bg-gray-100"
        href="#"
      ><span
        class="text-gray-400 dark:text-gray-500"
        data-icon="grade"
      >grade</span><span>Niveau</span></a>
      <a
        class="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-600 transition dark:text-gray-300 dark:hover:bg-gray-600 hover:bg-gray-100"
        href="#"
      ><span
        class="text-gray-400 dark:text-gray-500"
        data-icon="subject"
      >subject</span><span>Matière</span></a>
    </nav>
    <button class="mt-6 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 transition dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 hover:bg-gray-100">
      Réinitialiser
    </button>
  </aside>
</template>
