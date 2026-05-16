import express from "express";

import { getSensorData } from "../controllers/sensorController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getSensorData);

export default router;