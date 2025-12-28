const mongoose = require("mongoose");

/**
 * Modèle pour l'état global du jeu
 * Il n'y a qu'un seul document dans cette collection qui représente
 * le jackpot actuel de la loterie
 */
const gameStateSchema = new mongoose.Schema({
  current_jackpot: {
    type: Number,
    required: true,
    default: 1000,
    min: 0
  }
}, {
  timestamps: true
});

const GameState = mongoose.model("GameState", gameStateSchema);

/**
 * Fonction helper pour récupérer ou créer l'état du jeu
 * S'assure qu'il n'y a qu'un seul document d'état de jeu
 * 
 * @returns {Promise} L'état du jeu (document MongoDB)
 */
async function getCurrentState() {
  let state = await GameState.findOne();
  
  // Si aucun état n'existe, on en crée un avec la valeur par défaut
  if (!state) {
    state = await GameState.create({ current_jackpot: 1000 });
  }
  
  return state;
}

// Ajouter la méthode statique au modèle pour compatibilité avec le code existant
// @ts-ignore - TypeScript ne reconnaît pas les méthodes ajoutées dynamiquement
GameState.getCurrentState = getCurrentState;

module.exports = GameState;

