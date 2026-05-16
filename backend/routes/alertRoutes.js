import express from "express";

import { getAlerts } from "../controllers/alertController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAlerts);

export default router;