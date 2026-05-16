import mongoose from "mongoose";

const alertSchema = mongoose.Schema(
  {
    message: String,

    severity: {
      type: String,
      enum: ["low", "medium", "high"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Alert", alertSchema);