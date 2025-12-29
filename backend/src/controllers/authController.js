const bcrypt = require("bcrypt");
const User = require("../models/User");
const { generateToken } = require("../utils/tokenUtils");
const { createSession } = require("../utils/sessionStore");

/**
 * Gère la connexion ou l'inscription d'un utilisateur
 * Si l'utilisateur n'existe pas, il est créé avec un solde de départ de 100 jetons
 * Si l'utilisateur existe, on vérifie le mot de passe
 */
async function login(req, res) {
  try {
    const { username, password } = req.body;
    // Vérification des champs requis
    if (!username || !password) {
      return res.status(400).json({
        error: "Champs manquants",
        message: "Le nom d'utilisateur et le mot de passe sont requis"
      });
    }
    // Vérifier si l'utilisateur existe déjà
    let user = await User.findOne({ username });
    if (!user) {
      // Créer un nouvel utilisateur
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({
        username,
        password: hashedPassword,
        balance: 100 // Solde de départ
      });
    } else {
      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          error: "Mot de passe incorrect",
          message: "Le mot de passe fourni est incorrect"
        });
      }
    }
    // Générer un token de session
    const token = generateToken(user.username, user._id.toString());
    // Créer la session
    createSession(user._id.toString(), token, user.username);

    // Retourner la réponse
    return res.json({
      userId: user._id,
      username: user.username,
      token
    });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);

    if (error.code === 11000) {
      // Erreur de duplication (username déjà pris)
      return res.status(400).json({
        error: "Nom d'utilisateur déjà utilisé",
        message: "Ce nom d'utilisateur est déjà pris"
      });
    }

    return res.status(500).json({
      error: "Erreur serveur",
      message: "Une erreur est survenue lors de la connexion"
    });
  }
}

module.exports = {
  login
};
