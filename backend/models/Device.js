import mongoose from "mongoose";

const deviceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    deviceId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    type: {
      type: String,
      required: true,
      trim: true,
    },

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