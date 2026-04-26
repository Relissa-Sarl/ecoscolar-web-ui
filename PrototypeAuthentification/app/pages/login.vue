<script setup lang="ts">
const configs = useRuntimeConfig();

const email = ref("testvisitor2@exemple.com");
const password = ref("Password123!");
const cookie = useCookie("authToken", {
  maxAge: 3600,
  secure: true,
  sameSite: "lax",
});

// "email": "testvisitor@exemple.com",
// "password": "Password123!"
const login = async () => {
  try {
    const response = await $fetch<{ accessToken: string; expiresIn: number }>(`${configs.public.apiBase}/login`, {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    });

    cookie.value = response.accessToken;

    return navigateTo('/me');
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch user data',
    });
  }
};
</script>

<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
    <p>No account? <NuxtLink to="/register">Register</NuxtLink></p>
  </div>
</template>
