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

    return navigateTo('/profile');
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
    <div class="login-card">
      <h1>Login</h1>
      <form @submit.prevent="login" class="login-form">
        <input v-model="email" type="email" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
      <p>No account? <NuxtLink to="/register">Register</NuxtLink></p>
    </div>
</template>

<style scoped>
.login-card {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 320px;
  text-align: center;
}

.login-card h1 {
  margin-bottom: 1.5rem;
  color: #1e293b
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-form input {
  padding: 0.75rem;
  border: 1px solid #cbd5f5;
  border-radius: 8px;
  outline: none;
  transition: 0.2s;
}

.login-form input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.login-form button {
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  background: #6366f1;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}

.login-form button:hover {
  background: #4f46e5;
}

.login-card p {
  margin-top: 1rem;
  font-size: 0.9rem;
}

.login-card a {
  color: #6366f1;
  text-decoration: none;
  font-weight: bold;
}

.login-card a:hover {
  text-decoration: underline;
}
</style>