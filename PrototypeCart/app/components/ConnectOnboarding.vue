<script setup lang="ts">
const configs = useRuntimeConfig();
import { ref } from 'vue';
import { useAccount } from '../composables/useAccount';

const email = ref('');
const { setAccountId } = useAccount();

const handleCreateAccountAndOnboard = async (e: Event) => {
  e.preventDefault();

  try {
    // 1. Create Connect Account
    const createRes = await fetch(`${configs.public.apiBase}/api/payments/create-connect-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.value }),
    });

    if (!createRes.ok) {
      throw new Error('Failed to create account');
    }

    const accountData = await createRes.json();
    const newAccountId = accountData.accountId;
    setAccountId(newAccountId);

    // 2. Immediately start onboarding by getting account link
    const linkRes = await fetch(`${configs.public.apiBase}/api/payments/create-account-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accountId: newAccountId }),
    });

    if (!linkRes.ok) {
      throw new Error('Failed to create account link');
    }

    const linkData = await linkRes.json();
    // Redirect to Stripe onboarding
    window.location.href = linkData.url;
  } catch (error) {
    console.error('Error in account creation or onboarding:', error);
  }
};
</script>

<template>
  <div class="container">
    <form @submit="handleCreateAccountAndOnboard">
      <div class="form-group">
        <label for="email">Email for Connected account:</label>
        <input
          type="email"
          id="email"
          v-model="email"
          required
        />
      </div>
      <button class="button" type="submit">
        Create Connect Account
      </button>
    </form>
  </div>
</template>
