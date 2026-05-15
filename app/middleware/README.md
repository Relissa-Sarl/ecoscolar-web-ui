# app/middleware/

Route middleware Nuxt — fonctions qui s'exécutent avant la navigation vers une page.

Voir [doc officielle](https://nuxt.com/docs/guide/directory-structure/middleware).

## Convention de nommage

- `<name>.global.ts` → middleware **global** (exécuté avant chaque navigation)
- `<name>.ts` → middleware **nommé** (à activer via `definePageMeta({ middleware: ['<name>'] })`)

## Middleware existants

| Fichier | Type | Rôle | Statut |
|---|---|---|---|
| `admin.ts` | nommé | Protège les pages `/admin/*` (auth + rôle admin) | Stub — TODO réel après mise en place de l'auth store |

## À faire (roadmap équipe)

- `auth.ts` (nommé) : redirige vers `/login` si non authentifié
- `guest.ts` (nommé) : redirige les utilisateurs déjà connectés hors des pages `/login`, `/register`
- Adapter `admin.ts` une fois l'auth store implémenté (voir `app/composables/useApi.ts` et le TODO JWT)
