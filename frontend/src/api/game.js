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

    // Capturer le statusCode AVANT d'essayer de parser le JSON
    const statusCode = res.status

    // Essayer de parser le JSON, mais gérer les erreurs de parsing
    let data
    try {
      const text = await res.text()
      data = text ? JSON.parse(text) : {}
    } catch (parseError) {
      // Si le parsing échoue, créer une erreur avec le statusCode
      const error = new Error('Réponse invalide du serveur')
      error.statusCode = statusCode
      throw error
    }

    if (!res.ok) {
      const error = new Error(data.message || data.error || 'Erreur lors de la récupération du statut')
      error.statusCode = statusCode
      throw error
    }

    return data
  } catch (error) {
    // Si l'erreur a déjà un statusCode, on la relance telle quelle
    if (error.statusCode) {
      throw error
    }
    // Sinon, on crée une nouvelle erreur avec le message existant
    const newError = new Error(error.message || 'Impossible de récupérer l\'état du jeu')
    newError.statusCode = 500
    throw newError
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
    const error = new Error('Non authentifié')
    error.statusCode = 401
    throw error
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

    // Capturer le statusCode AVANT d'essayer de parser le JSON
    const statusCode = res.status

    // Essayer de parser le JSON, mais gérer les erreurs de parsing
    let data
    try {
      const text = await res.text()
      data = text ? JSON.parse(text) : {}
    } catch (parseError) {
      // Si le parsing échoue, créer une erreur avec le statusCode
      const error = new Error('Réponse invalide du serveur')
      error.statusCode = statusCode
      throw error
    }

    if (!res.ok) {
      const error = new Error(data.message || data.error || 'Erreur lors du jeu')
      error.statusCode = statusCode
      throw error
    }

    return data
  } catch (error) {
    // Si l'erreur a déjà un statusCode, on la relance telle quelle
    if (error.statusCode) {
      throw error
    }
    // Sinon, on crée une nouvelle erreur avec le message existant
    const newError = new Error(error.message || 'Impossible de jouer')
    newError.statusCode = 500
    throw newError
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

    // Capturer le statusCode AVANT d'essayer de parser le JSON
    const statusCode = res.status

    // Essayer de parser le JSON, mais gérer les erreurs de parsing
    let data
    try {
      const text = await res.text()
      data = text ? JSON.parse(text) : {}
    } catch (parseError) {
      // Si le parsing échoue, créer une erreur avec le statusCode
      const error = new Error('Réponse invalide du serveur')
      error.statusCode = statusCode
      throw error
    }

    if (!res.ok) {
      const error = new Error(data.message || data.error || 'Erreur lors de la récupération de l\'historique')
      error.statusCode = statusCode
      throw error
    }

    return data
  } catch (error) {
    // Si l'erreur a déjà un statusCode, on la relance telle quelle
    if (error.statusCode) {
      throw error
    }
    // Sinon, on crée une nouvelle erreur avec le message existant
    const newError = new Error(error.message || 'Impossible de récupérer l\'historique')
    newError.statusCode = 500
    throw newError
  }
}

