import { toggleDevice } from '../services/deviceService'

export default function DeviceCard({ device, refresh }) {
  const handleToggle = async () => {
    await toggleDevice(device._id)
    refresh()
  }

  return (
    <div className='bg-slate-900 p-5 rounded-2xl border border-slate-800'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-xl font-bold'>
            {device.name}
          </h2>

          <p className='text-slate-400'>
            {device.type}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-sm ${
            device.status === 'online'
              ? 'bg-green-600'
              : 'bg-red-600'
          }`}
        >
          {device.status}
        </span>
      </div>

      <div className='mt-5'>
        <p>
          Relay State:{' '}
          <span className='font-bold'>
            {device.relayState ? 'ON' : 'OFF'}
          </span>
        </p>
      </div>

      <button
        onClick={handleToggle}
        className='w-full mt-4 bg-blue-600 hover:bg-blue-700 p-3 rounded-lg'
      >
        Toggle Device
      </button>
    </div>
  )
}