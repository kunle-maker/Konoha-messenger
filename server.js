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

function getBaseUrl(req) {
  return `${req.protocol}://${req.get('host')}`;
}

function startSelfPing(app) {
  let baseUrl = null;
  
  app.use((req, res, next) => {
    if (!baseUrl) {
      baseUrl = getBaseUrl(req);
      console.log(`Detected base URL: ${baseUrl}`);
      startPingInterval();
    }
    next();
  });
  
  function startPingInterval() {
    // Ping every 5 minutes (300,000 ms)
    setInterval(async () => {
      try {
        if (baseUrl) {
          const response = await axios.get(`${baseUrl}/health`);
          console.log(`Self-ping successful: ${response.status}`);
        }
      } catch (error) {
        console.log('Self-ping failed (this is normal during initial deployment)');
      }
    }, 300000);
  }
}

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

// Start self-pinging functionality
startSelfPing(app);

  app.listen(PORT, () => {
    console.log(`running on ${PORT}`);
    console.log(`Access: http://${ip}:${PORT}`);
  });
})();