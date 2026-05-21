import { fileURLToPath } from 'node:url'
import { defineConfig, devices } from '@playwright/test'
import type { ConfigOptions } from '@nuxt/test-utils/playwright'

const remoteBaseUrl = process.env.PLAYWRIGHT_BASE_URL?.replace(/\/$/, '')

export default defineConfig<ConfigOptions>({
  testDir: './test/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  projects: remoteBaseUrl
    ? [
        {
          name: 'remote-chromium',
          testMatch: /shop-book-search\.spec\.ts/,
          use: {
            ...devices['Desktop Chrome'],
            baseURL: remoteBaseUrl,
            ignoreHTTPSErrors: true,
            trace: 'on-first-retry'
          }
        }
      ]
    : [
        {
          name: 'chromium',
          testIgnore: /shop-book-search\.spec\.ts/,
          use: {
            ...devices['Desktop Chrome'],
            trace: 'on-first-retry',
            nuxt: {
              rootDir: fileURLToPath(new URL('.', import.meta.url))
            }
          }
        }
      ]
})
