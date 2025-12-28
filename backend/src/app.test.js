/**
 * Tests unitaires pour l'API du backend
 *
 * Ce fichier contient tous les tests pour vérifier le bon fonctionnement
 * des endpoints de l'application.
 */

// Définir NODE_ENV=test avant d'importer quoi que ce soit
process.env.NODE_ENV = "test";

const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

// Variables pour MongoDB Memory Server
let mongoServer;
let app;
let apiRoutes;

/**
 * Configuration avant tous les tests
 * Crée une base de données MongoDB en mémoire pour les tests
 */
beforeAll(async () => {
  // Créer une instance de MongoDB Memory Server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Se connecter à la base de données en mémoire
  await mongoose.connect(mongoUri);
  
  // Importer les routes APRÈS la connexion MongoDB
  apiRoutes = require("./routes");
  
  // Configuration de l'application de test
  app = express();
  app.use(express.json());
  app.use("/api", apiRoutes);
});

/**
 * Nettoyage après chaque test
 * Supprime toutes les données de la base de données de test
 */
afterEach(async () => {
  // Nettoyer toutes les collections
  const User = require("./models/User");
  const GameState = require("./models/GameState");
  const History = require("./models/History");
  
  await User.deleteMany({});
  await GameState.deleteMany({});
  await History.deleteMany({});
});

/**
 * Fermeture après tous les tests
 * Ferme la connexion MongoDB et arrête le serveur en mémoire
 */
afterAll(async () => {
  // Fermer la connexion MongoDB
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  
  // Arrêter le serveur MongoDB en mémoire
  if (mongoServer) {
    await mongoServer.stop();
  }
});

/**
 * Fonction helper pour créer un utilisateur de test et obtenir un token valide
 * @param {string} username - Nom d'utilisateur
 * @param {string} password - Mot de passe
 * @param {number} balance - Solde initial (optionnel, défaut: 100)
 * @returns {Promise<{user: Object, token: string}>} Utilisateur et token
 */
async function createTestUser(username = "testuser", password = "password123", balance = 100) {
  const User = require("./models/User");
  const { generateToken } = require("./utils/tokenUtils");
  const { createSession } = require("./utils/sessionStore");
  const bcrypt = require("bcrypt");
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = await User.create({
    username,
    password: hashedPassword,
    balance
  });
  
  const token = generateToken(user.username, user._id.toString());
  createSession(user._id.toString(), token, user.username);
  
  return { user, token };
}

// ============================================================================
// TESTS MODULE AUTHENTIFICATION & UTILISATEUR
// ============================================================================

describe("Module Authentification & Utilisateur", () => {
  /**
   * Test pour l'endpoint de connexion/inscription
   * Route : POST /api/auth/login
   */
  describe("POST /api/auth/login", () => {
    test("devrait créer un nouvel utilisateur si il n'existe pas", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          username: "newuser",
          password: "password123"
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("userId");
      expect(response.body).toHaveProperty("username", "newuser");
      expect(response.body).toHaveProperty("token");
      expect(typeof response.body.token).toBe("string");
    });

    test("devrait authentifier un utilisateur existant", async () => {
      // Créer un utilisateur d'abord
      await createTestUser("existinguser", "password123");
      
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          username: "existinguser",
          password: "password123"
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("username", "existinguser");
      expect(response.body).toHaveProperty("token");
    });

    test("devrait refuser un mot de passe incorrect", async () => {
      await createTestUser("testuser", "correctpassword");
      
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          username: "testuser",
          password: "wrongpassword"
        });

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("error");
    });
  });

  /**
   * Test pour l'endpoint d'informations utilisateur
   * Route : GET /api/user/me
   */
  describe("GET /api/user/me", () => {
    test("devrait retourner les informations de l'utilisateur connecté", async () => {
      const { user, token } = await createTestUser("testuser", "password123", 500);
      
      const response = await request(app)
        .get("/api/user/me")
        .set("Authorization", token);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("username", "testuser");
      expect(response.body).toHaveProperty("balance", 500);
    });

    test("devrait refuser sans token valide", async () => {
      const response = await request(app)
        .get("/api/user/me")
        .set("Authorization", "invalid-token");

      expect(response.statusCode).toBe(401);
    });
  });

  /**
   * Test pour l'endpoint de rechargement du compte
   * Route : POST /api/user/recharge
   */
  describe("POST /api/user/recharge", () => {
    test("devrait recharger le compte utilisateur", async () => {
      const { token } = await createTestUser("testuser", "password123", 100);
      
      const response = await request(app)
        .post("/api/user/recharge")
        .set("Authorization", token)
        .send({
          amount: 1000
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("newBalance", 1100);
    });
  });
});

