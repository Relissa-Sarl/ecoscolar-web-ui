<script setup lang="ts">

const email = ref("testvisitor@exemple.com");
const password = ref("Password123!");
const cookie = useCookie("authToken", {
  // Set the cookie to expire in 7 days
  maxAge: 3600,
  // Ensure the cookie is sent only over secure connections
  secure: true,
  // Set the SameSite attribute to prevent CSRF attacks
  sameSite: "lax",
});
// "email": "testvisitor@exemple.com",
// "password": "Password123!"
const login = async () => {
  try {
    const response = await $fetch<{ accessToken: string; expiresIn: number }>('http://localhost:5299/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    });

    // Return the data to your frontend
    console.log('Login successful:', response);
    // In a component or plugin
    cookie.value = response.accessToken;

    return navigateTo('/me');
  } catch (error) {
    // Handle errors gracefully
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch weather data'
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
