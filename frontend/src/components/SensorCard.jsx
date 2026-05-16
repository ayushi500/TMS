export default function SensorCard({ sensor }) {
  return (
    <div className='bg-slate-900 p-5 rounded-2xl border border-slate-800'>
      <h2 className='font-bold text-xl mb-4'>Sensor Data</h2>

      <div className='space-y-2'>
        <p>
          🌡 Temperature:{' '}
          <span className='font-bold'>
            {sensor.temperature}°C
          </span>
        </p>

        <p>
          💧 Humidity:{' '}
          <span className='font-bold'>
            {sensor.humidity}%
          </span>
        </p>
      </div>
    </div>
  )
}