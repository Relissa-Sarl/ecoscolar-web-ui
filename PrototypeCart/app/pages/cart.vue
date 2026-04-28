<script setup lang="ts">
import { ref, computed } from 'vue'

const { cartItems, removeFromCart } = useCart()


const cartTotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.price, 0)
})

const removeItem = (id: number) => {
  removeFromCart(id)
}

const togoLink = () => {
  window.location.href = 'https://checkout.stripe.com/c/pay/cs_test_a1O026F5bxezIEPhSOQpYiPj0OyXjq9ScdaCqhpMlg3OaAeiPuWUMUDR63#fidnandhYHdWcXxpYCc%2FJ2FgY2RwaXEnKSdicGRmZGhqaWBTZHdsZGtxJz8nZmprcXdqaScpJ2R1bE5gfCc%2FJ3VuWnFgdnFaMDRRVGtyUk9iRn1nS1JWZFF%2FTWQ8SWpORF1pYUNLc2psSlcyd1ZIcWRnNnB2S31jU1VLTnxvYm1VZGl2MkAzXHJNR2I1bGtMXDJwQzJidzRRb3FobkpUY2A1NVFSVVRSX1xoJyknY3dqaFZgd3Ngdyc%2FcXdwYCknZ2RmbmJ3anBrYUZqaWp3Jz8nJmNjY2NjYycpJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl'
}


</script>

<template>
   <header>
    <button @click="$router.push('/listItems')" class="back-btn">Retour</button>
  </header>
  <div class="cart-container">
    <h2>Mon Panier</h2>
    
    <div v-if="cartItems.length === 0" class="empty-cart">
      Votre panier est vide.
    </div>
    
    <div v-else>
      <ul class="cart-list">
        <li v-for="item in cartItems" :key="item.id" class="cart-item">
          <div class="item-details">
            <span class="item-name">{{ item.name }}</span>
            
          </div>
          
          <div class="item-actions">
            <span class="item-price">{{ item.price.toFixed(2) }} CHF</span>
            <button @click="removeItem(item.id)" class="remove-btn">Supprimer</button>
          </div>
        </li>
      </ul>
      
      <div class="cart-summary">
        <strong>Total : {{ cartTotal.toFixed(2) }} CHF</strong>
        <button class="checkout-btn" @click="togoLink">Passer la commande</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-container {
  border: 1px solid #e2e8f0;
  padding: 24px;
  border-radius: 12px;
  max-width: 450px;
  margin: 20px auto;
  background-color: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  font-family: sans-serif;
}
.cart-list {
  list-style-type: none;
  padding: 0;
}
.cart-item {
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
  font-weight: 600;
  color: #000000;
  
}
.item-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.cart-summary {
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1em;
}
.checkout-btn {
  background-color: #10b981;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 6px;
  font-weight: bold;
  transition: background-color 0.2s;
}
.checkout-btn:hover {
  background-color: #059669;
}

.back-btn {
  background-color: #106db9;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 6px;
  font-weight: bold;
  transition: background-color 0.2s;
}

.remove-btn {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 6px;
  font-size: 0.85em;
  transition: background-color 0.2s;
}
.remove-btn:hover {
  background-color: #dc2626;
}
</style>