# Tests

Tous les tests sont centralisés dans ce dossier. Trois catégories :

## 📋 Structure

```
test/
├── unit/          # Tests unitaires (logique, utilitaires, services)
├── nuxt/          # Tests des composants Nuxt/Vue
└── e2e/           # Tests End-to-End (Playwright)
```

---

## 🧪 Tests Unitaires (`unit/`)

Environnement : **Node**

Tests de logique pure, utilitaires, services.

**Exemple :**
```bash
pnpm vitest run --project unit
```

**Pattern :**
```ts
// unit/services/productService.test.ts
import { describe, it, expect } from 'vitest'
import { someFunction } from '~/services/productService'

describe('productService', () => {
  it('should work', () => {
    expect(someFunction()).toBe(expected)
  })
})
```

---

## 🎨 Tests Nuxt (`nuxt/`)

Environnement : **Nuxt** (avec DOM)

Tests de composants Vue, hooks, pages.

**Exemple :**
```bash
pnpm vitest run --project nuxt
```

**Pattern :**
```ts
// nuxt/components/Button.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '~/components/Button.vue'

describe('Button', () => {
  it('renders', () => {
    const wrapper = mount(Button)
    expect(wrapper.exists()).toBe(true)
  })
})
```

---

## 🌐 Tests E2E (`e2e/`)

Outil : **Playwright**

Tests d'intégration navigateur contre une instance **déjà déployée** (NAS, SSH, staging).

### Instance distante (recommandé pour T8-4)

```bash
# PowerShell — remplacer par l'URL du front Nuxt sur le serveur
$env:PLAYWRIGHT_BASE_URL = "http://100.x.x.x:3000"
pnpm test:e2e:remote
```

Le front distant doit avoir une API catalogue joignable (`NUXT_PUBLIC_API_BASE` côté serveur).
Par défaut l'API utilise le mock `FakeAdvertSearchService` (livre « Exemple annonce 3 », ISBN `978-3-16-148410-0`).

### Local (Nuxt auto-démarré par @nuxt/test-utils)

```bash
pnpm playwright test test/e2e/example.spec.ts
```

**Pattern :**
```ts
// e2e/homepage.spec.ts
import { expect, test } from '@nuxt/test-utils/playwright'

test('homepage loads', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  await expect(page).toHaveTitle(/EcoScolar/)
})
```

---

## 🚀 Commandes rapides

```bash
# Tous les tests
pnpm test

# Unitaires uniquement
pnpm vitest run --project unit

# Nuxt uniquement
pnpm vitest run --project nuxt

# E2E uniquement
pnpm playwright test

# Watch mode (développement)
pnpm vitest --project nuxt --watch
```

---

## 📐 Nomenclature

- Tests unitaires/Nuxt : `*.test.ts` ou `*.spec.ts`
- Tests E2E : `*.spec.ts`

Exemple :
- ✅ `productService.test.ts`
- ✅ `Button.spec.ts`
- ✅ `homepage.spec.ts`

---

