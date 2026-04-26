<script setup lang="ts">
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
        const response = await $fetch<{message: string}>('http://localhost:5299/api/users/custom-register', {
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
        
        const loginResponse = await $fetch<{ accessToken: string; expiresIn: number }>('http://localhost:5299/login', {
            method: 'POST',
            body: {
                email: email.value,
                password: password.value
            }
        });

        cookie.value = loginResponse.accessToken;
        return navigateTo('/profile');
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
    <div class="register-card">
        <h1>Register</h1>
        <form @submit.prevent="register" class="register-form">
            <input v-model="name" type="text" placeholder="Name" />
            <input v-model="email" type="email" placeholder="Email" />
            <input v-model="password" type="password" placeholder="Password" />
            <input v-model="confirmPassword" type="password" placeholder="Confirm Password" />
            <button type="submit">Register</button>
        </form>
        <p>Already have an account? <NuxtLink to="/login">Login</NuxtLink></p>
    </div>
</template>

<style scoped>
.register-card {
    background: #fff;
    padding: 2rem;
    border-radius: 12px;
    width: 360px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
    text-align: center;
}
.register-card h1 {
    margin-bottom: 1.5rem;
    color: #0f172a;
}

.register-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.register-form input {
    padding: 0.75rem;
    border: 1px solid #cbd5f5;
    border-radius: 8px;
    outline: none;
    transition: 0.2s;
}

.register-form input:focus {
    border-color: #22c55e;
    box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2);
}

.register-form button {
    padding: 0.75rem;
    border: none;
    border-radius: 8px;
    background: #22c55e;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    transition: 0.2s;
}

.register-form button:hover {
    background: #16a34a;
}

.register-card p {
    margin-top: 1rem;
    font-size: 0.9rem;
}

.register-card a {
    color: #22c55e;
    text-decoration: none;
    font-weight: bold;
}

.register-card a:hover {
    text-decoration: underline;
}
</style>