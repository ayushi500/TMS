import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/authService'

export default function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      setLoading(true)
      setError('')
      await registerUser(form)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-950 px-4'>
      <div className='bg-slate-900 w-full max-w-md p-8 rounded-2xl shadow-xl border border-slate-800'>
        <h1 className='text-3xl font-bold text-center mb-2'>
          Create Account
        </h1>

        <p className='text-slate-400 text-center mb-6'>
          Register for IoT TMS
        </p>

        {error && (
          <div className='bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-4'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <input
            type='text'
            name='name'
            placeholder='Full Name'
            value={form.name}
            onChange={handleChange}
            className='w-full bg-slate-800 border border-slate-700 p-3 rounded-lg outline-none'
            required
          />

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
            placeholder='Password (min 6 characters)'
            value={form.password}
            onChange={handleChange}
            minLength={6}
            className='w-full bg-slate-800 border border-slate-700 p-3 rounded-lg outline-none'
            required
          />

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-green-600 hover:bg-green-700 transition p-3 rounded-lg font-semibold disabled:opacity-50'
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className='text-center text-slate-400 mt-6'>
          Already have an account?{' '}
          <Link to='/' className='text-blue-400 hover:underline'>
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}