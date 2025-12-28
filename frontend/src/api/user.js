import API_BASE_URL from '../config/api'

/**
 * Récupère les informations de l'utilisateur connecté
 * @returns {Promise<Object>} Informations utilisateur (username, balance)
 * @throws {Error} Si l'utilisateur n'est pas authentifié ou en cas d'erreur
 */
export async function getUserInfo() {
  const token = localStorage.getItem('token')
  
  if (!token) {
    throw new Error('Non authentifié')
  }

  try {
    const res = await fetch(`${API_BASE_URL}/user/me`, {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || data.error || 'Erreur lors de la récupération des informations')
    }

    return data
  } catch (error) {
    if (error.message) {
      throw error
    }
    throw new Error('Impossible de récupérer les informations utilisateur')
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
    throw new Error('Non authentifié')
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

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || data.error || 'Erreur lors du rechargement')
    }

    return data
  } catch (error) {
    if (error.message) {
      throw error
    }
    throw new Error('Impossible de recharger le compte')
  }
}

