/**
 * Configuration de l'API backend
 * Définit l'URL de base pour toutes les requêtes API
 */

// En développement, on utilise le proxy Vite configuré dans vite.config.js
// En production, on utilisera l'URL complète du backend
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export default API_BASE_URL

