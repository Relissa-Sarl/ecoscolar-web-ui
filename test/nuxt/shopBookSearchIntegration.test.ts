import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CatalogSearchBanner from '~/components/catalog/CatalogSearchBanner.vue'

const globalOptions = {
  mocks: {
    $t: (key: string) => key
  }
}

describe('T8-4 · intégration UI recherche livre (CatalogSearchBanner)', () => {
  it('émet search quand l’utilisateur clique Rechercher', async () => {
    const wrapper = mount(CatalogSearchBanner, {
      props: { modelValue: '978-3-16-148410-0', loading: false },
      global: globalOptions
    })

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('search')).toHaveLength(1)
  })

  it('émet search quand l’utilisateur appuie sur Entrée', async () => {
    const wrapper = mount(CatalogSearchBanner, {
      props: { modelValue: 'Exemple annonce 3', loading: false },
      global: globalOptions
    })

    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('search')).toHaveLength(1)
  })
})
