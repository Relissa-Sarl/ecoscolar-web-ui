<script setup lang="ts">
import type { User } from '~/types/user';

const configs = useRuntimeConfig();
const cookie = useCookie("authToken");
definePageMeta({
    middleware: 'auth'
})

const users = ref<User[]>([]);
const loading = ref<boolean>(false);
const errorMessage = ref<string | null>(null);

function logout() {
    cookie.value = null;
    return navigateTo('/login');
}

const fetchUsers = async () => {
    if (!cookie.value) {
        logout();
        return;
    }
    loading.value = true;
    errorMessage.value = null;

    try {
        const response = await $fetch<User[]>(`${configs.public.apiBase}/api/users`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${cookie.value}`
            }
        })
        users.value = response;
    } catch (error: any) {
        console.error('Error fetching users:', error);
        if (error?.status === 401) {
            errorMessage.value = 'Unauthorized. Please log in again.';
            logout();
        } else if (error?.status === 404) {
            errorMessage.value = 'No users found.';
        } else {
            errorMessage.value = 'An unexpected error occurred.';
        }
    } finally {
        loading.value = false;
    }
}
onMounted(() => {
    fetchUsers();
    console.log('Users after fetch:', users.value);
});

</script>

<template>
    <div class="profile-card">
        <div class="profile-header">
            <h1>Profile</h1>
            <button class="logout-btn" @click="logout()">Logout</button>
        </div>

        <p class="profile-subtitle">
            This is a protected route that requires authentication.
        </p>

        <div class="users-section">
            <h2>Users List</h2>

            <div v-if="loading">Loading users...</div>

            <div class="error" v-else-if="errorMessage">
                {{ errorMessage }}
            </div>

            <div v-else-if="users?.length" class="users-list">
                <div class="user-item" v-for="(user, index) in users" :key="index">
                    <p>{{ user.name }} ({{ user.email }})</p>
                    <p>{{ user.id }}</p>
                </div>
            </div>

            <p class="empty-state" v-else>No users found.</p>
        </div>
    </div>
</template>

<style scoped>
.profile-card {
    width: 600px;
    background: #fff;
    border-radius: 14px;
    padding: 2rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.profile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.profile-subtitle {
    margin-bottom: 1.5rem;
    color: #64748b;
}

.users-section h2 {
    margin-bottom: 1rem;
    color: #1e293b;
}

.users-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.user-item {
    padding: 0.75rem;
    border-radius: 8px;
    background: #f1f5f9;
    border: 1px solide #e2e8f0;
    transition: 0.2s;
}

.user-item:hover {
    background: #e2e8f0;
}

.empty-state {
    color: #94a3b8;
    font-style: italic;
}

.logout-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 8px;
    background: #ef4444;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    transition: 0.2s;
}

.logout-btn:hover {
    background: #dc2626;
}

.error {
  padding: 1rem;
  border-radius: 8px;
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}
</style>