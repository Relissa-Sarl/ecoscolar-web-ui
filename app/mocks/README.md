# app/mocks/

Données de simulation utilisées tant que les vraies routes de l'API .NET
(`ecoscolar-web-api`) ne sont pas disponibles.

## Convention

- Un fichier `<entity>.json` par entité métier (voir
  `ecoscolar-docs/diagrams/classes/cld-entities.puml`).
- Pas de logique : que des données statiques, typées au moment de l'import
  par le composable ou service qui les consomme.

## Mocks existants

| Fichier | Entité | Consommé par |
|---|---|---|
| `advert.json` | `Advert` | `app/composables/useAdvert.ts` |
| `catalogSummaries.json` | `AdvertCatalogApiItem[]` | `app/pages/shop.vue` (fallback démo) |
| `favorites.json` | `FavoriteAdvert[]` | `app/services/favoritesService.ts` |

## À supprimer quand

Chaque mock disparaîtra dès que le service correspondant pointera sur la
vraie API .NET.
