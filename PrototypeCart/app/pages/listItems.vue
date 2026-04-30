<script setup lang="ts">
const configs = useRuntimeConfig();

import axios from 'axios'

const products = [
  { id: 1, name: 'Livre de maths', price: 25.50 },
  { id: 2, name: 'Cours de maths', price: 15.00 }
]

const handlePayment = async (product: any) => {
  try {
    const { data } = await axios.post(`${configs.public.apiBase}/api/payments/checkout`, {
      productId: product.id,
      productPrice: product.price
    })
    window.location.href = data.url
  } catch (error) {
    console.error("Erreur de paiement", error)
  }
}
</script>

<template>
  <div class="shop-wrapper">
    <!-- Header minimaliste -->
    <nav class="nav">
      <button @click="$router.push('/home')" class="account-link">
        Créer compte stripe
      </button>
    </nav>

    <main>
      <h2 class="title">Articles</h2>

      <div class="product-list">
        <div v-for="item in products" :key="item.id" class="product-row">
          <div class="info">
            <span class="name">{{ item.name }}</span>
            <span class="price">{{ item.price.toFixed(2) }} CHF</span>
          </div>

          <button class="pay-btn" @click="handlePayment(item)">
            Payer
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Conteneur principal - Fond blanc pur */
.shop-wrapper {
  max-width: 500px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: #ffffff;
  font-family: -apple-system, system-ui, sans-serif;
  color: #111;
}

/* Navigation / Mon Compte */
.nav {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 60px;
}

.account-link {
  background: none;
  border: none;
  color: #666;
  font-size: 0.9rem;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
}

.account-link:hover {
  color: #000;
}

/* Titre */
.title {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 30px;
  letter-spacing: -0.01em;
}

/* Liste des produits */
.product-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0; /* Ligne très discrète */
}

.info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.name {
  font-weight: 400;
  font-size: 1rem;
}

.price {
  color: #888;
  font-size: 0.9rem;
}

/* Bouton Payer */
.pay-btn {
  background: #000;
  color: #fff;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s;
}

.pay-btn:hover {
  opacity: 0.7;
}
</style>