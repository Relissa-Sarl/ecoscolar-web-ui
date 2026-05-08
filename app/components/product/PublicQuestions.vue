<script setup lang="ts">
import { ref } from 'vue'
import type { Seller, Question, Answer } from '@/types/product'

interface Props {
  seller: Seller
  questions?: Question[]
  answers?: Answer[]
}

const props = withDefaults(defineProps<Props>(), {
  questions: () => [],
  answers: () => []
})
const emit = defineEmits<{
  'ask-question': [text: string]
}>()

const questionInput = ref('')

const submitQuestion = () => {
  if (questionInput.value.trim()) {
    emit('ask-question', questionInput.value)
    questionInput.value = ''
  }
}
</script>

<template>
  <div class="bg-white dark:bg-gray-950 p-8 rounded-lg border border-gray-200 dark:border-gray-800">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">Public Questions</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400">{{ questions.length }} Questions asked</p>
    </div>

    <!-- Question Input -->
    <div class="flex gap-4 mb-8">
      <input
        v-model="questionInput"
        type="text"
        placeholder="Ask the seller a question..."
        class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
      />
      <UButton size="lg" class="bg-green-700 hover:bg-green-800" @click="submitQuestion">
        →
      </UButton>
    </div>

    <!-- Questions List -->
    <div class="space-y-6">
      <template v-for="question in questions" :key="question.id">
        <!-- Question -->
        <div class="border-b border-gray-200 dark:border-gray-800 pb-6">
          <div class="flex items-start gap-3 mb-3">
            <UAvatar
              :src="question.avatar"
              :alt="question.asker"
              size="sm"
            />
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ question.asker }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ question.timestamp }}</p>
            </div>
          </div>
          <p class="text-gray-700 dark:text-gray-300 ml-12 mb-4">
            {{ question.content }}
          </p>
        </div>

        <!-- Answer -->
        <div v-if="answers.find(a => a.questionId === question.id)" class="ml-8 mb-6">
          <template v-for="answer in answers.filter(a => a.questionId === question.id)" :key="answer.id">
            <div class="flex items-start gap-3 mb-3">
              <UAvatar
                :src="answer.answerer === seller.username ? seller.avatar : answer.avatar"
                :alt="answer.answerer"
                size="sm"
              />
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ answer.answerer }} <span v-if="answer.isSeller" class="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded ml-2">SELLER</span></p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ answer.timestamp }}</p>
              </div>
            </div>
            <p class="text-gray-700 dark:text-gray-300 ml-12">
              {{ answer.content }}
            </p>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>
