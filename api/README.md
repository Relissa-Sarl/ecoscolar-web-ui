# api/

Backend propre à Nuxt (serveur Nitro intégré). Réservé aux cas où le front
a besoin d'une route HTTP servie directement par Nuxt, plutôt que par l'API
.NET (`ecoscolar-web-api`).

Exemples de cas d'usage envisagés :

- Endpoint qui agrège ou transforme une réponse de l'API .NET avant de
  l'envoyer au navigateur.
- Endpoint qui appelle un service tiers et masque la clé d'API côté serveur.
- Webhook reçu par Nuxt (Stripe, etc.).

Vide pour le moment — sera rempli au cas par cas.

## Distinction

| Dossier | Rôle |
|---|---|
| `api/` (ici) | Backend Nuxt (routes Nitro), exécutées côté Node | 
| `app/services/` | Couche HTTP côté navigateur vers l'API .NET |
| `app/composables/useApi.ts` | Wrapper `$fetch` (baseURL, JWT, gestion 401) |
| `ecoscolar-web-api/` | Le vrai backend .NET (autre repo) |
