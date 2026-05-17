import { useState } from 'react'
import API from '../api/axios'

export default function AddDeviceModal({ onClose, refresh }) {
  const [form, setForm] = useState({
    name: '',
    deviceId: '',
    type: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setError('')
      setLoading(true)
      await API.post('/devices', form)
      refresh()
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add device')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 bg-black/70 flex justify-center items-center z-50'>
      <div className='bg-slate-900 p-6 rounded-2xl w-full max-w-md border border-slate-800'>
        <h2 className='text-2xl font-bold mb-5'>Add Device</h2>

        {error && (
          <div className='bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-4'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <input
            type='text'
            name='name'
            placeholder='Device Name'
            onChange={handleChange}
            className='w-full bg-slate-800 p-3 rounded-lg'
            required
          />

          <input
            type='text'
            name='deviceId'
            placeholder='Device ID'
            onChange={handleChange}
            className='w-full bg-slate-800 p-3 rounded-lg'
            required
          />

          <input
            type='text'
            name='type'
            placeholder='Device Type'
            onChange={handleChange}
            className='w-full bg-slate-800 p-3 rounded-lg'
            required
          />

          <div className='flex gap-3'>
            <button
              type='submit'
              disabled={loading}
              className='flex-1 bg-green-600 hover:bg-green-700 p-3 rounded-lg disabled:opacity-50'
            >
              {loading ? 'Adding...' : 'Add'}
            </button>

            <button
              type='button'
              onClick={onClose}
              className='flex-1 bg-red-600 hover:bg-red-700 p-3 rounded-lg'
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}