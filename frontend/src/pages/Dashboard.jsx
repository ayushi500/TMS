import { useEffect, useState } from 'react'

import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import DeviceCard from '../components/DeviceCard'
import SensorCard from '../components/SensorCard'
import StatsCard from '../components/StatsCard'
import AlertPanel from '../components/AlertPanel'
import LogsPanel from '../components/LogsPanel'
import AddDeviceModal from '../components/AddDeviceModal'

import socket from '../services/socket'

import {
  getDevices,
  getSensors,
} from '../services/deviceService'

import API from '../api/axios'

export default function Dashboard() {
  const [devices, setDevices] = useState([])
  const [sensor, setSensor] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [logs, setLogs] = useState([])
  const [showModal, setShowModal] = useState(false)

  const user = JSON.parse(
    localStorage.getItem('user')
  )

  const fetchData = async () => {
    const deviceData = await getDevices()
    const sensorData = await getSensors()

    const alertData = await API.get('/alerts')
    const logData = await API.get('/logs')

    setDevices(deviceData)
    setAlerts(alertData.data)
    setLogs(logData.data)

    if (sensorData.length > 0) {
      setSensor(sensorData[0])
    }
  }

  useEffect(() => {
    fetchData()

    socket.on('sensorUpdate', (data) => {
      setSensor(data)
    })

    socket.on('deviceStatus', (updatedDevice) => {
      setDevices((prev) =>
        prev.map((d) =>
          d._id === updatedDevice._id
            ? updatedDevice
            : d
        )
      )
    })

    socket.on('alert', (alert) => {
      setAlerts((prev) => [alert, ...prev])
    })

    return () => {
      socket.off('sensorUpdate')
      socket.off('deviceStatus')
      socket.off('alert')
    }
  }, [])

  const onlineDevices = devices.filter(
    (d) => d.status === 'online'
  ).length

  return (
    <div className='flex bg-slate-950 min-h-screen text-white'>
      <Sidebar />

      <div className='flex-1'>
        <Navbar />

        <div className='p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h1 className='text-3xl font-bold'>
              Dashboard
            </h1>

            {user?.role === 'admin' && (
              <button
                onClick={() => setShowModal(true)}
                className='bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl'
              >
                Add Device
              </button>
            )}
          </div>

          <div className='grid md:grid-cols-3 gap-5 mb-6'>
            <StatsCard title='Total Devices' value={devices.length} />
            <StatsCard title='Online Devices' value={onlineDevices} />
            <StatsCard title='Offline Devices' value={devices.length - onlineDevices} />
          </div>

          {sensor && (
            <div className='mb-6'>
              <SensorCard sensor={sensor} />
            </div>
          )}

          <div className='grid lg:grid-cols-3 gap-5 mb-6'>
            <div className='lg:col-span-2'>
              <h2 className='text-2xl font-bold mb-4'>Devices</h2>

              <div className='grid md:grid-cols-2 gap-5'>
                {devices.map((device) => (
                  <DeviceCard
                    key={device._id}
                    device={device}
                    refresh={fetchData}
                  />
                ))}
              </div>
            </div>

            <div className='space-y-5'>
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
  )
}