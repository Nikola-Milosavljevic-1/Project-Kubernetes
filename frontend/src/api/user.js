import API_BASE_URL from '../config/api'

/**
 * Récupère les informations de l'utilisateur connecté
 * @returns {Promise<Object>} Informations utilisateur (username, balance)
 * @throws {Error} Si l'utilisateur n'est pas authentifié ou en cas d'erreur
 */
export async function getUserInfo() {
  const token = localStorage.getItem('token')
  
  if (!token) {
    const error = new Error('Non authentifié')
    error.statusCode = 401
    throw error
  }

  try {
    const res = await fetch(`${API_BASE_URL}/user/me`, {
      method: 'GET',
      headers: {
        'Authorization': token,
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
      const error = new Error(data.message || data.error || 'Erreur lors de la récupération des informations')
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
    const newError = new Error(error.message || 'Impossible de récupérer les informations utilisateur')
    newError.statusCode = 500
    throw newError
  }
}

/**
 * Recharge le compte de l'utilisateur avec un montant donné
 * @param {number} amount - Montant à ajouter au solde
 * @returns {Promise<Object>} Nouveau solde (success, newBalance)
 * @throws {Error} Si le rechargement échoue
 */
export async function rechargeAccount(amount) {
  const token = localStorage.getItem('token')
  
  if (!token) {
    const error = new Error('Non authentifié')
    error.statusCode = 401
    throw error
  }

  try {
    const res = await fetch(`${API_BASE_URL}/user/recharge`, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount })
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
      const error = new Error(data.message || data.error || 'Erreur lors du rechargement')
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
    const newError = new Error(error.message || 'Impossible de recharger le compte')
    newError.statusCode = 500
    throw newError
  }
}

