import { expect, type Page } from '@playwright/test'

/** Données mock API (FakeAdvertSearchService, défaut en dev). */
export const MOCK_BOOK_WITH_ISBN = {
  title: 'Exemple annonce 3',
  isbn: '978-3-16-148410-0'
} as const

export async function gotoShopAndWaitForCatalog(page: Page) {
  await page.goto('/shop')
  await expect(page.getByText('Chargement des annonces')).toBeHidden({ timeout: 20_000 })

  const apiError = page.getByText(/catalogue ne s.?est pas synchronis/i)
  if (await apiError.isVisible()) {
    throw new Error(
      'L’API catalogue est injoignable. Vérifiez NUXT_PUBLIC_API_BASE (ex. http://localhost:8080/api).'
    )
  }

  await expect(
    page.getByText('Catalogue à jour depuis le dernier chargement réussi.')
  ).toBeVisible({ timeout: 5_000 })
}

export async function searchCatalog(page: Page, query: string) {
  await page.goto(`/shop?q=${encodeURIComponent(query)}`)
  await expect(page.getByText('Chargement des annonces')).toBeHidden({ timeout: 20_000 })
}

export function listingTitles(page: Page) {
  return page.locator('article h3 a')
}
