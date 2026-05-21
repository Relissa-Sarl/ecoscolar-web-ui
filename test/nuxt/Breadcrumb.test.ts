import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Breadcrumb from '~/components/common/Breadcrumb.vue'

const globalOptions = {
  mocks: {
    $t: (key: string) => key
  },
  stubs: {
    NuxtLink: true
  }
}

// Test simple du composant Breadcrumb existant
describe('Breadcrumb', () => {
  // Test 1 : Vérifie que le composant s'affiche
  it('renders breadcrumb component', () => {
    const items = [
      { label: 'Accueil', to: '/' },
      { label: 'Produits' }
    ]

    const wrapper = mount(Breadcrumb, {
      props: { items },
      global: globalOptions
    })

    // Vérifie que le composant existe et que le texte 'Produits' est présent
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Produits')
  })

  // Test 2 : Vérifie que les items avec "to" deviennent des liens
  it('renders NuxtLink for items with "to"', () => {
    const items = [
      { label: 'Accueil', to: '/' },
      { label: 'Produits', to: '/products' }
    ]

    const wrapper = mount(Breadcrumb, {
      props: { items },
      global: globalOptions
    })

    // `findAllComponents` cherche les composants NuxtLink
    const links = wrapper.findAllComponents({ name: 'NuxtLink' })
    expect(links).toHaveLength(2)
  })

  // Test 3 : Vérifie que les items sans "to" ne sont pas des liens
  it('renders text span for items without "to"', () => {
    const items = [
      { label: 'Accueil', to: '/' },
      { label: 'Produits' } // Pas de "to" = pas de lien
    ]

    const wrapper = mount(Breadcrumb, {
      props: { items },
      global: globalOptions
    })

    // Cherche les spans (pour les items sans lien)
    const spans = wrapper.findAll('span')
    expect(spans.length).toBeGreaterThan(0)
  })
})
