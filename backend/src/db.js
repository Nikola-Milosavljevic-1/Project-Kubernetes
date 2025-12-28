const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/lottery_db";

// Ne pas se connecter automatiquement si on est en mode test
// Les tests gèrent leur propre connexion avec mongodb-memory-server
if (process.env.NODE_ENV !== "test" && mongoose.connection.readyState === 0) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error(err));
}

module.exports = mongoose;
