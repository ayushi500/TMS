import mongoose from "mongoose";

const alertSchema = mongoose.Schema(
  {
    deviceId: {
      type: String,
      default: null,
    },

    message: String,

    severity: {
      type: String,
      enum: ["low", "medium", "high"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Alert", alertSchema);