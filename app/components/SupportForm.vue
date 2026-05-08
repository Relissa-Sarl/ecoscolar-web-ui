<template>
  <form @submit.prevent="handleSubmit" class="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">

    <div class="flex flex-col gap-2">
      <label for="email" class="text-sm font-bold text-slate-700 dark:text-slate-300">
        Adresse e-mail <span class="text-red-600" aria-hidden="true">*</span>
      </label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        required
        aria-required="true"
        placeholder="exemple@email.com"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
      />
    </div>

    <div class="flex flex-col gap-2">
      <label for="reason" class="text-sm font-bold text-slate-700 dark:text-slate-300">
        Raison du contact <span class="text-red-600" aria-hidden="true">*</span>
      </label>
      <select
        id="reason"
        v-model="form.reason"
        required
        aria-required="true"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all cursor-pointer"
      >
        <option value="" disabled>Sélectionnez une option</option>
        <option value="account">Problème de compte</option>
        <option value="order">Suivi de commande</option>
        <option value="bug">Signaler un bug</option>
        <option value="other">Autre demande</option>
      </select>
    </div>

    <div class="flex flex-col gap-2">
      <label for="message" class="text-sm font-bold text-slate-700 dark:text-slate-300">
        Votre message <span class="text-red-600" aria-hidden="true">*</span>
      </label>
      <textarea
        id="message"
        v-model="form.message"
        rows="5"
        required
        aria-required="true"
        placeholder="Comment pouvons-nous vous aider ?"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
      ></textarea>
    </div>

    <div class="flex flex-col sm:flex-row gap-4 pt-4">
      <button
        type="submit"
        class="flex-1 bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors focus:ring-4 focus:ring-emerald-500/50 outline-none"
      >
        Envoyer le message
      </button>
      <button
        type="button"
        @click="handleCancel"
        class="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-300 font-bold py-3 px-6 rounded-lg transition-colors focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-700 outline-none"
      >
        Annuler
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
const router = useRouter()
const localePath = useLocalePath()

const form = ref({
  email: '',
  reason: '',
  message: ''
})

const handleSubmit = () => {
  console.log('Formulaire soumis :', form.value)
  alert('Merci ! Votre message a été envoyé.')
  router.push(localePath('/'))
}

const handleCancel = () => {
  if (confirm('Voulez-vous vraiment annuler ? Vos modifications seront perdues.')) {
    router.push(localePath('/'))
  }
}
</script>
