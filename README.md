# 🎓 EcoScolar - Web UI

Bienvenue sur le dépôt front-end d'EcoScolar, la marketplace dédiée aux étudiants (Livres, Matériel, Cours d'appui). 
Ce projet est développé avec 
- **Nuxt 4**
- **Vue 3**
- **Tailwind CSS**
- **TypeScript**

## 🛠 Prérequis

- **Node.js** : `v22.x` 
- **Gestionnaire de paquets** : `pnpm v10.x`

## 📦 Installation et Lancement

```bash
# 1. Installer les dépendances
pnpm install

# 2. Lancer le serveur de développement
pnpm run dev
```

# 📜 Conventions de Nommage

## 1. Fichiers et Composants (Vue/Nuxt)

**Composants (app/components/)** : PascalCase et multi-mots.
- `AppHeader.vue`, `ProductCard.vue`

**Pages et Routes (app/pages/)** : kebab-case. Nuxt utilise le nom du fichier pour générer l'URL.
- `product-details.vue` (donne `/product-details`)

**Composables (app/composables/)** : camelCase en commençant toujours par `use`.
- `useCart.ts`, `useAuth.ts`

## 2. TypeScript et Variables

**Types & Interfaces (app/types/)** : PascalCase. Ne pas préfixer par un I ou un T.
- `interface Product { ... }`
- `type UserRole = ...`

**Variables et Fonctions** : camelCase. Un nom de fonction doit décrire une action.
- `const isAuthenticated = true;`
- `function fetchProducts() { ... }`

# 🤝 Git Flow & Collaboration
Approche de "Feature Branch Workflow" pour garder la branche principale toujours stable.

## 1. Les Branches Principales
- `main` : Code en production (Stable). Personne ne push directement ici.
- `develop` : Code d'intégration (Test). Toutes les features terminées sont fusionnées ici en premier.

## 2. Créer sa branche de travail
À partir de `develop`, créez une branche nommée selon le type de travail :
- `feature/nom-de-la-fonctionnalite` (ex: `feature/cart-store`)
- `fix/nom-du-bug` (ex: `fix/login-crash`)
- `refactor/nom-du-refacto` (ex: `refactor/header-design`)

## 3. Les Messages de Commit (Conventional Commits)
Commencez toujours vos commits par un des préfixes suivants :
- `feat:` : Ajout d'une nouvelle fonctionnalité (ex: `feat: ajout du bouton de langue`)
- `fix:` : Correction d'un bug (ex: `fix: correction de l'erreur 500 sur le login`)
- `chore:` : Tâches de maintenance, mises à jour de paquets (ex: `chore: fix eslint errors`)
- `docs:` : Modification du README ou de la documentation
- `style:` : Changements de design (Tailwind) sans impact sur la logique métier

## 4. Le Cycle de vie d'une tâche
```bash
git checkout develop
git pull
git checkout -b feature/ma-nouvelle-page
# ... Vous codez ...
pnpm run lint --fix # (Obligatoire avant de commit pour passer la CI !)
git add .
git commit -m "feat: création de la page d'accueil"
git push
```
Ouvrir une Pull Request (PR) sur GitHub vers la branche `develop`.

# 🐳 Déploiement avec Docker

Le projet est configuré pour être conteneurisé facilement en mode production (Nuxt standalone).

## Prérequis

Modifiez le fichier .env.exemple ou créé un fichier .env et copier-coller le code suivant

```bash
NUXT_PUBLIC_API_BASE='https://dummyjson.com'
NUXT_PUBLIC_ENABLE_JWT='false'
NGINX_PORT=3000
```
## 1. Cloner et Construire l'image

Assurez-vous d'avoir Docker installé sur votre machine. Lancez la commande suivante à la racine du projet :

```bash
docker compose build
```

## 2. Lancer le container

Tapez ensuite cette commande pour lancer le container
```bash
docker compose up -d
```

## 3. Fermer le container

Lorsque vous avez fini d'utiliser le container, tapez la commande suivante pour le fermer correctement
```bash
docker compose down
```

# 🛡️ Qualité du code
L'application est protégée par ESLint en mode strict.
Si la CI (GitHub Actions) échoue sur votre Pull Request à cause du formatage, lancez `pnpm run lint --fix` en local, commitez le résultat, et la CI passera au vert !

# 🧪 Tests

## Prérequis (tests d'intégration catalogue / shop)

API gateway Docker sur le port `8080` :

```powershell
cd ecoscolar-web-api
docker compose up -d
```

Front en dev avec la bonne base URL :

```powershell
cd ecoscolar-web-ui
$env:NUXT_PUBLIC_API_BASE = "http://localhost:8080/api"
pnpm dev --port 3000
```

## Commandes générales

```powershell
# Toute la suite Vitest (unit + nuxt)
pnpm test

# Unités seules
pnpm test:unit

# Composants / pages Nuxt (mountSuspended, etc.)
pnpm test:nuxt

# Couverture
pnpm test:coverage

# Mode watch
pnpm test:watch

# E2E Playwright (serveur dev requis sur PLAYWRIGHT_BASE_URL)
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
pnpm test:e2e
```

## Sprint T8 — tests par sous-tâche

| Tâche | Fichiers | Commande |
|-------|----------|----------|
| **T8-1** Login API | `test/unit/loginApiIntegration.test.ts` | `pnpm exec vitest run test/unit/loginApiIntegration.test.ts` |
| **T8-2** Route JWT | `test/unit/jwtProtectedRouteIntegration.test.ts` | `pnpm exec vitest run test/unit/jwtProtectedRouteIntegration.test.ts` |
| **T4-6 / T8-3** Création annonces | `test/unit/advertCreateIntegration.test.ts` | `pnpm exec vitest run test/unit/advertCreateIntegration.test.ts` |
| **T8-4** Recherche livre | `test/unit/catalogBookSearchIntegration.test.ts`, `test/nuxt/shopBookSearchIntegration.test.ts` | `pnpm exec vitest run test/unit/catalogBookSearchIntegration.test.ts test/nuxt/shopBookSearchIntegration.test.ts` |
| **T8-5** Inscription → annonce | `test/unit/registerToAdvertIntegration.test.ts` | `pnpm exec vitest run test/unit/registerToAdvertIntegration.test.ts` |
| **T8-6** Accessibilité S1 | `test/nuxt/lighthouseS1Accessibility.test.ts` | `pnpm exec vitest run test/nuxt/lighthouseS1Accessibility.test.ts` |

Lancer **tous les tests T8 front** en une fois :

```powershell
pnpm exec vitest run test/unit/loginApiIntegration.test.ts test/unit/jwtProtectedRouteIntegration.test.ts test/unit/advertCreateIntegration.test.ts test/unit/registerToAdvertIntegration.test.ts test/unit/catalogBookSearchIntegration.test.ts test/nuxt/shopBookSearchIntegration.test.ts test/nuxt/lighthouseS1Accessibility.test.ts
```
