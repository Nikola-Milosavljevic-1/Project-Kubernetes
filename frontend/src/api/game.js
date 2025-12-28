import API_BASE_URL from '../config/api'

/**
 * Récupère l'état actuel du jackpot
 * @returns {Promise<Object>} État du jeu (jackpot)
 * @throws {Error} En cas d'erreur serveur
 */
export async function getGameStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/game/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || data.error || 'Erreur lors de la récupération du statut')
    }

    return data
  } catch (error) {
    if (error.message) {
      throw error
    }
    throw new Error('Impossible de récupérer l\'état du jeu')
  }
}

/**
 * Lance un tour de loterie
 * @param {number} betAmount - Montant à miser
 * @returns {Promise<Object>} Résultat du jeu (result, prize, currentJackpot, userBalance)
 * @throws {Error} Si le jeu échoue (solde insuffisant, etc.)
 */
export async function playGame(betAmount) {
  const token = localStorage.getItem('token')
  
  if (!token) {
    throw new Error('Non authentifié')
  }

  try {
    const res = await fetch(`${API_BASE_URL}/game/play`, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ betAmount })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || data.error || 'Erreur lors du jeu')
    }

    return data
  } catch (error) {
    if (error.message) {
      throw error
    }
    throw new Error('Impossible de jouer')
  }
}

/**
 * Récupère l'historique des 10 derniers gagnants
 * @returns {Promise<Array>} Liste des gagnants (username, amount, date)
 * @throws {Error} En cas d'erreur serveur
 */
export async function getGameHistory() {
  try {
    const res = await fetch(`${API_BASE_URL}/game/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || data.error || 'Erreur lors de la récupération de l\'historique')
    }

    return data
  } catch (error) {
    if (error.message) {
      throw error
    }
    throw new Error('Impossible de récupérer l\'historique')
  }
}

