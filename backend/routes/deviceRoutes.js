import express from "express";

import {
  getDevices,
  addDevice,
  toggleRelay,
} from "../controllers/deviceController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getDevices);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  addDevice
);

router.put(
  "/toggle/:id",
  authMiddleware,
  toggleRelay
);

export default router;