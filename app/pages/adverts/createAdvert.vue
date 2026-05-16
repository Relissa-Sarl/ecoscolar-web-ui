<script setup lang="ts">
import { ref } from 'vue'

const uploadedFiles = ref<File[]>([])
const form = ref({
    category: 'supply',
    title: '',
    description: '',
    price: 0,
    userId: '',
    
    subjectId: 1,
    schoolGradeId: 1,
    teachingLanguage: 1,

    condition: 'NEW',
    pictures: uploadedFiles.value,

    author: '',
    publisher: '',
    isbn: '',
    bookCategoryId: 0,
    writtenLanguage: 1,
})

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    uploadedFiles.value = Array.from(input.files)
    form.value.pictures = uploadedFiles.value
  }
}

const handleSubmit = () => {
    console.log({
        ...form.value,
        files: uploadedFiles.value,
    })
}
</script>

<template>
    <div class="min-h-screen px-4 py-6 text-gray-900 dark:text-gray-50 md:px-6 lg:px-8">
        <div class="mx-auto flex max-w-7xl flex-col gap-6 xl:flex-row">
            <!-- <AppFilter/> -->
            <div class="flex-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 md:p-8">
                <header class="mb-8">
                    <p class="mb-2 text-sm font-medium uppercase tracking-wide text-primary">Nouvelle annonce</p>
                    <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-300">Créer une nouvelle annonce</h1>
                    <p class="mt-2 max-w-2xl text-sm text-gray-500">Partagez vos ressources éducatives avec la communauté EcoScolar.</p>
                </header>

                <form class="space-y-8" @submit.prevent="handleSubmit">
                    <section class="rounded-2xl border border-gray-200 bg-gray-50/60 dark:border-gray-400 dark:bg-gray-800 dark:text-gray-400 p-5">
                        <h2 class="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-primary">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                            Classification
                        </h2>
                        <div>
                            <label class="mb-2 block text-sm font-medium text-gray-600">Type de catégorie</label>
                            <div class="grid gap-3 sm:grid-cols-3">
                                <label class="cursor-pointer"><input v-model="form.category" class="peer sr-only" id="cat-supply" name="category" type="radio" value="supply"/>
                                    <div class="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition peer-checked:border-primary peer-checked:bg-primary/5 dark:bg-gray-800 dark:border-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-gray-400">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                        </svg>
                                        <span class="font-medium text-gray-600 dark:text-gray-300">Fournitures</span>
                                    </div>
                                </label>
                                <label class="cursor-pointer"><input v-model="form.category" class="peer sr-only" id="cat-books" name="category" type="radio" value="books"/>
                                    <div class="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition peer-checked:border-primary peer-checked:bg-primary/5 dark:bg-gray-800 dark:border-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-gray-400">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                                        </svg>
                                        <span class="font-medium text-gray-600 dark:text-gray-300">Livres</span>
                                    </div>
                                </label>
                                <label class="cursor-pointer"><input v-model="form.category" class="peer sr-only" id="cat-tutoring" name="category" type="radio" value="tutoring"/>
                                    <div class="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition peer-checked:border-primary peer-checked:bg-primary/5 dark:bg-gray-800 dark:border-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-gray-400">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                        </svg>
                                        <span class="font-medium text-gray-600 dark:text-gray-300">Tutorat</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </section>

                    <section class="rounded-2xl border border-gray-200 bg-gray-50/60 dark:border-gray-400 dark:bg-gray-800 dark:text-gray-400 p-5">
                        <h2 class="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-primary">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                            Informations détaillées
                        </h2>
                        <div class="mt-5 grid gap-5 md:grid-cols-2">
                            <div class="col-span-2">
                                <label class="mb-2 block text-sm font-medium text-gray-600" for="title">
                                    Nom de l'article / Titre
                                </label>
                                <input v-model="form.title" class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300" id="title" placeholder="Ex: Livre de mathématiques" type="text"/>
                            </div>
                            <div v-show="form.category == 'supply' || form.category == 'books'">
                                <label class="mb-2 block text-sm font-medium text-gray-600" for="condition">Condition</label>
                                <select v-model="form.condition" class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300" id="condition">
                                    <option value="NEW">Neuf</option>
                                    <option value="LIKE_NEW">Plus ou moins neuf</option>
                                    <option value="USED">Usé</option>
                                </select>
                            </div>
                            <div v-show="form.category == 'books'">
                                <label class="mb-2 block text-sm font-medium text-gray-600" for="author">Auteur</label>
                                <input v-model="form.author" class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300" id="author" placeholder="Ex: Tolkiens" type="text"/>
                            </div>
                            <div v-show="form.category == 'books'">
                                <label class="mb-2 block text-sm font-medium text-gray-600" for="publisher">Publié par</label>
                                <input v-model="form.publisher" class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300" id="publisher" placeholder="Ex: Gallimard" type="text"/>
                            </div>
                            <div v-show="form.category == 'books'">
                                <label class="mb-2 block text-sm font-medium text-gray-600" for="isbn">ISBN (Facultatif, sauf livres)</label>
                                <div class="relative">
                                    <input v-model="form.isbn" class="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300" id="isbn" placeholder="978-..." type="text"/>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
                                    </svg>
                                </div>
                            </div>
                            <div v-show="form.category == 'books'">
                                <label class="mb-2 block text-sm font-medium text-gray-600" for="bookCategoryId">Catégorie de livre</label>
                                <select v-model="form.bookCategoryId" class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300" id="bookCategoryId">
                                    <option value=0>Toutes matières / Non applicable</option>
                                    <option value=1>Mathématiques</option>
                                    <option value=2>Français</option>
                                    <option value=3>Histoire-Géo</option>
                                    <option value=4>Physique-Chimie</option>
                                    <option value=5>Langues</option>
                                </select>
                            </div>
                            <div v-show="form.category == 'books'">
                                <label class="mb-2 block text-sm font-medium text-gray-600" for="writtenLanguage">Langue du livre</label>
                                <select v-model="form.writtenLanguage" class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300" id="writtenLanguage">
                                    <option value=1>Français</option>
                                    <option value=2>Allemand</option>
                                    <option value=3>Italien</option>
                                </select>
                            </div>
                            <div v-show="form.category == 'tutoring'">
                                <label class="mb-2 block text-sm font-medium text-gray-600" for="subjectId">Sujet du cours</label>
                                <select v-model="form.subjectId" class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300" id="subjectId">
                                    <option value=1>Toutes matières / Non applicable</option>
                                    <option value=2>Mathématiques</option>
                                    <option value=3>Français</option>
                                    <option value=4>Histoire-Géo</option>
                                    <option value=5>Physique-Chimie</option>
                                    <option value=6>Langues</option>
                                </select>
                            </div>
                            <div v-show="form.category == 'tutoring'">
                                <label class="mb-2 block text-sm font-medium text-gray-600" for="schoolGradeId">Niveau scolaire</label>
                                <select v-model="form.schoolGradeId" class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300" id="schoolGradeId">
                                    <option value=1>Primaire</option>
                                    <option value=2>Collège</option>
                                    <option value=3>Lycée</option>
                                    <option value=4>Supérieur</option>
                                </select>
                            </div>
                            <div v-show="form.category == 'tutoring'">
                                <label class="mb-2 block text-sm font-medium text-gray-600" for="teachingLanguage">Langue parlée</label>
                                <select v-model="form.teachingLanguage" class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300" id="teachingLanguage">
                                    <option value=1>Français</option>
                                    <option value=2>Allemand</option>
                                    <option value=3>Italien</option>
                                </select>
                            </div>
                            <div class="md:col-span-2">
                                <label class="mb-2 block text-sm font-medium text-gray-600" for="description">Description</label>
                                <textarea v-model="form.description" class="min-h-32 w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300" id="description" placeholder="Décrivez l'état de l'objet, ses fonctionnalités ou le contenu de votre cours..." rows="4"></textarea>
                            </div>
                        </div>
                    </section>

                    <section class="rounded-2xl border border-gray-200 bg-gray-50/60 dark:border-gray-400 dark:bg-gray-800 dark:text-gray-400 p-5">
                        <h2 class="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-primary">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                            </svg>
                            Vente
                        </h2>
                        <div class="mt-5 grid gap-5 md:grid-cols-3">
                            <div>
                                <label class="mb-2 block text-sm font-medium text-gray-600" for="price">
                                    Prix (CHF)
                                </label>
                                <div class="flex items-center overflow-hidden rounded-xl border border-gray-200 bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 dark:bg-gray-800 dark:border-gray-400">
                                    <input v-model="form.price" class="w-full bg-transparent px-4 py-3 text-sm outline-none dark:text-gray-300" id="price" placeholder="0.00" type="number"/>
                                    <span class="px-4 text-sm font-medium text-gray-500">
                                        CHF
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section v-show="form.category == 'supply' || form.category == 'books'" class="rounded-2xl border border-dashed border-gray-300 bg-gray-50/60 dark:border-gray-400 dark:bg-gray-800 dark:text-gray-400 p-5">
                        <h2 class="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-primary">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                            </svg>
                            Photos
                        </h2>
                        <label class="mt-5 flex flex-col items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center cursor-pointer dark:bg-gray-800 dark:border-gray-400">
                            <input type="file" v-on:change="handleImageUpload" multiple accept="image/*" class="hidden" id="images"/>
                            <div class="rounded-full bg-primary/10 p-4 text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                                </svg>
                            </div>
                            <div v-if="uploadedFiles.length == 0">
                                <p class="text-sm font-semibold text-gray-900 dark:text-gray-300">
                                    Ajoutez des photos
                                </p>
                                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Glissez-déposez ou cliquez
                                </p>
                            </div>
                            <div v-else class="space-y-2">
                                <p class="text-sm font-semibold text-gray-900 dark:text-gray-300">
                                    {{ uploadedFiles.length }} photo(s) sélectionnée(s)
                                </p>
                                <ul class="text-sm text-gray-500 dark:text-gray-400 list-disc list-inside">
                                    <li v-for="file in uploadedFiles" :key="file.name">{{ file.name }}</li>
                                </ul>
                            </div>
                        </label>
                    </section>

                    <div class="flex justify-end">
                        <button class="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90" type="submit">
                            Publier l'annonce 
                            <span data-icon="send">send</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>