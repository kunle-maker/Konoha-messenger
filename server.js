const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

(async () => {
let ip = "127.0.0.1";
try {
  ip = (await axios.get("https://api.ipify.org?format=json")).data.ip;
} catch {
  console.log("⚠️ IP fetch failed. Using 127.0.0.1");
}

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, "frontend")))

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

  app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

  app.listen(PORT, () => {
    console.log(`running on ${PORT}`);
    console.log(`Access: http://${ip}:${PORT}`);
  });
})();