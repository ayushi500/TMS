import Device from "../models/Device.js";
import { getMQTTClient } from "../config/mqtt.js";

export const getDevices = async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (error) {
    console.error("getDevices error:", error.message);
    res.status(500).json({ message: "Failed to fetch devices" });
  }
};

export const addDevice = async (req, res) => {
  try {
    const { name, deviceId, type } = req.body;

    if (!name || !deviceId || !type) {
      return res
        .status(400)
        .json({ message: "name, deviceId, and type are required" });
    }

    const exists = await Device.findOne({ deviceId });
    if (exists) {
      return res
        .status(400)
        .json({ message: "A device with this deviceId already exists" });
    }

    const device = await Device.create({ name, deviceId, type });
    res.status(201).json(device);
  } catch (error) {
    console.error("addDevice error:", error.message);
    res.status(500).json({ message: "Failed to add device" });
  }
};

export const toggleRelay = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    device.relayState = !device.relayState;
    await device.save();

    const mqttClient = getMQTTClient();
    if (mqttClient && mqttClient.connected) {
      mqttClient.publish(
        `iot/device/${device.deviceId}`,
        JSON.stringify({ relayState: device.relayState })
      );
    } else {
      console.warn("MQTT client not connected — relay command not sent");
    }

    res.json(device);
  } catch (error) {
    console.error("toggleRelay error:", error.message);
    res.status(500).json({ message: "Failed to toggle relay" });
  }
};