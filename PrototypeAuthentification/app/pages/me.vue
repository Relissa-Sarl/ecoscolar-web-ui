<script setup lang="ts">
definePageMeta({
    middleware: 'auth'
})
const configs = useRuntimeConfig();
const cookie = useCookie("authToken");

function logout() {
    cookie.value = null;
    return navigateTo('/login');
}

const users = ref<Object[]>();
const fetchUsers = async () => {
    try {
        const response = await $fetch<Object[]>(`${configs.public.apiBase}/api/users`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${cookie.value}`
            }
        });
        users.value = response;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}
onMounted(() => {
    fetchUsers();
});

</script>

<template>
    <div>
        <h1>Welcome to your profile page!</h1>
        <p>This is a protected route that requires authentication.</p>
        <div>
            <h2>Users List:</h2>
            <p v-for="(user, index) in users" :key="index">
                {{ user }}
            </p>
        </div>
        <button @click="logout()">Logout</button>
    </div>
</template>