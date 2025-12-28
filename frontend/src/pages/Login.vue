<template>
  <div class="login">
    <h1>Simple Lottery Platform</h1>

    <input v-model="username" placeholder="Nom d'utilisateur" />
    <input v-model="password" type="password" placeholder="Mot de passe" />

    <button @click="login">Se connecter / S’inscrire</button>
    <p v-if="error" style="color:red">{{ error }}</p>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginApi } from '../api/auth'

const username = ref('')
const password = ref('')
const error = ref(null)
const router = useRouter()

const login = async () => {
  try {
    const data = await loginApi(username.value, password.value)
    localStorage.setItem('token', data.token)
    router.push('/dashboard')
  } catch (e) {
    error.value = 'Identifiants invalides'
  }
}
</script>
