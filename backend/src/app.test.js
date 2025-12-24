/**
 * Tests unitaires pour l'API du backend
 *
 * Ce fichier contient tous les tests pour vérifier le bon fonctionnement
 * des endpoints de l'application. Les tests vérifient également si les API
 * sont en mode développement (retournent un champ 'test').
 */

const request = require("supertest");
const express = require("express");
const apiRoutes = require("./routes");

// Configuration de l'application de test
const app = express();
app.use(express.json());
app.use("/api", apiRoutes);

/**
 * Fonction utilitaire pour vérifier si une réponse est en mode test
 * @param {Object} response - La réponse de l'API
 * @param {String} apiName - Le nom de l'API testée
 * @returns {Boolean} - True si c'est une réponse de test
 */
function checkTestMode(response, apiName) {
  if (response.body.test === true) {
    console.warn(`⚠️  WARNING: ${apiName} API attend développement`);
    return true;
  }
  return false;
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
    test("devrait authentifier un utilisateur ou retourner un message de test", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          username: "testuser",
          password: "password123"
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeDefined();

      // Vérifier si en mode test ou en production
      if (!checkTestMode(response, "POST /api/auth/login")) {
        // Si pas en mode test, vérifier la structure de la réponse normale
        expect(response.body).toHaveProperty("userId");
        expect(response.body).toHaveProperty("username");
        expect(response.body).toHaveProperty("token");
        expect(typeof response.body.userId).toBe("number");
        expect(typeof response.body.username).toBe("string");
        expect(typeof response.body.token).toBe("string");
      }
    });
  });

  /**
   * Test pour l'endpoint d'informations utilisateur
   * Route : GET /api/user/me
   */
  describe("GET /api/user/me", () => {
    test("devrait retourner les informations de l'utilisateur ou un message de test", async () => {
      const response = await request(app)
        .get("/api/user/me")
        .set("Authorization", "session-token-xyz");

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeDefined();

      // Vérifier si en mode test ou en production
      if (!checkTestMode(response, "GET /api/user/me")) {
        // Si pas en mode test, vérifier la structure de la réponse normale
        expect(response.body).toHaveProperty("username");
        expect(response.body).toHaveProperty("balance");
        expect(typeof response.body.username).toBe("string");
        expect(typeof response.body.balance).toBe("number");
      }
    });
  });

  /**
   * Test pour l'endpoint de rechargement du compte
   * Route : POST /api/user/recharge
   */
  describe("POST /api/user/recharge", () => {
    test("devrait recharger le compte utilisateur ou retourner un message de test", async () => {
      const response = await request(app)
        .post("/api/user/recharge")
        .set("Authorization", "session-token-xyz")
        .send({
          amount: 1000
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeDefined();

      // Vérifier si en mode test ou en production
      if (!checkTestMode(response, "POST /api/user/recharge")) {
        // Si pas en mode test, vérifier la structure de la réponse normale
        expect(response.body).toHaveProperty("success");
        expect(response.body).toHaveProperty("newBalance");
        expect(response.body.success).toBe(true);
        expect(typeof response.body.newBalance).toBe("number");
      }
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
    test("devrait retourner l'état actuel du jackpot ou un message de test", async () => {
      const response = await request(app)
        .get("/api/game/status");

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeDefined();

      // Vérifier si en mode test ou en production
      if (!checkTestMode(response, "GET /api/game/status")) {
        // Si pas en mode test, vérifier la structure de la réponse normale
        expect(response.body).toHaveProperty("jackpot");
        expect(typeof response.body.jackpot).toBe("number");
        expect(response.body.jackpot).toBeGreaterThanOrEqual(0);
      }
    });
  });

  /**
   * Test pour l'endpoint de jeu (lancer la loterie)
   * Route : POST /api/game/play
   */
  describe("POST /api/game/play", () => {
    test("devrait exécuter la logique du jeu ou retourner un message de test", async () => {
      const response = await request(app)
        .post("/api/game/play")
        .set("Authorization", "session-token-xyz")
        .send({
          betAmount: 50
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeDefined();

      // Vérifier si en mode test ou en production
      if (!checkTestMode(response, "POST /api/game/play")) {
        // Si pas en mode test, vérifier la structure de la réponse normale
        expect(response.body).toHaveProperty("result");
        expect(response.body).toHaveProperty("prize");
        expect(response.body).toHaveProperty("currentJackpot");
        expect(response.body).toHaveProperty("userBalance");

        // Vérifier que result est soit "win" soit "lose"
        expect(["win", "lose"]).toContain(response.body.result);

        // Vérifier les types
        expect(typeof response.body.prize).toBe("number");
        expect(typeof response.body.currentJackpot).toBe("number");
        expect(typeof response.body.userBalance).toBe("number");

        // Si gagné, le prize doit être > 0
        if (response.body.result === "win") {
          expect(response.body.prize).toBeGreaterThan(0);
        }
      }
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
    test("devrait retourner l'historique des gains ou un message de test", async () => {
      const response = await request(app)
        .get("/api/game/history");

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeDefined();

      // Vérifier si en mode test ou en production
      if (!checkTestMode(response, "GET /api/game/history")) {
        // Si pas en mode test, vérifier la structure de la réponse normale
        expect(Array.isArray(response.body)).toBe(true);

        // Si l'historique n'est pas vide, vérifier la structure d'un élément
        if (response.body.length > 0) {
          const firstEntry = response.body[0];
          expect(firstEntry).toHaveProperty("username");
          expect(firstEntry).toHaveProperty("amount");
          expect(firstEntry).toHaveProperty("date");
          expect(typeof firstEntry.username).toBe("string");
          expect(typeof firstEntry.amount).toBe("number");
          expect(typeof firstEntry.date).toBe("string");
        }

        // Vérifier que la liste ne dépasse pas 10 éléments
        expect(response.body.length).toBeLessThanOrEqual(10);
      }
    });
  });
});
