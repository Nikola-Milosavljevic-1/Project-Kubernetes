const express = require("express");
const authenticate = require("./middlewares/authMiddleware");

// Import des contrôleurs
const authController = require("./controllers/authController");
const userController = require("./controllers/userController");
const gameController = require("./controllers/gameController");

const router = express.Router();

// ============================================================================
// MODULE AUTHENTIFICATION & UTILISATEUR
// ============================================================================

/**
 * Connexion / Inscription
 * Route : POST /api/auth/login
 * Description : Authentifie l'utilisateur ou le crée s'il n'existe pas
 */
router.post("/auth/login", authController.login);

/**
 * Obtenir les informations utilisateur
 * Route : GET /api/user/me
 * Description : Récupère le solde actuel de l'utilisateur
 * Requiert une authentification
 */
router.get("/user/me", authenticate, userController.getMe);

/**
 * Recharger le compte
 * Route : POST /api/user/recharge
 * Description : Ajoute des jetons fictifs au compte de l'utilisateur
 * Requiert une authentification
 */
router.post("/user/recharge", authenticate, userController.recharge);

// ============================================================================
// MODULE JEU (GAME LOGIC)
// ============================================================================

/**
 * Obtenir l'état du Jackpot
 * Route : GET /api/game/status
 * Description : Renvoie le montant actuel de la cagnotte
 */
router.get("/game/status", gameController.getStatus);

/**
 * Jouer (Lancer la loterie)
 * Route : POST /api/game/play
 * Description : Exécute la logique principale du jeu
 * Requiert une authentification
 */
router.post("/game/play", authenticate, gameController.play);

// ============================================================================
// MODULE DONNÉES (HISTORIQUE)
// ============================================================================

/**
 * Liste des vainqueurs
 * Route : GET /api/game/history
 * Description : Renvoie la liste des 10 derniers gains
 */
router.get("/game/history", gameController.getHistory);

module.exports = router;
