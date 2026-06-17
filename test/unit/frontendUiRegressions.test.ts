import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const projectRoot = process.cwd()

const readProjectFile = (relativePath: string) =>
  readFileSync(join(projectRoot, relativePath), 'utf8')

describe('frontend UI regressions', () => {
  it('keeps the catalog subtitle free of hardcoded postal codes', () => {
    const shopPage = readProjectFile('app/pages/shop.vue')

    expect(shopPage).toContain('$t(\'catalog.list.subtitle_near\', { count: totalItems })')
  })

  it('keeps catalog subtitle translations focused on the result count', () => {
    const localePaths = ['locales/fr.json', 'locales/de.json', 'locales/it.json']

    for (const localePath of localePaths) {
      const locale = JSON.parse(readProjectFile(localePath))
      const subtitle = locale.catalog.list.subtitle_near

      expect(subtitle).toContain('{count}')
      expect(subtitle).not.toContain('{zip}')
    }
  })

  it('uses a white page background for the cart in light mode', () => {
    const cartPage = readProjectFile('app/pages/cart.vue')
    const rootClassLine = cartPage
      .split('\n')
      .find(line => line.includes('min-h-screen') && line.includes('dark:bg-slate-950'))

    expect(rootClassLine).toContain('bg-white')
    expect(rootClassLine).not.toContain('bg-slate-50')
  })
})
