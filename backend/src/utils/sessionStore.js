/**
 * Store simple en mémoire pour gérer les sessions utilisateurs
 * En production, on utiliserait Redis ou une base de données
 * mais pour simplifier, on garde ça en mémoire
 */
const sessions = new Map();

/**
 * Crée une nouvelle session pour un utilisateur
 * 
 * @param {string} userId - L'ID de l'utilisateur
 * @param {string} token - Le token de session
 * @param {string} username - Le nom d'utilisateur
 */
function createSession(userId, token, username) {
  sessions.set(token, {
    userId: userId.toString(),
    username,
    createdAt: new Date()
  });
}

/**
 * Récupère les informations d'une session à partir du token
 * 
 * @param {string} token - Le token de session
 * @returns {Object|null} Les informations de la session ou null si invalide
 */
function getSession(token) {
  return sessions.get(token) || null;
}

/**
 * Supprime une session (pour la déconnexion)
 * 
 * @param {string} token - Le token de session à supprimer
 */
function deleteSession(token) {
  sessions.delete(token);
}

module.exports = {
  createSession,
  getSession,
  deleteSession
};

