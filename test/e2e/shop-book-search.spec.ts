import { expect, test } from '@playwright/test'
import {
  MOCK_BOOK_WITH_ISBN,
  gotoShopAndWaitForCatalog,
  listingTitles,
  searchCatalog
} from './helpers/catalogPage'

/**
 * T8-4 · intégration front — recherche livre UC-06 sur /shop.
 * Nécessite front + API lancés : PLAYWRIGHT_BASE_URL=http://localhost:3000
 */
test.describe('T8-4 · recherche livre (/shop)', () => {
  test.skip(
    !process.env.PLAYWRIGHT_BASE_URL,
    'Définir PLAYWRIGHT_BASE_URL (ex. http://localhost:3000)'
  )

  test.beforeEach(async ({ page }) => {
    await gotoShopAndWaitForCatalog(page)
  })

  test('recherche par ISBN affiche le livre correspondant', async ({ page }) => {
    await searchCatalog(page, MOCK_BOOK_WITH_ISBN.isbn)

    const cards = listingTitles(page)
    await expect(cards).toHaveCount(1)
    await expect(cards.first()).toHaveText(MOCK_BOOK_WITH_ISBN.title)
  })

  test('recherche par mot-clé livre exclut les autres annonces', async ({ page }) => {
    await searchCatalog(page, MOCK_BOOK_WITH_ISBN.title)

    const cards = listingTitles(page)
    await expect(cards).toHaveCount(1)
    await expect(cards.first()).toHaveText(MOCK_BOOK_WITH_ISBN.title)
    await expect(cards.filter({ hasText: 'Calculatrice' })).toHaveCount(0)
  })

  test('recherche sans résultat affiche l’état vide', async ({ page }) => {
    await searchCatalog(page, 'zzzz-isbn-inexistant-999')

    await expect(page.getByText('Aucun résultat ne correspond à vos critères.')).toBeVisible()
    await expect(listingTitles(page)).toHaveCount(0)
  })
})
