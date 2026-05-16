import express from "express";

import { getLogs } from "../controllers/logController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getLogs);

export default router;