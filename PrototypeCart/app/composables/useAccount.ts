export const useAccount = () => {
  const accountId = useCookie<string | null>('accountId', {
    default: () => null,
    watch: true,
  });

  const setAccountId = (id: string | null) => {
    accountId.value = id;
  };

  return {
    accountId,
    setAccountId,
  };
};
