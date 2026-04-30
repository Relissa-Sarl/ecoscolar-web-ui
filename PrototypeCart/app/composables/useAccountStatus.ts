import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { useAccount } from './useAccount';

export const useAccountStatus = () => {
  const accountStatus = ref<any>(null);
  const { accountId, setAccountId } = useAccount();
  let intervalId: any = null;

  const fetchAccountStatus = async () => {
    if (!accountId.value) {
      accountStatus.value = null;
      return;
    }

    try {
      const response = await fetch(`/api/account-status/${accountId.value}`);
      if (!response.ok) {
        throw new Error('Failed to fetch account status');
      }
      const data = await response.json();
      accountStatus.value = data;
    } catch (error) {
      console.error('Error fetching account status:', error);
      setAccountId(null);
      accountStatus.value = null;
    }
  };

  const startPolling = () => {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(fetchAccountStatus, 5000);
  };

  const stopPolling = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  onMounted(() => {
    fetchAccountStatus();
    startPolling();
  });

  onUnmounted(() => {
    stopPolling();
  });

  watch(accountId, () => {
    fetchAccountStatus();
    startPolling();
  });

  const needsOnboarding = computed(() => {
    return !accountStatus.value?.chargesEnabled && !accountStatus.value?.detailsSubmitted;
  });

  return {
    accountStatus,
    refreshStatus: fetchAccountStatus,
    needsOnboarding,
  };
};
