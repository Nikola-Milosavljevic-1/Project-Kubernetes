const express = require("express");
const router = express.Router();

// ============================================================================
// MODULE AUTHENTIFICATION & UTILISATEUR
// ============================================================================

/**
 * Connexion / Inscription
 * Route : POST /api/auth/login
 * Description : Authentifie l'utilisateur ou le crée s'il n'existe pas
 * 
 * Corps de la requête (Request Body) :
 * {
 *   "username": "etudiant1",
 *   "password": "password123"
 * }
 * 
 * Réponse (Response) :
 * {
 *   "userId": 1,
 *   "username": "etudiant1",
 *   "token": "session-token-xyz"
 * }
 */
router.post("/auth/login", (req, res) => {
  res.json({
    test: true,
    message: "API de connexion/inscription - En développement"
  });
});

/**
 * Obtenir les informations utilisateur
 * Route : GET /api/user/me
 * Description : Récupère le solde actuel de l'utilisateur pour mettre à jour l'interface
 * 
 * Header requis :
 *   Authorization: session-token-xyz
 * 
 * Réponse (Response) :
 * {
 *   "username": "etudiant1",
 *   "balance": 500
 * }
 */
router.get("/user/me", (req, res) => {
  res.json({
    test: true,
    message: "API d'informations utilisateur - En développement"
  });
});

/**
 * Recharger le compte
 * Route : POST /api/user/recharge
 * Description : Ajoute des jetons fictifs au compte de l'utilisateur
 * 
 * Header requis :
 *   Authorization: session-token-xyz
 * 
 * Corps de la requête (Request Body) :
 * {
 *   "amount": 1000
 * }
 * 
 * Réponse (Response) :
 * {
 *   "success": true,
 *   "newBalance": 1500
 * }
 */
router.post("/user/recharge", (req, res) => {
  res.json({
    test: true,
    message: "API de rechargement - En développement"
  });
});

// ============================================================================
// MODULE JEU (GAME LOGIC)
// ============================================================================

/**
 * Obtenir l'état du Jackpot
 * Route : GET /api/game/status
 * Description : Renvoie le montant actuel de la cagnotte
 * 
 * Réponse (Response) :
 * {
 *   "jackpot": 10500
 * }
 */
router.get("/game/status", (req, res) => {
  res.json({
    test: true,
    message: "API de statut du jeu - En développement"
  });
});

/**
 * Jouer (Lancer la loterie)
 * Route : POST /api/game/play
 * Description : Exécute la logique principale du jeu
 * 
 * Header requis :
 *   Authorization: session-token-xyz
 * 
 * Corps de la requête (Request Body) :
 * {
 *   "betAmount": 50
 * }
 * 
 * Logique interne (Serveur) :
 * 1. Vérifier si User.balance >= betAmount. Sinon, retourner une erreur.
 * 2. Déduire la mise : User.balance = User.balance - betAmount.
 * 3. Générer un résultat aléatoire selon la probabilité
 *    (la probabilité de gagner doit augmenter selon le montant)
 * 4. Si PERDU :
 *    - Ajouter la mise au Jackpot : Jackpot = Jackpot + betAmount
 *    - Retourner le résultat "lose"
 * 5. Si GAGNÉ :
 *    - Créditer le Jackpot à l'utilisateur : User.balance = User.balance + Jackpot
 *    - Enregistrer la victoire dans l'historique
 *    - Réinitialiser le Jackpot à sa valeur par défaut (ex: 1000)
 *    - Retourner le résultat "win"
 * 
 * Réponse (Response - Exemple de victoire) :
 * {
 *   "result": "win",
 *   "prize": 10500,
 *   "currentJackpot": 1000,
 *   "userBalance": 15500
 * }
 * 
 * Réponse (Response - Exemple de défaite) :
 * {
 *   "result": "lose",
 *   "prize": 0,
 *   "currentJackpot": 10550,
 *   "userBalance": 450
 * }
 */
router.post("/game/play", (req, res) => {
  res.json({
    test: true,
    message: "API de jeu - En développement"
  });
});

// ============================================================================
// MODULE DONNÉES (HISTORIQUE)
// ============================================================================

/**
 * Liste des vainqueurs
 * Route : GET /api/game/history
 * Description : Renvoie la liste des 10 derniers gains
 * 
 * Réponse (Response) :
 * [
 *   { "username": "alice", "amount": 5000, "date": "2023-10-27 14:00" },
 *   { "username": "bob", "amount": 2300, "date": "2023-10-27 13:45" }
 * ]
 */
router.get("/game/history", (req, res) => {
  res.json({
    test: true,
    message: "API d'historique - En développement"
  });
});

module.exports = router;
