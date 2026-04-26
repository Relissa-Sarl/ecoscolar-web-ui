<script setup lang="ts">
const configs = useRuntimeConfig();

const name = ref("damien2");
const email = ref("testvisitor2@exemple.com");
const password = ref("Password123!");
const confirmPassword = ref("Password123!");
const loading = ref<boolean>(false);
const errorMessage = ref<string | null>(null);
const cookie = useCookie("authToken", {
  // Set the cookie to expire in 7 days
  maxAge: 3600,
  // Ensure the cookie is sent only over secure connections
  secure: import.meta.env.PROD,
  // Set the SameSite attribute to prevent CSRF attacks
  sameSite: "lax",
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const nameRegex = /^[A-Za-zÀ-ÿ\s]{2,50}$/;

const register = async () => {
    loading.value = true;
    errorMessage.value = null;

    if (!nameRegex.test(name.value)) {
        errorMessage.value = "Invalid name format.";
        loading.value = false;
        return;
    }

    if (!emailRegex.test(email.value)) {
        errorMessage.value = "Invalid email format.";
        loading.value = false;
        return;
    }

    if (!passwordRegex.test(password.value)) {
        errorMessage.value = "Password must be at least 8 characters, include uppercase, lowercase and a number.";
        loading.value = false;
        return;
    }
    if (password.value !== confirmPassword.value) {
        errorMessage.value = "Passwords do not match.";
        loading.value = false;
        return;
    }

    try {
        const response = await $fetch<{ message: string }>(`${configs.public.apiBase}/api/users/custom-register`,
            {
                method: 'POST',
                body: {
                    name: name.value,
                    email: email.value,
                    password: password.value
                }
            }
        );

        console.log("Registration successful:", response);

        const loginRespons = await $fetch<{ accessToken: string; expiresIn: number }>(`${configs.public.apiBase}/login`,
            {
                method: 'POST',
                body: {
                    email: email.value,
                    password: password.value
                }
            }
        );

        cookie.value = loginRespons.accessToken;
        return navigateTo('/profile');
    } catch (error: any) {
        console.error("Registration error:", error);

        if (error?.status === 400) {
            errorMessage.value = "Invalid data or email already exists.";
        } else if (error?.status === 0) {
            errorMessage.value = "Server unreachable.";
        } else {
            errorMessage.value = "Unexpected error occurred.";
        }
    } finally {
        loading.value = false;
    }
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
            <button type="submit" :disabled="loading">
                {{ loading ? "Registering..." : "Register" }}
            </button>
            <p v-if="errorMessage" class="error">
                {{ errorMessage }}
            </p>
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

.error {
    margin-top: 1rem;
    padding: 0.75rem;
    background: #fee2e2;
    color: #b91c1c;
    border: 1px solid #fecaca;
    border-radius: 8px;
}
</style>