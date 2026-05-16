import Device from '../models/Device.js'
import mqtt from 'mqtt'

const mqttClient = mqtt.connect({
  host: process.env.MQTT_HOST,
  port: process.env.MQTT_PORT,
  protocol: 'mqtts',
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
})

export const getDevices = async (req, res) => {
  const devices = await Device.find()
  res.json(devices)
}

export const addDevice = async (req, res) => {
  const device = await Device.create(req.body)
  res.json(device)
}

export const toggleRelay = async (req, res) => {
  const device = await Device.findById(req.params.id)

  if (!device) {
    return res.status(404).json({
      message: 'Device not found',
    })
  }

  device.relayState = !device.relayState
  await device.save()

  mqttClient.publish(
    `iot/device/${device.deviceId}`,
    JSON.stringify({
      relayState: device.relayState,
    })
  )

  res.json(device)
}