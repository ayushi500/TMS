import mqtt from "mqtt";

import Device from "../models/Device.js";
import SensorData from "../models/SensorData.js";
import Alert from "../models/Alert.js";
import Log from "../models/Log.js";

const setupMQTT = (io) => {
  const client = mqtt.connect({
    host: process.env.MQTT_HOST,
    port: process.env.MQTT_PORT,
    protocol: "mqtts",
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
  });

  client.on("connect", () => {
    console.log("MQTT Connected");

    client.subscribe("iot/sensor");
    client.subscribe("iot/status");
  });

  client.on("message", async (topic, message) => {
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
          message: "High Temperature Detected",
          severity: "high",
        });

        io.emit("alert", alert);
      }
    }

    if (topic === "iot/status") {
      const device = await Device.findByIdAndUpdate(
        data.deviceId,
        {
          status: data.status,
          lastSeen: new Date(),
        },
        { new: true }
      );

      io.emit("deviceStatus", device);

      await Log.create({
        deviceId: data.deviceId,
        action: `Device ${data.status}`,
      });
    }
  });

  return client;
};

export default setupMQTT;