// ============================================================================
// TESTS MODULE JEU (GAME LOGIC)
// ============================================================================

describe("Module Jeu (Game Logic)", () => {
  /**
   * Test pour l'endpoint de statut du jackpot
   * Route : GET /api/game/status
   */
  describe("GET /api/game/status", () => {
    test("devrait retourner l'état actuel du jackpot", async () => {
      const GameState = require("./models/GameState");
      // Créer un état de jeu initial
      await GameState.create({ current_jackpot: 5000 });
      
      const response = await request(app)
        .get("/api/game/status");

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("jackpot");
      expect(typeof response.body.jackpot).toBe("number");
      expect(response.body.jackpot).toBeGreaterThanOrEqual(0);
    });
  });

  /**
   * Test pour l'endpoint de jeu (lancer la loterie)
   * Route : POST /api/game/play
   */
  describe("POST /api/game/play", () => {
    test("devrait exécuter la logique du jeu", async () => {
      const { user, token } = await createTestUser("testuser", "password123", 1000);
      const User = require("./models/User");
      const GameState = require("./models/GameState");
      
      // Créer un état de jeu
      await GameState.create({ current_jackpot: 5000 });
      
      const response = await request(app)
        .post("/api/game/play")
        .set("Authorization", token)
        .send({
          betAmount: 50
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("result");
      expect(["win", "lose"]).toContain(response.body.result);
      expect(response.body).toHaveProperty("prize");
      expect(response.body).toHaveProperty("currentJackpot");
      expect(response.body).toHaveProperty("userBalance");
      
      // Vérifier que le solde a été déduit
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.balance).toBeLessThan(1000);
    });

    test("devrait refuser si le solde est insuffisant", async () => {
      const { token } = await createTestUser("testuser", "password123", 10);
      
      const response = await request(app)
        .post("/api/game/play")
        .set("Authorization", token)
        .send({
          betAmount: 100
        });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error", "Solde insuffisant");
    });
  });
});

// ============================================================================
// TESTS MODULE DONNÉES (HISTORIQUE)
// ============================================================================

describe("Module Données (Historique)", () => {
  /**
   * Test pour l'endpoint de l'historique des gains
   * Route : GET /api/game/history
   */
  describe("GET /api/game/history", () => {
    test("devrait retourner l'historique des gains", async () => {
      const History = require("./models/History");
      // Créer quelques entrées d'historique
      await History.create({
        winner_name: "alice",
        amount: 5000,
        created_at: new Date()
      });
      
      await History.create({
        winner_name: "bob",
        amount: 2300,
        created_at: new Date()
      });
      
      const response = await request(app)
        .get("/api/game/history");

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      if (response.body.length > 0) {
        const firstEntry = response.body[0];
        expect(firstEntry).toHaveProperty("username");
        expect(firstEntry).toHaveProperty("amount");
        expect(firstEntry).toHaveProperty("date");
      }
      
      // Vérifier que la liste ne dépasse pas 10 éléments
      expect(response.body.length).toBeLessThanOrEqual(10);
    });

    test("devrait retourner un tableau vide si aucun historique", async () => {
      const response = await request(app)
        .get("/api/game/history");

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });
});
