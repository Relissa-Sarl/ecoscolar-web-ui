<script setup lang="ts">
const configs = useRuntimeConfig();
const name = ref("damien2");
const email = ref("testvisitor2@exemple.com");
const password = ref("Password123!");
const confirmPassword = ref("Password123!");
const cookie = useCookie("authToken", {
  // Set the cookie to expire in 7 days
  maxAge: 3600,
  // Ensure the cookie is sent only over secure connections
  secure: true,
  // Set the SameSite attribute to prevent CSRF attacks
  sameSite: "lax",
});

const register = async () => {
    console.log("Registering user:", { name: name.value, email: email.value });
    if (password.value !== confirmPassword.value) {
        alert("Passwords do not match!");
        return;
    }
    console.log("Passwords match, proceeding with registration.");
    // Here you would typically send a request to your backend to create the user
    
    try {
        const response = await $fetch<{message: string}>(`${configs.public.apiBase}/api/users/custom-register`, {
        method: 'POST',
        body: {
            email: email.value,
            password: password.value,
            name: name.value
        }
        });

        console.log("Registration response:", response);

        // Return the data to your frontend
        console.log('Register successful:', response);
        // In a component or plugin
        
        const loginResponse = await $fetch<{ accessToken: string; expiresIn: number }>(`${configs.public.apiBase}/login`, {
            method: 'POST',
            body: {
                email: email.value,
                password: password.value
            }
        });

        cookie.value = loginResponse.accessToken;
        return navigateTo('/me');
    } catch (error) {
        // Handle errors gracefully
        throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch data'
        });
    };
}
</script>

<template>
    <h1>Register</h1>
    <form @submit.prevent="register">
        <input v-model="name" type="text" placeholder="Name" />
        <input v-model="email" type="email" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Password" />
        <input v-model="confirmPassword" type="password" placeholder="Confirm Password" />
        <button type="submit">Register</button>
    </form>
    <p>Already have an account? <NuxtLink to="/login">Login</NuxtLink></p>
</template>