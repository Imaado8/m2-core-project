<template>
  <div class="login-wrapper">
    <div class="login-card text-center">
      <img :src="logo" alt="ModernTech Logo" class="login-logo" />
      <h2 class="login-title">Login</h2>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" required />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" required />
        </div>
        <button type="submit" class="btn-login">Login</button>
      </form>

      <p v-if="error" class="error-text">{{ error }}</p>
    </div>
  </div>
</template>>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import logo from '@/assets/moderntech-logo.png'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

function handleLogin() {
  if (email.value === 'admin@gmail.com' && password.value === 'admin123') {
    localStorage.setItem('isLoggedIn', 'true')
    error.value = ''
    router.push('/dashboard')
  } else {
    error.value = 'Invalid email or password.'
  }
}
</script>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #225c70;
  height: 100vh;
  padding: 20px;
}

.login-card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-title {
  text-align: center;
  font-size: 1.8rem;
  font-weight: 600;
  color: #1d3557;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  box-sizing: border-box;
}

.btn-login {
  width: 100%;
  padding: 0.75rem;
  border-radius: 999px;
  background-color: #708090;
  color: white;
  font-weight: bold;
  border: none;
  cursor: pointer;
  margin-top: 1rem;
  font-size: 1rem;
}

.btn-login:hover {
  background-color: #41464a;
}

.error-text {
  color: #dc3545;
  margin-top: 1rem;
  text-align: center;
  font-size: 0.95rem;
}
.login-logo {
  display: block;
  margin: 0 auto 1rem;
  max-width: 270px;
  width: 100%;
  height: auto;
  object-fit: contain;
  padding: 0;
}
</style>
