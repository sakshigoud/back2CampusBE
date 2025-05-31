const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Service is running",
    timestamp: new Date(),
  });
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Back2Campus API",
    version: "1.0.0",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});