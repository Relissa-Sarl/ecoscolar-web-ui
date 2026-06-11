import { expect, test } from '@playwright/test'

test('home page renders EcoScolar landing content', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/EcoScolar/)
  await expect(page.getByRole('link', { name: /Explorer la boutique/i })).toBeVisible()
})

test('catalog subtitle does not expose a hardcoded postal perimeter', async ({ page }) => {
  await page.goto('/shop')

  await expect(page.getByRole('heading', { name: /Explorer les annonces/i })).toBeVisible()
  await expect(page.getByText(/résultats/i).first()).toBeVisible()
  await expect(page.getByText(/périmètre indicatif postal/i)).toHaveCount(0)
})

test('cart page keeps a white background in light mode', async ({ page }) => {
  await page.goto('/cart')

  const pageShell = page.locator('.min-h-screen').first()
  await expect(pageShell).toHaveClass(/bg-white/)
  await expect(pageShell).not.toHaveClass(/bg-slate-50/)
})

test('create advert route redirects unauthenticated users instead of showing 404', async ({ page }) => {
  await page.goto('/adverts/create-advert')

  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByText(/Page introuvable/i)).toHaveCount(0)
})
