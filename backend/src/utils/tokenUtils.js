const crypto = require("crypto");

/**
 * Génère un token de session simple pour l'authentification
 * En production, on utiliserait JWT mais ici on garde ça simple
 * 
 * @param {string} username - Le nom d'utilisateur
 * @param {string} userId - L'ID de l'utilisateur
 * @returns {string} Un token de session
 */
function generateToken(username, userId) {
  const data = `${username}-${userId}-${Date.now()}`;
  return crypto.createHash("sha256").update(data).digest("hex");
}

/**
 * Extrait le token depuis le header Authorization
 * Format attendu : "Authorization: session-token-xyz"
 * 
 * @param {string} authHeader - Le header Authorization complet
 * @returns {string|null} Le token extrait ou null si invalide
 */
function extractToken(authHeader) {
  if (!authHeader) {
    return null;
  }
  
  // On accepte soit "Bearer token" soit juste "token"
  const parts = authHeader.split(" ");
  if (parts.length === 2) {
    return parts[1];
  }
  
  return authHeader;
}

module.exports = {
  generateToken,
  extractToken
};

