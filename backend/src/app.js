const express = require("express");
const cors = require("cors");
require("./db");

const routes = require("./routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.get("/health", (req, res) => {
  res.send("OK");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
