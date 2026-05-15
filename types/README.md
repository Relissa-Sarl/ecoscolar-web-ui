# types/ (racine — placeholder historique)

Ce dossier était initialement prévu pour héberger les interfaces TypeScript du domaine.

**Dans la configuration actuelle (Nuxt 4 avec `srcDir: 'app'`), les types métier vivent dans `app/types/`** pour bénéficier des chemins `@/types/...` et de l'arborescence Nuxt par défaut. Le vrai code se trouve donc dans :

> `app/types/`

Ce dossier reste présent pour ne rien casser dans la documentation historique. Toute nouvelle interface métier (Advert, User, Transaction, etc.) doit être créée dans `app/types/`.

## Conventions de nommage

Les types côté front doivent **refléter le diagramme de classes officiel** (`ecoscolar-docs/diagrams/classes/cld-entities.puml`).

- `Advert` (entité métier — équivalent du DTO `AdvertReadDto` côté API .NET)
- `User`, `Transaction`, `Review`, `Dispute`, etc.

Éviter les noms génériques type `Product` qui ne correspondent à aucune entité du domaine.
