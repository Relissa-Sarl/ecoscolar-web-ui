import axe from 'axe-core'
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CatalogSearchBanner from '~/components/catalog/CatalogSearchBanner.vue'

const BLOCKING_IMPACTS = new Set(['critical', 'serious'])

const globalOptions = {
  mocks: {
    $t: (key: string) => key
  }
}

async function expectNoBlockingViolations(root: HTMLElement) {
  root.id = root.id || `a11y-${Math.random().toString(36).slice(2)}`
  document.body.innerHTML = ''
  document.body.appendChild(root)

  const results = await axe.run(`#${root.id}`)
  const blocking = results.violations.filter(v => BLOCKING_IMPACTS.has(v.impact ?? ''))
  expect(blocking.map(v => `[${v.impact}] ${v.id}`)).toEqual([])
}

describe('T8-6 · audit accessibilité Lighthouse S1', () => {
  it('bannière recherche (shop) sans violation critique ou sérieuse', async () => {
    const wrapper = mount(CatalogSearchBanner, {
      props: { modelValue: '', loading: false },
      global: globalOptions
    })
    await expectNoBlockingViolations(wrapper.element as HTMLElement)
  })

  it('formulaire connexion (structure S1) sans violation critique ou sérieuse', async () => {
    const wrapper = mount({
      template: `
        <form>
          <label for="login-email">Email</label>
          <input id="login-email" type="email" autocomplete="email" />
          <label for="login-password">Mot de passe</label>
          <input id="login-password" type="password" autocomplete="current-password" />
          <button type="submit">Se connecter</button>
        </form>
      `
    })
    await expectNoBlockingViolations(wrapper.element as HTMLElement)
  })

  it('formulaire inscription (structure S1) sans violation critique ou sérieuse', async () => {
    const wrapper = mount({
      template: `
        <form>
          <label for="reg-email">Email</label>
          <input id="reg-email" type="email" autocomplete="email" />
          <label for="reg-password">Mot de passe</label>
          <input id="reg-password" type="password" autocomplete="new-password" />
          <button type="submit">S'inscrire</button>
        </form>
      `
    })
    await expectNoBlockingViolations(wrapper.element as HTMLElement)
  })
})
