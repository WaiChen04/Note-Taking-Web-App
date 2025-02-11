import axios from 'axios'

const baseUrl = '/api/notes'


let token = null


const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async (userId) => {
  const request = axios.get(`/api/users/${userId}`)
  return request.then(response => response.data)
}


const create = newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const request = axios.post(baseUrl, newObject, config)
  return request.then(response => response.data)
}

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`).then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${ baseUrl }/${id}`, newObject)
  return request.then(response => response.data)
}


export default { getAll, create, remove, update, setToken }
