import SensorData from "../models/SensorData.js";

export const getSensorData = async (req, res) => {
  const data = await SensorData.find()
    .sort({ createdAt: -1 })
    .limit(20);

  res.json(data);
};