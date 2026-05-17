import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";

import connectDB from "./config/db.js";
import { initSocket } from "./config/socket.js";
import setupMQTT from "./config/mqtt.js";

import authRoutes from "./routes/authRoutes.js";
import deviceRoutes from "./routes/deviceRoutes.js";
import sensorRoutes from "./routes/sensorRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import logRoutes from "./routes/logRoutes.js";

dotenv.config();

// Fail fast if required env vars are missing
const requiredEnv = ["MONGO_URI", "JWT_SECRET", "MQTT_HOST"];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

connectDB();

const app = express();

const ALLOWED_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: ALLOWED_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/logs", logRoutes);

app.get("/", (req, res) => {
  res.send("IoT TMS Backend Running 🚀");
});

// Global error handler — must be after all routes
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

const server = http.createServer(app);

// Pass the same origin to socket so CORS stays in sync
const io = initSocket(server, ALLOWED_ORIGIN);

setupMQTT(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});