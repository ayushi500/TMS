import mongoose from "mongoose";

const logSchema = mongoose.Schema(
  {
    deviceId: String,

    action: String,
  },
  { timestamps: true }
);

export default mongoose.model("Log", logSchema);