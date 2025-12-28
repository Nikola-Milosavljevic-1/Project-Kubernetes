<template>
  <div class="dashboard">
    <!-- Zone Header - Informations Joueur -->
    <header class="dashboard-header">
      <div class="header-content">
        <div class="user-info">
          <span class="username">👤 {{ username }}</span>
          <span class="balance">Solde : <strong>{{ balance.toLocaleString() }}</strong> jetons</span>
        </div>
        <button class="recharge-btn" @click="handleRecharge" :disabled="isRecharging">
          {{ isRecharging ? 'Rechargement...' : 'Recharger (+1000)' }}
        </button>
      </div>
    </header>

    <!-- Zone de Jeu -->
    <main class="game-zone">
      <div class="jackpot-container">
        <h2 class="jackpot-label">JACKPOT</h2>
        <div class="jackpot-amount">{{ jackpot.toLocaleString() }} 🎰</div>
        <p class="jackpot-subtitle">Cagnotte commune à tous les joueurs</p>
      </div>

      <div class="game-form">
        <div class="bet-input-container">
          <label for="betAmount">Montant à miser</label>
          <input
            id="betAmount"
            v-model.number="betAmount"
            type="number"
            min="1"
            :max="balance"
            placeholder="Entrez votre mise"
            :disabled="isPlaying"
          />
        </div>

        <button
          class="play-btn"
          @click="handlePlay"
          :disabled="isPlaying || !betAmount || betAmount <= 0 || betAmount > balance"
        >
          {{ isPlaying ? 'En cours...' : 'TENTER MA CHANCE' }}
        </button>

        <!-- Zone de Feedback -->
        <div v-if="gameResult" class="feedback-zone" :class="gameResult.result">
          <div v-if="gameResult.result === 'win'" class="feedback-win">
            <div class="win-icon">🎉</div>
            <h3>FÉLICITATIONS !</h3>
            <p>Vous avez remporté le Jackpot de <strong>{{ gameResult.prize.toLocaleString() }}</strong> jetons !</p>
          </div>
          <div v-else class="feedback-lose">
            <div class="lose-icon">😔</div>
            <p>Dommage ! Vos jetons ont été ajoutés à la cagnotte.</p>
          </div>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </div>
    </main>

    <!-- Zone Historique -->
    <section class="history-zone">
      <h2 class="history-title">Derniers Grands Vainqueurs</h2>
      <div v-if="isLoadingHistory" class="loading">Chargement...</div>
      <div v-else-if="history.length === 0" class="no-history">
        Aucun gagnant pour le moment
      </div>
      <table v-else class="history-table">
        <thead>
          <tr>
            <th>Nom du joueur</th>
            <th>Montant remporté</th>
            <th>Date/Heure</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(winner, index) in history" :key="index">
            <td>{{ winner.username }}</td>
            <td class="amount-cell">{{ winner.amount.toLocaleString() }} jetons</td>
            <td>{{ winner.date }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUserInfo, rechargeAccount } from '../api/user'
import { getGameStatus, playGame, getGameHistory } from '../api/game'

const router = useRouter()

// État de l'utilisateur
const username = ref('')
const balance = ref(0)
const isRecharging = ref(false)

// État du jeu
const jackpot = ref(0)
const betAmount = ref(null)
const isPlaying = ref(false)
const gameResult = ref(null)
const error = ref(null)

// Historique
const history = ref([])
const isLoadingHistory = ref(false)

// Intervalle pour rafraîchir le jackpot
let jackpotInterval = null

/**
 * Charge les informations de l'utilisateur
 */
const loadUserInfo = async () => {
  try {
    const data = await getUserInfo()
    username.value = data.username
    balance.value = data.balance
  } catch (e) {
    console.error('Erreur lors du chargement des infos utilisateur:', e)
    // Si l'utilisateur n'est plus authentifié, rediriger vers la page de login
    if (e.message.includes('Non authentifié') || e.message.includes('401')) {
      router.push('/')
    }
  }
}

/**
 * Charge le statut du jackpot
 */
const loadJackpot = async () => {
  try {
    const data = await getGameStatus()
    jackpot.value = data.jackpot
  } catch (e) {
    console.error('Erreur lors du chargement du jackpot:', e)
  }
}

/**
 * Charge l'historique des gagnants
 */
const loadHistory = async () => {
  isLoadingHistory.value = true
  try {
    const data = await getGameHistory()
    history.value = data
  } catch (e) {
    console.error('Erreur lors du chargement de l\'historique:', e)
  } finally {
    isLoadingHistory.value = false
  }
}

/**
 * Gère le rechargement du compte
 */
const handleRecharge = async () => {
  isRecharging.value = true
  error.value = null
  
  try {
    const data = await rechargeAccount(1000)
    balance.value = data.newBalance
  } catch (e) {
    error.value = e.message || 'Erreur lors du rechargement'
  } finally {
    isRecharging.value = false
  }
}

/**
 * Gère le jeu (tentative de chance)
 */
