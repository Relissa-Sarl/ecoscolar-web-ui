<script setup lang="ts">
import axios from 'axios'

const products = [
  { id: 1, img: '/path/to/book1.jpg', name: 'Livre de maths', price: 25.50 },
  { id: 2, img: '/path/to/book2.jpg', name: 'Cours de maths', price: 15.00 }
]

const url = ""

const gotoLink = (link: string) => {
  window.location.href = link
}

const fetchStripe = async (id: number) => {
try {
  // Envoi de la requête
  const response = await axios.post("http://localhost:5173/api/payments/checkout", {productId: id, productPrice: products.find(p => p.id === id)?.price}, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  console.log(response.status)
  gotoLink(response.data.url)

  // Renvoi des données en format JSON
  return response.data
}
catch (error) {
    throw new Error(`Erreur HTTP : ${(error as any).response.status}`)
  }
}
</script>

<template>
  <div class="list-container">
    <button @click="$router.push('/home')" class="checkout-btn">Créer utilisateur Stripe</button>
    <h2>LIste des articles</h2>
      <ul class="item-list">
        <li v-for="item in products" :key="item.id" class="item">
          <div class="item-img">
            <img :src="item.img" alt="Image" width="100" />
          </div>
          <div class="item-details">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-price">{{ item.price.toFixed(2) }} CHF</span>
            
          </div>

          <div class="item-actions">
            <button class="add-btn" @click="fetchStripe(item.id)">Passer au paiement</button>
          </div>
        </li>
      </ul>

  </div>
</template>

<style scoped>
.list-container {
  border: 1px solid #e2e8f0;
  padding: 24px;
  border-radius: 12px;
  max-width: 450px;
  margin: 20px auto;
  background-color: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  font-family: sans-serif;
}
.item-list {
  list-style-type: none;
  padding: 0;
}
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #dbdbdb;
}
.item-details {
  display: flex;
  flex-direction: column;
}
.item-name {
  font-weight: 600;
  color: #334155;
}
.item-price {
  margin-top: 5px;
  color: #000000;
  
}
.item-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.item-summary {
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1em;
}

.item-in-cart{
  color: red;
}
.cart-btn {
  background-color: #106db9;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 6px;
  font-weight: bold;
  transition: background-color 0.2s;
}

.add-btn {
  background-color: #10b981;
  color: white;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 6px;
  font-size: 0.85em;
  transition: background-color 0.2s;
}
.add-btn:hover {
  background-color: #059669;
}
</style>