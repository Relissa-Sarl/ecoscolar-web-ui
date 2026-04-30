<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import ConnectOnboarding from '../components/ConnectOnboarding.vue';

const route = useRoute();
// Stripe redirects back with ?accountId=... after the onboarding flow
const isSuccess = computed(() => !!route.query.accountId);
</script>

<template>
  <div class="App">
    <div class="container">
      <div class="logo">Exemple création compte Stripe Connect</div>
      
      <div v-if="isSuccess" class="success-message">
        <p>✅ COMPTE CREE, ID = {{ route.query.accountId }}</p>
      </div>

      <ConnectOnboarding v-if="!isSuccess" />
    </div>
  </div>
</template>

<style scoped>
.success-message {
  background-color: #d4edda;
  color: #155724;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #c3e6cb;
  margin-bottom: 20px;
  text-align: center;
}
.success-message p {
  color: #155724;
}
</style>