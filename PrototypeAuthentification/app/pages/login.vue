<script setup lang="ts">
const configs = useRuntimeConfig();

const email = ref<string>("testvisitor2@exemple.com");
const password = ref<string>("Password123!");
const loading = ref<boolean>(false);
const errorMessage = ref<string | null>(null);
const cookie = useCookie("authToken", {
  maxAge: 3600,
  secure: import.meta.env.PROD,
  sameSite: "lax",
});

const login = async () => {
  try {
    loading.value = true;
    errorMessage.value = null;

    const response = await $fetch<{ accessToken: string; expiresIn: number }>
    (`${configs.public.apiBase}/login`, {
        method: 'POST',
        body: {
          email: email.value,
          password: password.value
        }
      }
    );

    cookie.value = response.accessToken;

    return navigateTo('/profile');
  } catch (error:any) {
    console.error("Login error:", error);

    if (error.status === 400) {
      errorMessage.value = "Invalid request.";
    } else if (error.status === 401) {
      errorMessage.value = "Invalid email or password.";
    } else if (error.status === 0) {
      errorMessage.value = "Failed to connect to the server.";
    }else {
      errorMessage.value = "An unexpected error occurred. Please try again later.";
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
    <div class="login-card">
      <h1>Login</h1>
      <form @submit.prevent="login" class="login-form">
        <input v-model="email" type="email" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Password" />
        <button type="submit" :disabled="loading">
          {{ loading ? "Logging in..." : "Login" }}
          </button>
        <p class="error" v-if="errorMessage">{{ errorMessage }}</p>
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

.error {
  margin-top: 0.5rem;
  padding: 0.5rem;
  border-radius: 6px;
  background: #fee2e2;
  color: #b91c1c;
  font-size: 0.85rem;
  border: 1px solid #fecaca;
}
</style>