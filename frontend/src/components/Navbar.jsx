import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { logout } = useAuth()

  return (
    <div className='bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center'>
      <h1 className='text-xl font-bold'>IoT Terminal Management System</h1>

      <button
        onClick={logout}
        className='bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg'
      >
        Logout
      </button>
    </div>
  )
}