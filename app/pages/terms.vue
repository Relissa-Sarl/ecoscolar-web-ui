<template>
  <div class="max-w-4xl mx-auto">
    <nav class="mb-8" aria-label="Fil d'Ariane">
      <NuxtLink :to="localePath('/')" class="text-emerald-700 dark:text-emerald-400 hover:underline text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none">
        ← Retour à l'accueil
      </NuxtLink>
    </nav>

    <article class="prose prose-slate dark:prose-invert max-w-none">
      <header class="mb-10 border-b border-gray-200 dark:border-gray-800 pb-6">
        <h1 class="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Terms of Service
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-4">
          Dernière mise à jour : <time datetime="2024-05-20">20 Mai 2024</time>
        </p>
      </header>

      <section class="space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed">

        <section aria-labelledby="section-1-title">
          <h2 id="section-1-title" class="text-2xl font-bold text-slate-900 dark:text-white">
            1. Acceptation des conditions
          </h2>
          <p class="mt-4">
            En accédant à EcoScolar, vous acceptez d'être lié par les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.
          </p>
        </section>

        <section aria-labelledby="section-2-title">
          <h2 id="section-2-title" class="text-2xl font-bold text-slate-900 dark:text-white">
            2. Utilisation du service
          </h2>
          <p class="mt-4">
            Notre plateforme permet l'achat et la vente de fournitures scolaires d'occasion. Vous vous engagez à fournir des informations exactes et à ne pas utiliser le service à des fins illégales.
          </p>
          <ul class="list-disc pl-5 space-y-2 mt-4">
            <li>L'utilisateur doit avoir au moins 15 ans ou une autorisation parentale.</li>
            <li>Les articles mis en vente doivent être conformes à la réalité.</li>
          </ul>
        </section>

        <section aria-labelledby="section-3-title">
          <h2 id="section-3-title" class="text-2xl font-bold text-slate-900 dark:text-white">
            3. Limitation de responsabilité
          </h2>
          <p class="mt-4">
            EcoScolar agit en tant qu'intermédiaire. Nous ne saurions être tenus responsables de la qualité des articles échangés entre les utilisateurs.
          </p>
        </section>

      </section>

      <footer class="mt-12 p-6 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900">
        <p class="text-sm text-emerald-900 dark:text-emerald-300">
          Vous avez des questions sur nos conditions ?
          <NuxtLink :to="localePath('/support')" class="font-bold underline ml-1 focus:ring-2 focus:ring-emerald-500 outline-none">
            Contactez le support
          </NuxtLink>.
        </p>
      </footer>
    </article>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
</script>
