import mongoose from "mongoose";

const sensorSchema = mongoose.Schema(
  {
    deviceId: String,

    temperature: Number,

    humidity: Number,
  },
  { timestamps: true }
);

export default mongoose.model("SensorData", sensorSchema);