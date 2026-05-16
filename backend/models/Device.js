import mongoose from "mongoose";

const deviceSchema = mongoose.Schema(
  {
    name: String,

    deviceId: String,

    type: String,

    status: {
      type: String,
      default: "offline",
    },

    relayState: {
      type: Boolean,
      default: false,
    },

    lastSeen: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Device", deviceSchema);