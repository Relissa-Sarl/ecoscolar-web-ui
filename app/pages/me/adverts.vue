<script lang="ts" setup>
import { ref } from 'vue'
import type { Advert } from '~/../types/advert'
import { AdvertType } from '~/utils/enum/advertType'
import { AdvertStatus } from '~/utils/enum/advertStatus'
definePageMeta({ layout: 'default' })

const filters = ref<string[]>([$t('me.adverts.filters.all'), $t('me.adverts.filters.book'), $t('me.adverts.filters.supplies'), $t('me.adverts.filters.tutoring')])

const filterBy = ref<string>($t('me.adverts.filters.all'))
const filterByType = (advert: Advert) => {
    if (filterBy.value === $t('me.adverts.filters.all')) return true
    if (filterBy.value === $t('me.adverts.filters.supplies')) return advert.type === AdvertType.PRODUCT
    if (filterBy.value === $t('me.adverts.filters.tutoring')) return advert.type === AdvertType.SERVICE
    if (filterBy.value === $t('me.adverts.filters.book')) return advert.type === AdvertType.BOOK
    return false
}
const getActionText = (status: AdvertStatus) => {
    if (status === AdvertStatus.ACTIVE) return $t('me.adverts.actions.edit')
    if (status === AdvertStatus.PAUSED) return $t('me.adverts.actions.resume')
    if (status === AdvertStatus.EXPIRED) return $t('me.adverts.actions.expired')
    if (status === AdvertStatus.SOLD) return $t('me.adverts.actions.sold')
    return ''
}
const isActionDisabled = (status: AdvertStatus) => {
    return status === AdvertStatus.EXPIRED || status === AdvertStatus.SOLD
}
const statusBadgeClass = (status: AdvertStatus) => {
    if (status === AdvertStatus.ACTIVE) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
    if (status === AdvertStatus.PAUSED) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
    if (status === AdvertStatus.EXPIRED) return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    if (status === AdvertStatus.SOLD) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
    return 'bg-gray-100 text-gray-700'
}
const deleteAdvert = (id: number) => {
    adverts.value = adverts.value.filter(advert => advert.id !== id)
}
const adverts = ref<Advert[]>([
    {
        id: 1,
        title: 'Livre de mathématiques',
        price: 10,
        type: AdvertType.BOOK,
        status: AdvertStatus.ACTIVE,
        publicationDate: new Date('2024-06-01'),
        notificationDate: new Date('2026-06-01'),
        userId: 1,
        sellerPseudo: 'John Doe',
        primaryImage: 'book.jpg'
    },
    {
        id: 2,
        title: 'Trousse de fournitures scolaires',
        price: 15,
        type: AdvertType.PRODUCT,
        status: AdvertStatus.ACTIVE,
        publicationDate: new Date('2024-06-05'),
        notificationDate: new Date('2026-06-05'),
        userId: 1,
        sellerPseudo: 'John Doe',
        primaryImage: 'supplies.jpg'
    },
    {
        id: 3,
        title: 'Cours de tutorat en mathématiques',
        price: 20,
        type: AdvertType.SERVICE,
        status: AdvertStatus.ACTIVE,
        publicationDate: new Date('2024-06-10'),
        notificationDate: new Date('2026-06-10'),
        userId: 1,
        sellerPseudo: 'John Doe',
        primaryImage: 'tutoring.jpg'
    },
    {
        id: 4,
        title: 'Livre de français',
        price: 8,
        type: AdvertType.BOOK,
        status: AdvertStatus.PAUSED,
        publicationDate: new Date('2024-06-15'),
        notificationDate: new Date('2026-06-15'),
        userId: 1,
        sellerPseudo: 'John Doe',
        primaryImage: 'book2.jpg'
    },
    {
        id: 5,
        title: 'Ancien cartable en bon état',
        price: 25,
        type: AdvertType.PRODUCT,
        status: AdvertStatus.EXPIRED,
        publicationDate: new Date('2024-06-20'),
        notificationDate: new Date('2026-06-20'),
        userId: 1,
        sellerPseudo: 'John Doe',
        primaryImage: 'backpack.jpg'
    },
    {
        id: 6,
        title: 'Livre d\'anglais',
        price: 18,
        type: AdvertType.BOOK,
        status: AdvertStatus.SOLD,
        publicationDate: new Date('2024-06-25'),
        notificationDate: new Date('2026-06-25'),
        userId: 1,
        sellerPseudo: 'John Doe',
        primaryImage: 'book3.jpg'
    }
])
</script>


