import Log from "../models/Log.js";

export const getLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    console.error("getLogs error:", error.message);
    res.status(500).json({ message: "Failed to fetch logs" });
  }
};