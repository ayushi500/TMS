import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../services/authService'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError('')

      const data = await loginUser(form)

      login(data)

      navigate('/dashboard')
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Login failed'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-950 px-4'>
      <div className='bg-slate-900 w-full max-w-md p-8 rounded-2xl shadow-xl border border-slate-800'>
        <h1 className='text-3xl font-bold text-center mb-2'>
          IoT TMS Login
        </h1>

        <p className='text-slate-400 text-center mb-6'>
          Sign in to your dashboard
        </p>

        {error && (
          <div className='bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-4'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <input
            type='email'
            name='email'
            placeholder='Email'
            value={form.email}
            onChange={handleChange}
            className='w-full bg-slate-800 border border-slate-700 p-3 rounded-lg outline-none'
            required
          />

          <input
            type='password'
            name='password'
            placeholder='Password'
            value={form.password}
            onChange={handleChange}
            className='w-full bg-slate-800 border border-slate-700 p-3 rounded-lg outline-none'
            required
          />

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-semibold'
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className='text-center text-slate-400 mt-6'>
          Don't have an account?{' '}
          <Link
            to='/register'
            className='text-blue-400 hover:underline'
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}