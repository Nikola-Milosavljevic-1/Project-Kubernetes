import API_BASE_URL from '../config/api'

/**
 * Fonction pour se connecter ou s'inscrire
 * Si l'utilisateur n'existe pas, il est automatiquement créé
 * Si l'utilisateur existe, on vérifie le mot de passe
 * 
 * @param {string} username - Nom d'utilisateur
 * @param {string} password - Mot de passe
 * @returns {Promise<Object>} Données de l'utilisateur avec token
 * @throws {Error} Si les identifiants sont invalides ou en cas d'erreur serveur
 */
export async function loginApi(username, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })

    const data = await res.json()

    // Si la réponse n'est pas OK, on lance une erreur
    if (!res.ok) {
      // Utiliser le message d'erreur du backend si disponible
      const errorMessage = data.message || data.error || 'Erreur authentification'
      throw new Error(errorMessage)
    }

    return data
  } catch (error) {
    // Si c'est déjà une erreur avec message, on la relance
    if (error.message) {
      throw error
    }
    // Sinon, erreur réseau ou autre
    throw new Error('Impossible de se connecter au serveur')
  }
}

