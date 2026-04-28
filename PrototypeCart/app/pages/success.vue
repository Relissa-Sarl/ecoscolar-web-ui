<script setup lang="ts">
import { ref, computed } from 'vue'
import successImg from '@/assets/success-24.png'

</script>

<template>
  <div class="success-container">
    <h1>Le paiement a été effectué avec succès !</h1>
    <img :src="successImg" alt="Success" class="success-image" />
    <p>Merci pour votre achat. Votre commande est en cours de traitement.</p>
    <button @click="$router.push('/cart')" class="checkout-btn">Retour à l'accueil</button>
  </div>
</template>

<style scoped>
.success-container {
  border: 1px solid #e2e8f0;
  padding: 24px;
  border-radius: 12px;
  max-width: 450px;
  margin: 20px auto;
  background-color: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  font-family: sans-serif;
}

.success-image {
  width: 100px;
  height: 100px;
  margin: 20px auto;
  display: block;
}

</style>