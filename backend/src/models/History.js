const mongoose = require("mongoose");

/**
 * Modèle pour l'historique des gains
 * Enregistre chaque victoire avec le nom du gagnant, le montant et la date
 */
const historySchema = new mongoose.Schema({
  winner_name: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances lors de la récupération des derniers gains
historySchema.index({ created_at: -1 });

const History = mongoose.model("History", historySchema);

module.exports = History;

