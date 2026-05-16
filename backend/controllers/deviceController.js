import Device from "../models/Device.js";

export const getDevices = async (req, res) => {
  const devices = await Device.find();

  res.json(devices);
};

export const addDevice = async (req, res) => {
  const device = await Device.create(req.body);

  res.json(device);
};

export const toggleRelay = async (req, res) => {
  const device = await Device.findById(req.params.id);

  device.relayState = !device.relayState;

  await device.save();

  res.json(device);
};