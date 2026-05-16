import mqtt from "mqtt";

import Device from "../models/Device.js";
import SensorData from "../models/SensorData.js";
import Alert from "../models/Alert.js";
import Log from "../models/Log.js";

let mqttClient = null;

export const getMQTTClient = () => mqttClient;

const setupMQTT = (io) => {
  mqttClient = mqtt.connect({
    host: process.env.MQTT_HOST,
    port: process.env.MQTT_PORT,
    protocol: "mqtts",
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
  });

  mqttClient.on("connect", () => {
    console.log("MQTT Connected");
    mqttClient.subscribe("iot/sensor");
    mqttClient.subscribe("iot/status");
  });

  mqttClient.on("error", (err) => {
    console.error("MQTT Error:", err.message);
  });

  mqttClient.on("message", async (topic, message) => {
    try {
      const data = JSON.parse(message.toString());

      if (topic === "iot/sensor") {
        const sensor = await SensorData.create({
          deviceId: data.deviceId,
          temperature: data.temperature,
          humidity: data.humidity,
        });

        io.emit("sensorUpdate", sensor);

        if (data.temperature > 40) {
          const alert = await Alert.create({
            deviceId: data.deviceId,
            message: `High Temperature Detected on device ${data.deviceId}`,
            severity: "high",
          });

          io.emit("alert", alert);
        }
      }

      if (topic === "iot/status") {
        const device = await Device.findOneAndUpdate(
          { deviceId: data.deviceId },
          {
            status: data.status,
            lastSeen: new Date(),
          },
          { new: true }
        );

        if (!device) {
          console.warn(`Device not found: ${data.deviceId}`);
          return;
        }

        io.emit("deviceStatus", device);

        await Log.create({
          deviceId: data.deviceId,
          action: `Device ${data.status}`,
        });
      }
    } catch (err) {
      console.error("MQTT message handling error:", err.message);
    }
  });

  return mqttClient;
};

export default setupMQTT;