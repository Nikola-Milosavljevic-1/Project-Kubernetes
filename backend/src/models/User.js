const mongoose = require("mongoose");

/**
 * Modèle pour les utilisateurs de la plateforme
 * Stocke les informations de base d'un joueur : nom, mot de passe et solde
 */
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  balance: {
    type: Number,
    required: true,
    default: 100,
    min: 0
  }
}, {
  timestamps: true // Ajoute automatiquement createdAt et updatedAt
});

// L'index est déjà créé par unique: true, pas besoin d'en créer un autre

const User = mongoose.model("User", userSchema);

module.exports = User;

