<script setup lang="ts">
import DeleteConfirmationPopup from '~/components/common/DeleteConfirmationPopup.vue'
import History from '~/components/profile/private/History.vue'
import StripeConnectCard from '~/components/profile/private/StripeConnectCard.vue'

const usersStore = useUsersStore()

definePageMeta({
  middleware: 'auth'
})

const showDeleteConfirm = ref<boolean>(false)

const confirmDelete = () => {
  showDeleteConfirm.value = false
  usersStore.deleteAccount()
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
}
</script>

<template>
  <div class="flex flex-col md:flex-row gap-8 items-start">
    <ProfileInfos
      :user="usersStore.user"
      :is-own-profile="true"
      @delete-account="showDeleteConfirm = true"
    />

    <History />

    <StripeConnectCard />

    <DeleteConfirmationPopup
      :show="showDeleteConfirm"
      :title="$t('profile.deletePopup.title')"
      :message="$t('profile.deletePopup.message')"
      :confirm-text="$t('profile.deletePopup.confirm')"
      @confirm-delete="confirmDelete"
      @cancel-delete="cancelDelete"
    />
  </div>
</template>
