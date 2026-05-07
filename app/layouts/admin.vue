<template>
  <div style="display: flex; min-height: 100vh;">
    <aside style="width: 250px; border-right: 1px solid #ccc; padding: 1rem;">
      <h3>[ Menu Admin ]</h3>
      <ul>
        <li>[ Tableau de bord ]</li>
        <li>[ Validation Annonces ]</li>
        <li>[ Gestion Utilisateurs ]</li>
        <li>[ Signalements ]</li>
      </ul>
      <br/>
      <button>[ Retour au site public ]</button>
    </aside>

    <main style="flex: 1; padding: 1rem;">
      <header>
        <span>[ Admin Connecté: Jean Dupont ]</span> |
        <span>[ Déconnexion ]</span>
      </header>

      <hr/>
      <div>
        <slot/>
      </div>
    </main>
  </div>
</template>
