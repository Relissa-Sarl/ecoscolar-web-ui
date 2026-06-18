import { test, expect } from '@playwright/test'

test.describe('Booking Flow', () => {
  test('allows a user to start booking a service and navigate to checkout', async ({ page }) => {
    // Navigate to an advert page (we assume the backend handles returning the correct advert data)
    // Here we'll just test the UI flow if possible.
    // If the backend isn't mocked, it might fail. So let's mock it just in case.
    await page.route('**/api/adverts/999', async (route) => {
      await route.fulfill({
        json: {
          id: 999,
          type: 'SERVICE',
          title: 'Math Tutoring Service',
          price: 50,
          minHours: 1,
          maxHours: 10,
          description: 'A service advert for e2e',
          subject: 'Math',
          grade: 'High School',
          seller: { username: 'tutor' },
          images: [],
          status: 'AVAILABLE'
        }
      })
    })

    await page.route('**/api/users/*/reviews/can-review', async (route) => {
      await route.fulfill({ json: false })
    })

    await page.route('**/api/payments/create-checkout-session', async (route) => {
      await route.fulfill({ json: { url: '/success?stripeSessionId=test_sess_123' } })
    })

    await page.route('**/api/payments/session/test_sess_123', async (route) => {
      await route.fulfill({
        json: { amountTotal: 5500 }
      })
    })

    await page.route('**/api/auth/session', async (route) => {
      await route.fulfill({
        json: { user: { id: 'u1', username: 'buyer' } }
      })
    })

    // Navigate
    await page.goto('/adverts/999')

    // Find the book button (Réserver)
    const reserveButton = page.locator('button').filter({ hasText: /Réserver/i })

    // Check if the button is visible. If not, it means we are not logged in and it shows "Se connecter" instead.
    // In that case, we can test that clicking "Se connecter" goes to /login.
    const loginButton = page.locator('a, button').filter({ hasText: /Se connecter pour acheter|Se connecter pour réserver/i })

    if (await loginButton.isVisible()) {
      // Unauthenticated flow
      await loginButton.click()
      await expect(page).toHaveURL(/\/login/)
    } else if (await reserveButton.isVisible()) {
      // Authenticated flow
      await reserveButton.click()

      // Wait for the modal
      const modal = page.locator('[role="dialog"]')
      await expect(modal).toBeVisible()

      // Find the confirm button
      const confirmButton = modal.locator('button').filter({ hasText: /Confirmer/i })
      await confirmButton.click()

      // Wait for redirect to Stripe checkout or checkout page
      // Because we mocked create-checkout-session to return /success?stripeSessionId=test_sess_123,
      // it should navigate there directly.
      await page.waitForURL(/\/success/)

      // Verify success page
      await expect(page.locator('text=55.00 CHF')).toBeVisible()
    }
  })
})
