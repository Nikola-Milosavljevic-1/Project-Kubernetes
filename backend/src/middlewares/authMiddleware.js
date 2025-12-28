const { extractToken } = require("../utils/tokenUtils");
const { getSession } = require("../utils/sessionStore");

/**
 * Middleware pour vérifier l'authentification de l'utilisateur
 * Vérifie que le token est présent et valide dans le header Authorization
 * 
 * Si l'authentification échoue, retourne une erreur 401
 * Si elle réussit, ajoute les infos utilisateur dans req.user
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = extractToken(authHeader);
  
  if (!token) {
    return res.status(401).json({
      error: "Token manquant",
      message: "Vous devez fournir un token d'authentification dans le header Authorization"
    });
  }
  
  const session = getSession(token);
  
  if (!session) {
    return res.status(401).json({
      error: "Token invalide",
      message: "Votre session a expiré ou est invalide. Veuillez vous reconnecter."
    });
  }
  
  // On ajoute les infos utilisateur à la requête pour les utiliser dans les contrôleurs
  req.user = {
    userId: session.userId,
    username: session.username,
    token: token
  };
  
  next();
}

module.exports = authenticate;

