<template>
  <div class="login">
    <div class="login-container">
      <h1 class="login-title">Simple Lottery Platform</h1>
      <p class="login-subtitle">🎰 Tentez votre chance et remportez le jackpot !</p>

      <div class="login-form">
        <div class="input-group">
          <input
            v-model="username"
            type="text"
            placeholder="Nom d'utilisateur"
            class="login-input"
            @keyup.enter="handleLogin"
          />
        </div>

        <div class="input-group">
          <input
            v-model="password"
            type="password"
            placeholder="Mot de passe"
            class="login-input"
            @keyup.enter="handleLogin"
          />
        </div>

        <button
          class="login-btn"
          @click="handleLogin"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Connexion...' : 'Se connecter / S\'inscrire' }}
        </button>

        <p v-if="error" class="error-message">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginApi } from '../api/auth'

const username = ref('')
const password = ref('')
const error = ref(null)
const isLoading = ref(false)
const router = useRouter()

/**
 * Gère la connexion ou l'inscription de l'utilisateur
 * Si l'utilisateur n'existe pas, il est automatiquement créé
 * Si l'utilisateur existe, on vérifie le mot de passe
 */
const handleLogin = async () => {
  // Réinitialiser l'erreur
  error.value = null
  
  // Validation basique
  if (!username.value || !password.value) {
    error.value = 'Veuillez remplir tous les champs'
    return
  }

  isLoading.value = true

  try {
    // Appeler l'API de login/inscription
    const data = await loginApi(username.value, password.value)
    
    // Stocker le token dans le localStorage
    localStorage.setItem('token', data.token)
    localStorage.setItem('userId', data.userId)
    localStorage.setItem('username', data.username)
    
    // Rediriger vers le dashboard
    router.push('/dashboard')
  } catch (e) {
    // Afficher le message d'erreur du backend ou un message par défaut
    error.value = e.message || 'Identifiants invalides'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-container {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  max-width: 450px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.login-title {
  font-size: 2.5rem;
  color: #ffd700;
  margin-bottom: 0.5rem;
  text-align: center;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

.login-subtitle {
  text-align: center;
  color: #b0b0b0;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.login-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.login-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.login-input:focus {
  outline: none;
  border-color: #ffd700;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
}

.login-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 25px rgba(238, 90, 111, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 35px rgba(238, 90, 111, 0.6);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.error-message {
  color: #ffcdd2;
  background: rgba(244, 67, 54, 0.2);
  border: 1px solid #f44336;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .login-container {
    padding: 2rem;
  }

  .login-title {
    font-size: 2rem;
  }
}
</style>
