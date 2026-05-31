<script setup lang="ts">
import { ref } from 'vue'
import type { Seller, QuestionResponse } from '@/types/advert'

interface Props {
  seller: Seller
  questions?: QuestionResponse[]
}

withDefaults(defineProps<Props>(), {
  questions: () => []
})
const emit = defineEmits<{
  'ask-question': [text: string]
}>()

const questionInput = ref('')

const submitQuestion = () => {
  const trimmedQuestion = questionInput.value.trim()
  if (trimmedQuestion) {
    emit('ask-question', trimmedQuestion)
    questionInput.value = ''
  }
}

const formatDateTime = (value: string | null | undefined) => {
  if (!value)
    return ''

  return new Date(value).toLocaleString()
}
</script>

<template>
  <div class="bg-white dark:bg-gray-950 p-6 md:p-8 rounded-lg border border-gray-200 dark:border-gray-800">
    <div class="flex items-start justify-between mb-4 md:mb-6">
      <div>
        <h2 class="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
          {{ $t('advert.detail.public_questions') }}
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {{ $t('advert.detail.ask_hint') }}
        </p>
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400 md:mt-1">
        {{ $t('advert.detail.questions_count', { count: questions.length }) }}
      </p>
    </div>

    <!-- Question Input -->
    <div class="flex gap-3 mb-6">
      <input
        v-model="questionInput"
        type="text"
        :placeholder="$t('advert.detail.ask_placeholder')"
        class="flex-1 px-4 py-3 border border-gray-700 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
      >
      <UButton
        size="lg"
        class="bg-emerald-700 hover:bg-emerald-800 text-white rounded-md px-4"
        @click="submitQuestion"
      >
        →
      </UButton>
    </div>

    <!-- Empty state -->
    <div
      v-if="!questions || questions.length === 0"
      class="py-6 text-center text-gray-500 dark:text-gray-400"
    >
      {{ $t('advert.detail.no_public_questions') }}
    </div>

    <!-- Questions List -->
    <div
      class="divide-y divide-gray-200 dark:divide-gray-800"
    >
      <template
        v-for="question in questions"
        :key="question.commentId"
      >
        <div class="py-6">
          <!-- Question header -->
          <div class="flex items-start justify-between">
            <div>
              <p class="font-semibold text-gray-100">
                {{ question.author }}
              </p>
              <p class="text-xs text-gray-400 mt-1">
                {{ formatDateTime(question.createdAt) }}
              </p>
            </div>
          </div>

          <!-- Question content -->
          <div class="mt-4 ml-0 md:ml-2">
            <p class="text-gray-300 leading-relaxed">
              {{ question.content }}
            </p>
          </div>

          <!-- Answer (if any) -->
          <div
            v-if="question.answer?.trim()"
            class="mt-5"
          >
            <div class="border border-emerald-700 bg-emerald-900/10 dark:bg-emerald-900/20 rounded-md p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <p class="font-semibold text-emerald-100">
                    {{ seller.username }}
                  </p>
                  <span class="text-xs inline-block bg-emerald-800 text-emerald-100 px-2 py-1 rounded">
                    {{ $t('advert.detail.seller_badge') }}
                  </span>
                </div>
                <p
                  v-if="question.answeredAt"
                  class="text-xs text-gray-400"
                >
                  {{ formatDateTime(question.answeredAt) }}
                </p>
              </div>
              <p class="mt-3 text-gray-100">
                {{ question.answer }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
