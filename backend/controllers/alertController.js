import Alert from "../models/Alert.js";

export const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    console.error("getAlerts error:", error.message);
    res.status(500).json({ message: "Failed to fetch alerts" });
  }
};