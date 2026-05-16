import { Link } from 'react-router-dom'

export default function Sidebar() {
  return (
    <div className='w-64 bg-slate-900 border-r border-slate-800 min-h-screen p-5 hidden md:block'>
      <h2 className='text-2xl font-bold mb-8'>Dashboard</h2>

      <ul className='space-y-4 text-slate-300'>
        <li>
          <Link to='/dashboard' className='hover:text-white'>
            Devices
          </Link>
        </li>

        <li>
          <Link to='/dashboard' className='hover:text-white'>
            Sensors
          </Link>
        </li>

        <li>
          <Link to='/dashboard' className='hover:text-white'>
            Alerts
          </Link>
        </li>

        <li>
          <Link to='/dashboard' className='hover:text-white'>
            Logs
          </Link>
        </li>
      </ul>
    </div>
  )
}