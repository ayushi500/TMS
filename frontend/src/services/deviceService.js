import API from '../api/axios'

export const getDevices = async () => {
  const response = await API.get('/devices')
  return response.data
}

export const toggleDevice = async (id) => {
  const response = await API.put(`/devices/toggle/${id}`)
  return response.data
}

export const getSensors = async () => {
  const response = await API.get('/sensors')
  return response.data
}