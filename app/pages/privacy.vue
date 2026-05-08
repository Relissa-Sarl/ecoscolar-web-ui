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
          Politique de Confidentialité
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-4">
          Dernière mise à jour : <time datetime="2024-05-20">20 Mai 2024</time>
        </p>
      </header>

      <section class="space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed">

        <section aria-labelledby="privacy-1-title">
          <h2 id="privacy-1-title" class="text-2xl font-bold text-slate-900 dark:text-white">
            1. Collecte des données
          </h2>
          <p class="mt-4">
            Nous collectons les informations que vous nous fournissez directement lors de la création de votre compte EcoScolar, notamment votre adresse e-mail et vos informations de profil.
          </p>
        </section>

        <section aria-labelledby="privacy-2-title">
          <h2 id="privacy-2-title" class="text-2xl font-bold text-slate-900 dark:text-white">
            2. Utilisation de vos données
          </h2>
          <p class="mt-4">
            Vos données sont utilisées exclusivement pour :
          </p>
          <ul class="list-disc pl-5 space-y-2 mt-4">
            <li>Gérer votre compte et vos transactions.</li>
            <li>Vous envoyer des notifications relatives à vos achats ou ventes.</li>
            <li>Améliorer l'expérience utilisateur sur notre plateforme.</li>
          </ul>
        </section>

        <section aria-labelledby="privacy-3-title">
          <h2 id="privacy-3-title" class="text-2xl font-bold text-slate-900 dark:text-white">
            3. Vos droits et accès
          </h2>
          <p class="mt-4">
            Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Vous pouvez exercer ces droits à tout moment depuis votre profil.
          </p>
        </section>

        <section aria-labelledby="privacy-4-title">
          <h2 id="privacy-4-title" class="text-2xl font-bold text-slate-900 dark:text-white">
            4. Sécurité des données
          </h2>
          <p class="mt-4">
            Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données contre tout accès non autorisé ou perte.
          </p>
        </section>

      </section>

      <footer class="mt-12 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <p class="text-sm">
          Pour toute question concernant vos données personnelles, contactez notre délégué à la protection des données via le
          <NuxtLink :to="localePath('/support')" class="text-emerald-700 dark:text-emerald-400 font-bold underline focus:ring-2 focus:ring-emerald-500 outline-none">
            formulaire de support
          </NuxtLink>.
        </p>
      </footer>
    </article>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
</script>
