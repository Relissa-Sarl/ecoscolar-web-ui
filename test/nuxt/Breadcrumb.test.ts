import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Breadcrumb from '~/components/common/Breadcrumb.vue'

// Définition de tous les tests
describe('Breadcrumb', () => {
  // Test 1 : Vérifie que le composant affiche le contenu
  it('renders breadcrumb items', () => {
    const items = [
      { label: 'Accueil', to: '/' },
      { label: 'Produits' }
    ]

    // mount crée une instance du composant pour tester
    const wrapper = mount(Breadcrumb, {
      props: { items }
    })

    // Vérifie que le texte des items est affiché
    expect(wrapper.text()).toContain('Accueil')
    expect(wrapper.text()).toContain('Produits')
  })

  // Test 2 : Vérifie que les items avec "to" deviennent des liens
  it('renders NuxtLink for items with "to"', () => {
    const items = [
      { label: 'Accueil', to: '/' },
      { label: 'Produits', to: '/products' }
    ]

    const wrapper = mount(Breadcrumb, {
      props: { items }
    })

    // findAllComponents cherche les composants NuxtLink
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
      props: { items }
    })

    // Cherche les spans (pour les items sans lien)
    const spans = wrapper.findAll('span')
    expect(spans.length).toBeGreaterThan(0)
  })
})

