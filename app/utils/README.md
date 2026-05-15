# app/utils/

Fonctions utilitaires pures, **auto-importées** par Nuxt (pas besoin de `import` explicite).

Voir [doc officielle](https://nuxt.com/docs/guide/directory-structure/utils).

## Convention

- Fichiers `.ts` regroupant des fonctions pures (pas de réactivité, pas d'appel à des composables Nuxt).
- Pour de la logique réactive ou stateful → préférer `app/composables/`.
- Pour des appels HTTP → préférer `app/services/`.

## Exemples de futurs utilitaires (roadmap)

- `formatPrice.ts` — formatage des montants (devise CHF, EUR…) selon la locale active
- `formatDate.ts` — formatage des dates selon la locale
- `isbn.ts` — validation / normalisation d'un ISBN (entité `Book` du domaine — voir `ecoscolar-docs/diagrams/classes/cld-entities.puml`)
