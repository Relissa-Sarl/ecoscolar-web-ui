<script setup lang="ts">
import { computed } from 'vue';
import { useAccount } from '../composables/useAccount';
import { useAccountStatus } from '../composables/useAccountStatus';

const props = defineProps({
  onStartOnboarding: {
    type: Function,
    required: true,
  },
});

const { setAccountId } = useAccount();
const { accountStatus, needsOnboarding } = useAccountStatus();

const statusColor = computed(() => accountStatus.value?.chargesEnabled ? 'green' : 'orange');
const statusText = computed(() => accountStatus.value?.chargesEnabled ? 'Active' : 'Pending');

const logout = () => {
  setAccountId(null);
};
</script>

<template>
  <div v-if="accountStatus" class="account-status">
    <div class="status-header">
      <h3>
        Account Status:
        <span :style="{ color: statusColor }">{{ statusText }}</span>
      </h3>
    </div>

    <div class="status-details">
      <div class="status-item">
        <span>Account ID:</span>
        <span>{{ accountStatus.id }}</span>
      </div>
      <div class="status-item">
        <span>Payouts enabled:</span>
        <span>{{ accountStatus.payoutsEnabled ? 'Yes' : 'No' }}</span>
      </div>
      <div class="status-item">
        <span>Charges enabled:</span>
        <span>{{ accountStatus.chargesEnabled ? 'Yes' : 'No' }}</span>
      </div>
      <div class="status-item">
        <span>Details submitted:</span>
        <span>{{ accountStatus.detailsSubmitted ? 'Yes' : 'No' }}</span>
      </div>
    </div>

    <button
      v-if="needsOnboarding"
      @click="props.onStartOnboarding"
      class="button"
      style="margin-bottom: 10px;"
    >
      Onboard to collect payments
    </button>
    
    <button
      class="button"
      :disabled="!accountStatus"
      @click="logout"
    >
      Log out
    </button>
  </div>
</template>
