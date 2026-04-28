<script setup lang="ts">
import { ref, computed } from 'vue'
import successImg from '@/assets/error-43.png'

</script>

<template>
  <div class="success-container">
    <h1>Le paiement a été refusé !</h1>
    <img :src="successImg" alt="Success" class="success-image" />
    <p>Veuillez réessayer votre paiement ou utiliser un autre moyen de paiement.</p>
    <button @click="$router.push('/cart')" class="checkout-btn">Retour au paiement</button>
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