<template>
    <section class="min-h-screen px-4 py-10 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <div class="mx-auto rounded-3xl p-8 text-left dark:bg-gray-950 dark:text-gray-100">
            <h1 class="text-3xl font-bold tracking-tight md:text-4xl">{{ $t('me.adverts.title') }}</h1>

            <p class="mx-auto mt-4 text-sm leading-6 text-gray-600 dark:text-gray-400 md:text-base">
                {{ $t('me.adverts.description') }}
            </p>
        </div>
        <div class="mt-8 p-6">
            <div class="flex flex-col gap-6">
                <!-- Filters -->
                <div class="flex flex-wrap items-center justify-center gap-3 ">
                    <div class="rounded-xl border border-gray-200 bg-gray-50 shadow-sm dark:border-gray-800 dark:bg-gray-900 p-2">
                        <button
                            v-for="l in filters"
                            :key="l"
                            class="rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200"
                            :class="filterBy === l
                            ? 'bg-gray-900 text-white shadow-sm dark:bg-gray-100 dark:text-gray-900'
                            : 'bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'"
                            @click="filterBy = l">
                            {{ l.toUpperCase() }}
                        </button>
                    </div>
                    <NuxtLink to="/me/adverts/new" class="ml-auto rounded-xl bg-[#105B53] px-4 py-2 text-sm font-medium text-white hover:bg-[#0c4540] dark:text-gray-300">
                        {{ $t('me.adverts.add') }}
                    </NuxtLink>
                </div>
                <!-- Adverts -->
                <div class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    <h2 v-if="adverts !== null && adverts.length === 0">{{ $t('me.adverts.empty') }}</h2>
                    <div v-else v-for="advert in adverts" :key="advert.id" v-show="filterByType(advert)">
                        <div class="group h-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950">
                            <!-- Image -->
                            <div class="aspect-4/3 overflow-hidden bg-gray-300 dark:bg-gray-800">
                                <img :src="advert.primaryImage" alt="Image de l'annonce" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105">
                            </div>

                            <!-- Advert Details -->
                            <div class="p-5 text-left">
                                <div class="mb-3 flex items-start justify-between gap-3">
                                    <h3 class="text-lg font-semibold leading-tight">{{ advert.title }}</h3>
                                    <span class="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">{{ advert.type }}</span>
                                </div>
                                <p class="text-2xl font-bold text-gray-900 dark:text-gray-100" :class="advert.status === AdvertStatus.SOLD ? 'line-through' : ''">
                                    {{ advert.price }} CHF{{ advert.type === AdvertType.SERVICE ? '/H' : '' }}
                                </p>
                            </div>

                            <!-- Action Buttons -->
                            <div class="flex gap-3 border-t border-gray-200 px-5 py-3 dark:border-gray-800">
                                <NuxtLink :to="`/me/adverts/${advert.id}/edit`" :class="['flex-1', isActionDisabled(advert.status) ? 'pointer-events-none' : '']">
                                    <div :class="[isActionDisabled(advert.status) ? 'cursor-not-allowed rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400' : 'rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900', 'py-2 text-center text-sm font-medium']">
                                        {{ getActionText(advert.status) }}
                                    </div>
                                </NuxtLink>
                                <button class="rounded-lg border border-red-500 p-2 text-red-500 transition-colors hover:bg-red-500/10" @click="deleteAdvert(advert.id)">
                                <!--<button v-if="!isActionDisabled(advert.status)"class="rounded-lg border border-red-500 p-2 text-red-500 transition-colors hover:bg-red-500/10" @click="deleteAdvert(advert.id)">-->
                                    <span class="material-symbols-outlined text-base">[ svg of a trash can ]</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>