const handlePlay = async () => {
  if (!betAmount.value || betAmount.value <= 0 || betAmount.value > balance.value) {
    error.value = 'Montant invalide'
    return
  }

  isPlaying.value = true
  error.value = null
  gameResult.value = null

  try {
    const result = await playGame(betAmount.value)
    gameResult.value = result
    balance.value = result.userBalance
    jackpot.value = result.currentJackpot
    
    // Recharger l'historique si le joueur a gagné
    if (result.result === 'win') {
      await loadHistory()
    }
    
    // Réinitialiser le formulaire après un court délai
    setTimeout(() => {
      betAmount.value = null
    }, 3000)
  } catch (e) {
    error.value = e.message || 'Erreur lors du jeu'
  } finally {
    isPlaying.value = false
  }
}

// Au montage du composant
onMounted(async () => {
  // Vérifier si l'utilisateur est authentifié
  const token = localStorage.getItem('token')
  if (!token) {
    router.push('/')
    return
  }

  // Charger les données initiales
  await Promise.all([
    loadUserInfo(),
    loadJackpot(),
    loadHistory()
  ])

  // Rafraîchir le jackpot toutes les 5 secondes
  jackpotInterval = setInterval(loadJackpot, 5000)
})

// Au démontage du composant
onUnmounted(() => {
  if (jackpotInterval) {
    clearInterval(jackpotInterval)
  }
})
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: #ffffff;
  padding: 0;
}

/* Zone Header */
.dashboard-header {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-bottom: 2px solid rgba(255, 215, 0, 0.3);
  padding: 1.5rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.username {
  font-size: 1.2rem;
  font-weight: 600;
  color: #ffd700;
}

.balance {
  font-size: 1rem;
  color: #e0e0e0;
}

.balance strong {
  color: #4caf50;
  font-size: 1.1rem;
}

.recharge-btn {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
}

.recharge-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.5);
}

.recharge-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Zone de Jeu */
.game-zone {
  max-width: 800px;
  margin: 3rem auto;
  padding: 0 2rem;
}

.jackpot-container {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 165, 0, 0.15) 100%);
  border-radius: 20px;
  border: 3px solid rgba(255, 215, 0, 0.5);
  box-shadow: 0 8px 32px rgba(255, 215, 0, 0.2);
}

.jackpot-label {
  font-size: 1.5rem;
  color: #ffd700;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 700;
}

.jackpot-amount {
  font-size: 4rem;
  font-weight: 900;
  color: #ffd700;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.4);
  margin: 1rem 0;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.jackpot-subtitle {
  color: #b0b0b0;
  font-size: 0.9rem;
  margin-top: 1rem;
}

.game-form {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.bet-input-container {
  margin-bottom: 1.5rem;
}

.bet-input-container label {
  display: block;
  margin-bottom: 0.5rem;
  color: #e0e0e0;
  font-weight: 500;
}

.bet-input-container input {
  width: 100%;
  padding: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  color: white;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.bet-input-container input:focus {
  outline: none;
  border-color: #ffd700;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
}

.bet-input-container input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.play-btn {
  width: 100%;
  padding: 1.2rem;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.3rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 25px rgba(238, 90, 111, 0.4);
  margin-bottom: 1.5rem;
}

.play-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 35px rgba(238, 90, 111, 0.6);
}

.play-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Zone de Feedback */
.feedback-zone {
  margin-top: 1.5rem;
  padding: 1.5rem;
  border-radius: 10px;
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feedback-zone.win {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(56, 142, 60, 0.2) 100%);
  border: 2px solid #4caf50;
}

.feedback-zone.lose {
  background: rgba(255, 152, 0, 0.1);
  border: 2px solid rgba(255, 152, 0, 0.5);
}

.feedback-win {
  text-align: center;
}

.win-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: bounce 0.6s ease-in-out;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.feedback-win h3 {
  color: #4caf50;
  font-size: 2rem;
  margin: 1rem 0;
  text-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
}

.feedback-win p {
  color: #e0e0e0;
  font-size: 1.1rem;
}

.feedback-win strong {
  color: #ffd700;
  font-size: 1.3rem;
}

.feedback-lose {
  text-align: center;
}

.lose-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feedback-lose p {
  color: #e0e0e0;
  font-size: 1.1rem;
}

.error-message {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(244, 67, 54, 0.2);
  border: 1px solid #f44336;
  border-radius: 8px;
  color: #ffcdd2;
  text-align: center;
}

/* Zone Historique */
.history-zone {
  max-width: 1200px;
  margin: 3rem auto;
  padding: 0 2rem 3rem;
}

.history-title {
  text-align: center;
  font-size: 2rem;
  color: #ffd700;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.loading,
.no-history {
  text-align: center;
  color: #b0b0b0;
  padding: 2rem;
  font-size: 1.1rem;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.history-table thead {
  background: rgba(255, 215, 0, 0.2);
}

.history-table th {
  padding: 1rem;
  text-align: left;
  color: #ffd700;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 1px;
}

.history-table td {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
}

.history-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.05);
}

.amount-cell {
  color: #4caf50;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .jackpot-amount {
    font-size: 2.5rem;
  }

  .play-btn {
    font-size: 1.1rem;
    padding: 1rem;
  }

  .history-table {
    font-size: 0.9rem;
  }

  .history-table th,
  .history-table td {
    padding: 0.75rem;
  }
}
</style>
