# app/services/

Couche **service HTTP** vers l'API .NET (`ecoscolar-web-api`).

## Convention

Ce dossier **n'est pas auto-importé** par Nuxt (volontairement). Pour utiliser un service, importer explicitement :

```ts
import { getDummyjsonProducts } from '~/services/dummyjsonProductService'
```

## Pourquoi un dossier `services/` plutôt que `composables/` ou `utils/` ?

| Dossier | Rôle | Auto-import |
|---|---|---|
| `app/composables/` | Logique réactive (`ref`, `computed`, hooks Nuxt comme `useAsyncData`) | ✅ |
| `app/utils/` | Fonctions pures sans effet de bord ni dépendance Nuxt | ✅ |
| `app/services/` | **Appels HTTP métier** vers l'API .NET, organisés par ressource | ❌ (intentionnel) |

L'auto-import est désactivé ici pour :

- Garder une **séparation explicite** entre la couche réseau et le reste du code.
- Éviter les bugs d'import implicite (cf. commit `e3ba0c1` où un fichier de templates avait été auto-importé par erreur).

## Convention de nommage

Un service par ressource métier (entité du domaine — voir `ecoscolar-docs/diagrams/classes/cld-entities.puml`) :

- `advertService.ts` — CRUD sur les annonces (`Advert`, `Book`, `PhysicalItem`, `Service`)
- `userService.ts` — Profil utilisateur (`User`)
- `transactionService.ts` — Achats / réservations (`Transaction`)
- `disputeService.ts` — Litiges (`Dispute`)
- `flagService.ts` — Signalements (`Flag`)
- …

Tout service doit utiliser le wrapper `useApi` (`app/composables/useApi.ts`) pour profiter de la `baseURL`, du JWT et de la redirection 401 unifiée.

## Services existants

| Fichier | API cible | Statut |
|---|---|---|
| `dummyjsonProductService.ts` | API publique DummyJSON (test / démo) | Exemple — à remplacer par les services réels |

## À ne pas confondre

| Dossier | Rôle |
|---|---|
| `app/services/` (ici) | Couche HTTP **côté navigateur** vers l'API .NET |
| `api/` (racine) | Backend Nuxt (Nitro) — routes serveur écrites en TS, exécutées côté Node |
| `ecoscolar-web-api/` | Le vrai backend .NET (autre repo) |
