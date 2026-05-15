# stores/ (racine — placeholder historique)

Ce dossier était initialement prévu pour héberger l'état global Pinia.

**À partir de Nuxt 4, Pinia auto-importe les stores depuis `app/stores/`** (et non depuis `stores/` à la racine du projet). Le vrai code se trouve donc dans :

> `app/stores/`

Ce dossier reste présent pour ne rien casser dans la documentation historique et les éventuels liens internes. Tout nouveau store Pinia doit être créé dans `app/stores/`.

## Référence

- Doc officielle Nuxt 4 — [`stores` directory](https://nuxt.com/docs/guide/directory-structure/stores)
- Domaine métier concerné : voir `ecoscolar-docs/diagrams/use-cases/uc-all.puml` (4 packages : Compte & Accès, Annonces, Transactions & Livraison, Administration & Support)
