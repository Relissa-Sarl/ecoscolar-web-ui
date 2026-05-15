# api/ (racine — placeholder historique)

Ce dossier était initialement prévu pour héberger la couche d'appels HTTP vers l'API .NET (`ecoscolar-web-api`).

**Dans la configuration actuelle, cette couche vit dans `app/services/`** (services Nuxt non auto-importés volontairement, pour conserver une séparation explicite entre logique réseau et logique réactive).

> `app/services/` — services HTTP métier vers l'API .NET
> `app/composables/useApi.ts` — wrapper `$fetch` (baseURL, JWT, gestion 401)

Ce dossier reste présent pour ne rien casser dans la documentation historique. Aucun nouveau fichier ne doit être créé ici.

## À ne pas confondre

| Dossier | Rôle |
|---|---|
| `api/` (racine) | Placeholder historique, **vide** |
| `app/services/` | Services HTTP métier côté front (auteur de la requête : front) |
| `server/api/` | Routes serveur Nuxt (auteur de la requête : navigateur, exécuté côté Node par Nuxt) — n'existe pas encore |
| `ecoscolar-web-api/` | Le vrai backend .NET (autre repo / autre projet) |
