import { ref } from 'vue'
import type { BookCategory, SchoolGrade, Subject } from '@/types/advertDetail'
import { getAdvertDetailsService } from '~/services/advertDetailsService'

const bookCategories = ref<BookCategory[]>([])
const schoolGrades = ref<SchoolGrade[]>([])
const subjects = ref<Subject[]>([])
const isLoading = ref(false)
const loadError = ref(false)

let inflight: Promise<void> | null = null

export function useCatalogReferenceData() {
  async function load(): Promise<void> {
    if (bookCategories.value.length > 0)
      return

    if (inflight)
      return inflight

    const detailsService = getAdvertDetailsService()
    isLoading.value = true
    loadError.value = false

    inflight = (async () => {
      try {
        const [books, grades, subs] = await Promise.all([
          detailsService.getBookCategories(),
          detailsService.getSchoolGrades(),
          detailsService.getSubjects()
        ])
        bookCategories.value = books
        schoolGrades.value = grades
        subjects.value = subs
      } catch {
        loadError.value = true
      } finally {
        isLoading.value = false
        inflight = null
      }
    })()

    return inflight
  }

  return {
    bookCategories,
    schoolGrades,
    subjects,
    isLoading,
    loadError,
    load
  }
}
