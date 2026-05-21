# app/plugins/

Plugins Nuxt — fonctions et scripts qui s'exécutent automatiquement au tout démarrage de l'application, avant l'initialisation complète du routeur et le rendu des composants.

Voir [doc officielle](https://nuxt.com/docs/guide/directory-structure/plugins).

## Convention de nommage et comportement

Tous les fichiers situés à la racine de ce dossier sont automatiquement détectés et importés par Nuxt.

- `<name>.ts` (Plugin universel) → s'exécute **des deux côtés** : d'abord sur le serveur (lors du Server-Side Rendering - SSR) pour préparer la page, puis sur le client (dans le navigateur) lors de l'hydratation. C'est le comportement par défaut. *Cas d'usage : configuration d'outils globaux (i18n, intercepteurs HTTP, initialisation d'un état partagé qui doit être identique partout).*
- `<name>.client.ts` → s'exécute uniquement côté **client** (idéal pour manipuler le `window`, le `document` ou des librairies de tracking spécifiques au navigateur).
- `<name>.server.ts` → s'exécute uniquement côté **serveur** (idéal pour des traitements préparatoires au rendu HTML initial ou pour manipuler des secrets côté serveur).

*Note : Par défaut, les plugins s'exécutent par ordre alphabétique. Si un ordre strict de dépendance est requis, préfixer le nom du fichier par un numéro (ex: `01.session.ts`, `02.analytics.ts`).*

## Plugins existants

| Fichier | Environnement | Rôle | Statut |
|---|---|---|---|
| `session.ts` | Mixte (Serveur/Client) | Restaure la session de l'utilisateur au chargement initial de l'application en exécutant de manière asynchrone `usersStore.fetchProfile()` avant la résolution des routes et l'exécution des middlewares. Évite les clignotements d'UI au F5. | Implémenté |

## À faire (roadmap équipe)

- Étoffer la gestion globale des erreurs de l'API interceptées par Nuxt.
- Ajouter d'éventuels plugins tiers si nécessaire (configurations d'outils analytiques ou packages UI additionnels).

## Référence

- Doc officielle Nuxt 4 — [`plugins` directory](https://nuxt.com/docs/guide/directory-structure/plugins)
- Domaine métier concerné : Package **Compte & Accès** pour l'initialisation du contexte utilisateur global (voir `ecoscolar-docs/diagrams/use-cases/uc-all.puml`).