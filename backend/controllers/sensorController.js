import SensorData from "../models/SensorData.js";

export const getSensorData = async (req, res) => {
  try {
    const data = await SensorData.find()
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(data);
  } catch (error) {
    console.error("getSensorData error:", error.message);
    res.status(500).json({ message: "Failed to fetch sensor data" });
  }
};