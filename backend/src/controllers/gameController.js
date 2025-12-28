const User = require("../models/User");
const GameState = require("../models/GameState");
const History = require("../models/History");
const { checkWin } = require("../utils/gameLogic");

/**
 * Récupère l'état actuel du jackpot
 * Retourne le montant de la cagnotte commune
 */
async function getStatus(req, res) {
  try {
    const gameState = await GameState.getCurrentState();
    
    res.json({
      jackpot: gameState.current_jackpot
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du statut:", error);
    res.status(500).json({
      error: "Erreur serveur",
      message: "Impossible de récupérer l'état du jeu"
    });
  }
}

/**
 * Exécute la logique principale du jeu
 * 1. Vérifie que l'utilisateur a assez de jetons
 * 2. Déduit la mise
 * 3. Détermine si le joueur gagne ou perd
 * 4. Met à jour le jackpot et le solde en conséquence
 */
async function play(req, res) {
  try {
    const userId = req.user.userId;
    const { betAmount } = req.body;
    
    // Vérifier que le montant est fourni et valide
    if (!betAmount || typeof betAmount !== "number" || betAmount <= 0) {
      return res.status(400).json({
        error: "Montant invalide",
        message: "Le montant de la mise doit être un nombre positif"
      });
    }
    
    // Récupérer l'utilisateur
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "Utilisateur non trouvé",
        message: "L'utilisateur n'existe plus"
      });
    }
    
    // Vérifier que l'utilisateur a assez de jetons
    if (user.balance < betAmount) {
      return res.status(400).json({
        error: "Solde insuffisant",
        message: `Vous n'avez pas assez de jetons. Solde actuel : ${user.balance}`
      });
    }
    
    // Récupérer l'état du jeu
    const gameState = await GameState.getCurrentState();
    
    // Déduire la mise du solde de l'utilisateur
    user.balance -= betAmount;
    
    // Déterminer si le joueur gagne
    const hasWon = checkWin(betAmount);
    
    if (hasWon) {
      // Le joueur a gagné !
      const prize = gameState.current_jackpot;
      
      // Créditer le jackpot à l'utilisateur
      user.balance += prize;
      
      // Enregistrer la victoire dans l'historique
      await History.create({
        winner_name: user.username,
        amount: prize,
        created_at: new Date()
      });
      
      // Réinitialiser le jackpot à sa valeur par défaut (1000)
      gameState.current_jackpot = 1000;
      await gameState.save();
      
      // Sauvegarder les modifications de l'utilisateur
      await user.save();
      
      res.json({
        result: "win",
        prize: prize,
        currentJackpot: 1000,
        userBalance: user.balance
      });
    } else {
      // Le joueur a perdu
      // Ajouter la mise au jackpot
      gameState.current_jackpot += betAmount;
      await gameState.save();
      
      // Sauvegarder les modifications de l'utilisateur
      await user.save();
      
      res.json({
        result: "lose",
        prize: 0,
        currentJackpot: gameState.current_jackpot,
        userBalance: user.balance
      });
    }
  } catch (error) {
    console.error("Erreur lors du jeu:", error);
    res.status(500).json({
      error: "Erreur serveur",
      message: "Une erreur est survenue lors du jeu"
    });
  }
}

/**
 * Récupère l'historique des 10 derniers gagnants
 * Retourne la liste triée par date (plus récent en premier)
 */
async function getHistory(req, res) {
  try {
    const winners = await History.find()
      .sort({ created_at: -1 }) // Plus récent en premier
      .limit(10) // Maximum 10 résultats
      .select("winner_name amount created_at"); // Sélectionner seulement les champs nécessaires
    
    // Formater les dates pour l'affichage
    const formattedHistory = winners.map(winner => ({
      username: winner.winner_name,
      amount: winner.amount,
      date: winner.created_at.toISOString().replace("T", " ").substring(0, 16)
    }));
    
    res.json(formattedHistory);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique:", error);
    res.status(500).json({
      error: "Erreur serveur",
      message: "Impossible de récupérer l'historique"
    });
  }
}

module.exports = {
  getStatus,
  play,
  getHistory
};

