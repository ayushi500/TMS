import { useEffect, useState, useCallback } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DeviceCard from "../components/DeviceCard";
import SensorCard from "../components/SensorCard";
import StatsCard from "../components/StatsCard";
import AlertPanel from "../components/AlertPanel";
import LogsPanel from "../components/LogsPanel";
import AddDeviceModal from "../components/AddDeviceModal";

import socket from "../services/socket";
import { getDevices, getSensors } from "../services/deviceService";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

export default function Dashboard() {
  const { user } = useAuth();

  const [devices, setDevices] = useState([]);
  const [sensor, setSensor] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setError("");
      const [deviceData, sensorData, alertData, logData] = await Promise.all([
        getDevices(),
        getSensors(),
        API.get("/alerts"),
        API.get("/logs"),
      ]);

      setDevices(deviceData);
      setAlerts(alertData.data);
      setLogs(logData.data);

      if (sensorData.length > 0) {
        setSensor(sensorData[0]);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    const handleSensorUpdate = (data) => {
      setSensor(data);
    };

    const handleDeviceStatus = (updatedDevice) => {
      setDevices((prev) =>
        prev.map((d) => (d._id === updatedDevice._id ? updatedDevice : d))
      );
    };

    const handleAlert = (alert) => {
      setAlerts((prev) => [alert, ...prev]);
    };

    socket.on("sensorUpdate", handleSensorUpdate);
    socket.on("deviceStatus", handleDeviceStatus);
    socket.on("alert", handleAlert);

    return () => {
      socket.off("sensorUpdate", handleSensorUpdate);
      socket.off("deviceStatus", handleDeviceStatus);
      socket.off("alert", handleAlert);
    };
  }, [fetchData]);

  const onlineDevices = devices.filter((d) => d.status === "online").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <p className="text-xl">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-950 min-h-screen text-white">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            {user?.role === "admin" && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl"
              >
                Add Device
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-5 mb-6">
            <StatsCard title="Total Devices" value={devices.length} />
            <StatsCard title="Online Devices" value={onlineDevices} />
            <StatsCard
              title="Offline Devices"
              value={devices.length - onlineDevices}
            />
          </div>

          {sensor && (
            <div className="mb-6">
              <SensorCard sensor={sensor} />
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-5 mb-6">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">Devices</h2>

              {devices.length === 0 ? (
                <p className="text-slate-400">No devices registered yet.</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-5">
                  {devices.map((device) => (
                    <DeviceCard
                      key={device._id}
                      device={device}
                      refresh={fetchData}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-5">
              <AlertPanel alerts={alerts} />
              <LogsPanel logs={logs} />
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <AddDeviceModal
          onClose={() => setShowModal(false)}
          refresh={fetchData}
        />
      )}
    </div>
  );
}