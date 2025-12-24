const express = require("express");
const cors = require("cors");
const mongoose = require("./db");
const apiRoutes = require("./routes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

let dbConnectedDate = null;

mongoose.connection.on("connected", () => {
  dbConnectedDate = new Date();
  console.log("MongoDB connected at:", dbConnectedDate);
});

/**
 * Ne garde pas cette route en production !
 */
app.get("/health", (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  let message = "";

  if (isConnected && dbConnectedDate) {
    message = `Database connected at: ${dbConnectedDate.toISOString()}`;
  } else {
    message = "Database not connected";
  }

  res.send(message);
});

// Routes API
app.use("/api", apiRoutes);

app.listen(5050, () => {
  console.log("Backend running on port 5050");
});
