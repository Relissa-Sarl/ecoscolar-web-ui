<script setup lang="ts">
import { ref } from 'vue'

const uploadedFiles = ref<File[]>([])
const category = ref('supply')
const errors = ref<{ [key: string]: string }>({})
const form = ref({
    title: '',
    description: '',
    price: 0,

    subjectId: 1,
    schoolGradeId: 1,
    teachingLanguage: 1,
    studyLevel: '',

    condition: 'NEW',
    pictures: uploadedFiles.value,

    author: '',
    publisher: '',
    edition: '',
    isbn: '',
    bookCategoryId: 0,
    writtenLanguage: 1,
})

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    uploadedFiles.value = Array.from(input.files)
    form.value.pictures = uploadedFiles.value
    errors.value.images = ''
  }
}

const validateForm = (): boolean => {
    errors.value = {}

    // Validation for empty fields
    if (!category.value) {
        errors.value.category = $t('createAdvert.error.empty.category')
        return false
    }
    
    if (!form.value.title.trim()) {
        errors.value.title = $t('createAdvert.error.empty.title')
    }
    
    if (!form.value.description.trim()) {
        errors.value.description = $t('createAdvert.error.empty.description')
    }
    
    if (form.value.price <= 0) {
        errors.value.price = $t('createAdvert.error.empty.price')
    }

    switch (category.value) {
        case 'tutoring':
            if (!form.value.subjectId) {
                errors.value.subjectId = $t('createAdvert.error.empty.subjectId')
            }
            if (!form.value.schoolGradeId) {
                errors.value.schoolGradeId = $t('createAdvert.error.empty.schoolGradeId')
            }
            if (!form.value.teachingLanguage) {
                errors.value.teachingLanguage = $t('createAdvert.error.empty.teachingLanguage')
            }
            if (!form.value.studyLevel.trim()) {
                errors.value.studyLevel = $t('createAdvert.error.empty.studyLevel')
            }
            break
        case 'supply':
            if (!form.value.condition) {
                errors.value.condition = $t('createAdvert.error.empty.condition')
            }
            if (uploadedFiles.value.length === 0) {
                errors.value.images = $t('createAdvert.error.empty.images')
            }
            break
        case 'books':
            if (!form.value.condition) {
                errors.value.condition = $t('createAdvert.error.empty.condition')
            }
            if (!form.value.publisher.trim()) {
                errors.value.publisher = $t('createAdvert.error.empty.publisher')
            }
            if (!form.value.edition.trim()) {
                errors.value.edition = $t('createAdvert.error.empty.edition')
            }
            if (!form.value.isbn.trim()) {
                errors.value.isbn = $t('createAdvert.error.empty.isbn')
            }
            if (form.value.bookCategoryId === null || form.value.bookCategoryId === undefined) {
                errors.value.bookCategoryId = $t('createAdvert.error.empty.bookCategoryId')
            }
            if (!form.value.writtenLanguage) {
                errors.value.writtenLanguage = $t('createAdvert.error.empty.writtenLanguage')
            }
            if (!form.value.author.trim()) {
                errors.value.author = $t('createAdvert.error.empty.author')
            }
            if (uploadedFiles.value.length === 0) {
                errors.value.images = $t('createAdvert.error.empty.images')
            }
            break
    }

    if (Object.keys(errors.value).length > 0) {
        return false
    }

    // Additional validations (size, SQL injection, regex format, etc.)
    
    // Title length validation
    if (form.value.title.length < 3) {
        errors.value.title = $t('createAdvert.error.invalid.titleLengthMin')
    }
    if (form.value.title.length > 200) {
        errors.value.title = $t('createAdvert.error.invalid.titleLengthMax')
    }
    
    // Description length validation
    if (form.value.description.length < 10) {
        errors.value.description = $t('createAdvert.error.invalid.descriptionLengthMin')
    }
    if (form.value.description.length > 5000) {
        errors.value.description = $t('createAdvert.error.invalid.descriptionLengthMax')
    }
    
    // SQL injection prevention - check for suspicious patterns
    const sqlInjectionPattern = /('|(--)|;|\/\*|\*\/|xp_|sp_|exec|execute|select|insert|update|delete|drop|create|alter|union)/i
    if (sqlInjectionPattern.test(form.value.title) || sqlInjectionPattern.test(form.value.description) || sqlInjectionPattern.test(form.value.author) || sqlInjectionPattern.test(form.value.publisher) || sqlInjectionPattern.test(form.value.edition) || sqlInjectionPattern.test(form.value.isbn) || sqlInjectionPattern.test(form.value.studyLevel)) {
        errors.value.content = $t('createAdvert.error.invalid.sqlInjection')
    }
    
    // Price validation
    if (form.value.price < 0) {
        errors.value.price = $t('createAdvert.error.invalid.priceNegative')
    }
    if (form.value.price > 500) {
        errors.value.price = $t('createAdvert.error.invalid.priceMax')
    }
    if (!/^\d+(\.\d{1,2})?$/.test(form.value.price.toString())) {
        errors.value.price = $t('createAdvert.error.invalid.priceFormat')
    }

    const maxFileSize = 5 * 1024 * 1024 // 5MB
    switch (category.value) {
        case 'tutoring':
            if (form.value.subjectId < 1) {
                errors.value.subjectId = $t('createAdvert.error.invalid.subjectId')
            }
            if (form.value.schoolGradeId < 1) {
                errors.value.schoolGradeId = $t('createAdvert.error.invalid.schoolGradeId')
            }
            if (form.value.teachingLanguage < 1) {
                errors.value.teachingLanguage = $t('createAdvert.error.invalid.teachingLanguage')
            }
            if (form.value.studyLevel.length > 50) {
                errors.value.studyLevel = $t('createAdvert.error.invalid.studyLevelLength')
            }
            break
        case 'books':
            if (form.value.bookCategoryId < 0) {
                errors.value.bookCategoryId = $t('createAdvert.error.invalid.bookCategoryId')
            }
            if (form.value.writtenLanguage < 1) {
                errors.value.writtenLanguage = $t('createAdvert.error.invalid.writtenLanguage')
            }
            // ISBN validation (books only)
            if (!/^(?:\d-\d{4}-\d{4}-\d|97[89]-\d-\d{4}-\d{4}-\d)$/.test(form.value.isbn)) {
                errors.value.isbn = $t('createAdvert.error.invalid.isbnFormat')
            }
            // Author and Publisher length validation (books only)
            if (form.value.author.length > 150) {
                errors.value.author = $t('createAdvert.error.invalid.authorLength')
            }
            if (form.value.publisher.length > 150) {
                errors.value.publisher = $t('createAdvert.error.invalid.publisherLength')
            }
            // Edition length validation (books only)
            if (form.value.edition.length > 150) {
                errors.value.edition = $t('createAdvert.error.invalid.editionLength')
            }
            // File size validation
            uploadedFiles.value.forEach((file) => {
                if (file.size > maxFileSize) {
                    errors.value.images = $t('createAdvert.error.invalid.imageSize')
                }
                // Validate file type
                if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
                    errors.value.images = $t('createAdvert.error.invalid.imageType')
                }
            })
            
            // Maximum number of files validation
            if (uploadedFiles.value.length > 10) {
                errors.value.images = $t('createAdvert.error.invalid.imageCount')
            }
            break
        case 'supply':
            // File size validation
            uploadedFiles.value.forEach((file) => {
                if (file.size > maxFileSize) {
                    errors.value.images = $t('createAdvert.error.invalid.imageSize')
                }
                // Validate file type
                if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
                    errors.value.images = $t('createAdvert.error.invalid.imageType')
                }
            })
            
            // Maximum number of files validation
            if (uploadedFiles.value.length > 10) {
                errors.value.images = $t('createAdvert.error.invalid.imageCount')
            }
            break
    }
    
    return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
    if (!validateForm()) {
      return
    }
    var formData = new Object()
    switch (category.value) {
        case 'supply':
            formData = {
                title: form.value.title,
                description: form.value.description,
                price: form.value.price,
                userId: 'user.value.id',
                condition: form.value.condition,
                pictures: form.value.pictures
            }
            // Call API to create supply advert with form.value
            break
        case 'books':
            formData = {
                title: form.value.title,
                description: form.value.description,
                price: form.value.price,
                userId: 'user.value.id',
                condition: form.value.condition,
                pictures: form.value.pictures,
                author: form.value.author,
                publisher: form.value.publisher,
                isbn: form.value.isbn,
                bookCategoryId: form.value.bookCategoryId,
                writtenLanguage: form.value.writtenLanguage,
                edition: form.value.edition
            }
            // Call API to create book advert with form.value
            break
        case 'tutoring':
            formData = {
                title: form.value.title,
                description: form.value.description,
                price: form.value.price,
                userId: 'user.value.id',
                subjectId: form.value.subjectId,
                schoolGradeId: form.value.schoolGradeId,
                teachingLanguage: form.value.teachingLanguage,
                studyLevel: form.value.studyLevel
            }
            // Call API to create tutoring advert with form.value
            break
    }
    console.log('Form submitted with data:', formData)
    //return navigateTo('../me/adverts') // Redirect to adverts list after successful creation
}
</script>

