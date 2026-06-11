import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

const appDir = fileURLToPath(new URL('./app', import.meta.url))
const alias = {
  '@': appDir,
  '~': appDir
}

export default defineConfig({
  resolve: { alias },
  test: {
    projects: [
      {
        resolve: { alias },
        test: {
          name: 'unit',
          include: ['test/unit/**/*.{test,spec}.ts'],
          environment: 'node'
        }
      },
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['test/nuxt/**/*.{test,spec}.ts'],
          environment: 'nuxt',
          environmentOptions: {
            nuxt: {
              rootDir: fileURLToPath(new URL('.', import.meta.url)),
              domEnvironment: 'happy-dom'
            }
          }
        }
      })
    ],
    coverage: {
      enabled: false,
      provider: 'v8',
      thresholds: {
        statements: 80,
        functions: 80,
        branches: 80,
        lines: 80
      },
      exclude: [
        'dist/**',
        '.output/**',
        'node_modules/**',
        '**/*.config.{ts,js}',
        'app/assets/**',
        'app/pages/**',
        'app/mocks/**',
        'app/**/**.vue',
        'locales/**'
      ]
    }
  }
})
