const User = require("../models/User");

/**
 * Récupère les informations de l'utilisateur connecté
 * Utilise req.user qui est défini par le middleware d'authentification
 */
async function getMe(req, res) {
  try {
    const userId = req.user.userId;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        error: "Utilisateur non trouvé",
        message: "L'utilisateur n'existe plus"
      });
    }
    
    res.json({
      username: user.username,
      balance: user.balance
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des infos utilisateur:", error);
    res.status(500).json({
      error: "Erreur serveur",
      message: "Impossible de récupérer les informations utilisateur"
    });
  }
}

/**
 * Recharge le compte de l'utilisateur avec un montant donné
 * Ajoute simplement le montant au solde actuel
 */
async function recharge(req, res) {
  try {
    const userId = req.user.userId;
    const { amount } = req.body;
    
    // Vérifier que le montant est fourni et valide
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        error: "Montant invalide",
        message: "Le montant doit être un nombre positif"
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
    
    // Ajouter le montant au solde
    user.balance += amount;
    await user.save();
    
    res.json({
      success: true,
      newBalance: user.balance
    });
  } catch (error) {
    console.error("Erreur lors du rechargement:", error);
    res.status(500).json({
      error: "Erreur serveur",
      message: "Impossible de recharger le compte"
    });
  }
}

module.exports = {
  getMe,
  recharge
};

