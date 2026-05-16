import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import setupMQTT from "./config/mqtt.js";

import authRoutes from "./routes/authRoutes.js";
import deviceRoutes from "./routes/deviceRoutes.js";
import sensorRoutes from "./routes/sensorRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import logRoutes from "./routes/logRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/logs", logRoutes);
app.get('/', (req, res) => {
  res.send('IoT TMS Backend Running 🚀')
})

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

setupMQTT(io);

io.on("connection", (socket) => {
  console.log("Client Connected");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});