<template>
    <div class="min-h-screen px-4 py-6 text-gray-900 dark:text-gray-50 md:px-6 lg:px-8">
        <div class="mx-auto flex max-w-7xl flex-col gap-6 xl:flex-row">
            <!-- <AppFilter/> -->
            <div class="flex-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 md:p-8">
                <header class="mb-8">
                    <p class="mb-2 text-sm font-medium uppercase tracking-wide text-primary">{{$t('createAdvert.newAdvert')}}</p>
                    <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-300">{{$t('createAdvert.createAdvert')}}</h1>
                    <p class="mt-2 max-w-2xl text-sm text-gray-500">{{$t('createAdvert.description')}}</p>
                </header>

                <form class="space-y-8" @submit.prevent="handleSubmit">
                    <section class="rounded-2xl border border-gray-200 bg-gray-50/60 dark:border-gray-400 dark:bg-gray-800 dark:text-gray-400 p-5">
                        <h2 class="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-primary">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                            {{ $t('createAdvert.form.information') }}
                        </h2>
                        <div>
                            <label class="mb-2 block text-sm font-medium text-gray-600">Type de catégorie</label>
                            <div class="grid gap-3 sm:grid-cols-3">
                                <label class="cursor-pointer"><input v-model="category" class="peer sr-only" id="cat-supply" name="category" type="radio" value="supply"/>
                                    <div class="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition peer-checked:border-primary peer-checked:bg-primary/5 dark:bg-gray-800 dark:border-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-gray-400">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                        </svg>
                                        <span class="font-medium text-gray-600 dark:text-gray-300">{{ $t('createAdvert.form.supplies') }}</span>
                                    </div>
                                </label>
                                <label class="cursor-pointer"><input v-model="category" class="peer sr-only" id="cat-books" name="category" type="radio" value="books"/>
                                    <div class="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition peer-checked:border-primary peer-checked:bg-primary/5 dark:bg-gray-800 dark:border-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-gray-400">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                                        </svg>
                                        <span class="font-medium text-gray-600 dark:text-gray-300">{{ $t('createAdvert.form.books') }}</span>
                                    </div>
                                </label>
                                <label class="cursor-pointer"><input v-model="category" class="peer sr-only" id="cat-tutoring" name="category" type="radio" value="tutoring"/>
                                    <div class="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition peer-checked:border-primary peer-checked:bg-primary/5 dark:bg-gray-800 dark:border-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-gray-400">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                        </svg>
                                        <span class="font-medium text-gray-600 dark:text-gray-300">{{ $t('createAdvert.form.tutoring') }}</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                        <p v-show="errors.category != null" class="mt-1 min-h-5 text-sm text-red-500">{{ errors.category }}</p>
                    </section>

                    <section class="rounded-2xl border border-gray-200 bg-gray-50/60 dark:border-gray-400 dark:bg-gray-800 dark:text-gray-400 p-5">
                        <h2 class="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-primary">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                            {{ $t('createAdvert.form.detailedInformation') }}
                        </h2>
                        <div class="mt-5 grid gap-5 md:grid-cols-2">
                            <div class="col-span-2">
                                <label class="mb-2 block text-sm font-medium text-gray-600" for="title">
                                    {{ $t('createAdvert.form.title') }}
                                </label>
                                <input v-model="form.title" class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300" id="title" :placeholder="$t('createAdvert.form.titlePlaceholder')" type="text"/>
                                <p class="mt-1 min-h-5 text-sm text-red-500">{{ errors.title || ' ' }}</p>
                            </div>
                            <div v-show="category == 'supply' || category == 'books'">
                                <label class="mb-2 block text-sm font-medium text-gray-600" for="condition">
                                    {{ $t('createAdvert.form.condition') }}
                                </label>
                                <select v-model="form.condition" class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300" id="condition">
                                    <option value="NEW">Neuf</option>
                                    <option value="LIKE_NEW">Plus ou moins neuf</option>
                                    <option value="USED">Usé</option>
                                </select>
                                <p v-show="errors.condition != null" class="mt-1 min-h-5 text-sm text-red-500">{{ errors.condition }}</p>
                            </div>
                            <div v-show="category == 'books'">
                                <label class="mb-2 block text-sm font-medium text-gray-600" for="author">
                                    {{ $t('createAdvert.form.author') }}
                                </label>
                                <input v-model="form.author" class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300" id="author" :placeholder="$t('createAdvert.form.authorPlaceholder')" type="text"/>
                                <p v-show="errors.author != null" class="mt-1 min-h-5 text-sm text-red-500">{{ errors.author }}</p>
                            </div>
                            <div v-show="category == 'books'">
                                <label class="mb-2 block text-sm font-medium text-gray-600" for="publisher">
                                    {{ $t('createAdvert.form.publisher') }}
                                </label>
                                <input v-model="form.publisher" class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300" id="publisher" :placeholder="$t('createAdvert.form.publisherPlaceholder')" type="text"/>
                                <p v-show="errors.publisher != null" class="mt-1 min-h-5 text-sm text-red-500">{{ errors.publisher }}</p>
                            </div>
                            <div v-show="category == 'books'">
                                <label class="mb-2 block text-sm font-medium text-gray-600" for="edition">
                                    {{ $t('createAdvert.form.edition') }}
                                </label>
                                <input v-model="form.edition" class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300" id="edition" :placeholder="$t('createAdvert.form.editionPlaceholder')" type="text"/>
                                <p v-show="errors.edition != null" class="mt-1 min-h-5 text-sm text-red-500">{{ errors.edition }}</p>
                            </div>
                            <div v-show="category == 'books'">
                                <label class="mb-2 block text-sm font-medium text-gray-600" for="isbn">
                                    {{ $t('createAdvert.form.isbn') }}
                                </label>
                                <div class="relative">
                                    <input v-model="form.isbn" class="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300" id="isbn" :placeholder="$t('createAdvert.form.isbnPlaceholder')" type="text"/>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
                                    </svg>
                                </div>
                                <p v-show="errors.isbn != null" class="mt-1 min-h-5 text-sm text-red-500">{{ errors.isbn }}</p>
                            </div>
                            <div v-show="category == 'books'">
                                <label class="mb-2 block text-sm font-medium text-gray-600" for="bookCategoryId">
                                    {{ $t('createAdvert.form.bookCategoryId') }}
                                </label>
                                <select v-model="form.bookCategoryId" class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300" id="bookCategoryId">
                                    <option value=0>Toutes matières / Non applicable</option>
                                    <option value=1>Mathématiques</option>
                                    <option value=2>Français</option>
                                    <option value=3>Histoire-Géo</option>
                                    <option value=4>Physique-Chimie</option>
                                    <option value=5>Langues</option>
                                </select>
                                <p v-show="errors.bookCategoryId != null" class="mt-1 min-h-5 text-sm text-red-500">{{ errors.bookCategoryId }}</p>
                            </div>
                            <div v-show="category == 'books'">
                                <label class="mb-2 block text-sm font-medium text-gray-600" for="writtenLanguage">
                                    {{ $t('createAdvert.form.writtenLanguage') }}
                                </label>
                                <select v-model="form.writtenLanguage" class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300" id="writtenLanguage">
                                    <option value=1>Français</option>
                                    <option value=2>Allemand</option>
                                    <option value=3>Italien</option>
                                </select>
                                <p v-show="errors.writtenLanguage != null" class="mt-1 min-h-5 text-sm text-red-500">{{ errors.writtenLanguage }}</p>
                            </div>
                            <div v-show="category == 'tutoring'">
                                <label class="mb-2 block text-sm font-medium text-gray-600" for="subjectId">
                                    {{ $t('createAdvert.form.subjectId') }}
                                </label>
                                <select v-model="form.subjectId" class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300" id="subjectId">
                                    <option value=1>Toutes matières / Non applicable</option>
                                    <option value=2>Mathématiques</option>
                                    <option value=3>Français</option>
                                    <option value=4>Histoire-Géo</option>
                                    <option value=5>Physique-Chimie</option>
                                    <option value=6>Langues</option>
                                </select>
                                <p v-show="errors.subjectId != null" class="mt-1 min-h-5 text-sm text-red-500">{{ errors.subjectId }}</p>
                            </div>
                            <div v-show="category == 'tutoring'">
                                <label class="mb-2 block text-sm font-medium text-gray-600" for="schoolGradeId">
                                    {{ $t('createAdvert.form.schoolGradeId') }}
                                </label>
                                <select v-model="form.schoolGradeId" class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300" id="schoolGradeId">
                                    <option value=1>Primaire</option>
                                    <option value=2>Collège</option>
                                    <option value=3>Lycée</option>
                                    <option value=4>Supérieur</option>
                                </select>
                                <p v-show="errors.schoolGradeId != null" class="mt-1 min-h-5 text-sm text-red-500">{{ errors.schoolGradeId }}</p>
                            </div>
                            <div v-show="category == 'tutoring'">
                                <label class="mb-2 block text-sm font-medium text-gray-600" for="teachingLanguage">
                                    {{ $t('createAdvert.form.teachingLanguage') }}
                                </label>
                                <select v-model="form.teachingLanguage" class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300" id="teachingLanguage">
                                    <option value=1>Français</option>
                                    <option value=2>Allemand</option>
                                    <option value=3>Italien</option>
                                </select>
                                <p v-show="errors.teachingLanguage != null" class="mt-1 min-h-5 text-sm text-red-500">{{ errors.teachingLanguage }}</p>
                            </div>
                            <div v-show="category == 'tutoring'">
                                <label class="mb-2 block text-sm font-medium text-gray-600" for="isbn">
                                    {{ $t('createAdvert.form.studyLevel') }}
                                </label>
                                <div class="relative">
                                    <input v-model="form.studyLevel" class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300" id="studyLevel" :placeholder="$t('createAdvert.form.studyLevelPlaceholder')" type="text"/>
                                </div>
                                <p v-show="errors.studyLevel != null" class="mt-1 min-h-5 text-sm text-red-500">{{ errors.studyLevel }}</p>
                            </div>
                            <div class="md:col-span-2">
                                <label class="mb-2 block text-sm font-medium text-gray-600" for="description">
                                    {{ $t('createAdvert.form.description') }}
                                </label>
                                <textarea v-model="form.description" class="min-h-32 w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-300" id="description" :placeholder="$t('createAdvert.form.descriptionPlaceholder')" rows="4"></textarea>
                                <p class="mt-1 min-h-5 text-sm text-red-500">{{ errors.description || ' ' }}</p>
                            </div>
                        </div>
                    </section>

                    <section class="rounded-2xl border border-gray-200 bg-gray-50/60 dark:border-gray-400 dark:bg-gray-800 dark:text-gray-400 p-5">
                        <h2 class="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-primary">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                            </svg>
                            {{ $t('createAdvert.form.sales') }}
                        </h2>
                        <div class="mt-5 grid gap-5 md:grid-cols-3">
                            <div>
                                <label class="mb-2 block text-sm font-medium text-gray-600" for="price">
                                    {{ $t('createAdvert.form.price') }}
                                </label>
                                <div class="flex items-center overflow-hidden rounded-xl border border-gray-200 bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 dark:bg-gray-800 dark:border-gray-400">
                                    <input v-model="form.price" class="w-full bg-transparent px-4 py-3 text-sm outline-none dark:text-gray-300" id="price" placeholder="0.00" type="number" step="0.01"/>
                                    <span class="px-4 text-sm font-medium text-gray-500">
                                        CHF
                                    </span>
                                </div>
                                <p class="mt-1 min-h-5 text-sm text-red-500">{{ errors.price || ' ' }}</p>
                            </div>
                        </div>
                    </section>

                    <section v-show="category == 'supply' || category == 'books'" class="rounded-2xl border border-dashed border-gray-300 bg-gray-50/60 dark:border-gray-400 dark:bg-gray-800 dark:text-gray-400 p-5">
                        <h2 class="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-primary">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                            </svg>
                            {{ $t('createAdvert.form.images') }}
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
                                    {{ $t('createAdvert.form.uploadImages') }}
                                </p>
                                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    {{ $t('createAdvert.form.dragDrop') }}
                                </p>
                            </div>
                            <div v-else class="space-y-2">
                                <p class="text-sm font-semibold text-gray-900 dark:text-gray-300">
                                    {{ uploadedFiles.length }} {{ $t('createAdvert.form.uploadedImages') }}
                                </p>
                                <ul class="text-sm text-gray-500 dark:text-gray-400 list-disc list-inside">
                                    <li v-for="file in uploadedFiles" :key="file.name">{{ file.name }}</li>
                                </ul>
                            </div>
                        </label>
                        <p v-show="errors.images != null" class="mt-2 min-h-5 text-sm text-red-500">{{ errors.images}}</p>
                    </section>
                    
                    <p v-show="errors.content != null" class="mt-2 min-h-5 text-sm flex justify-center text-red-500">{{ errors.content}}</p>
                    <div class="flex justify-end">
                        <button class="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90" type="submit">
                            {{ $t('createAdvert.form.publish') }}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>