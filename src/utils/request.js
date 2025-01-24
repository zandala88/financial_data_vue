import axios from 'axios'
import router from '@/router'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: 'http://110.41.11.12:8877/api/v1',
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.token = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    if (response.data.code === 403) {
      ElMessage.error('登录已过期，请重新登录')
      localStorage.removeItem('token')
      router.push('/login')
      return Promise.reject(new Error('无效的Token'))
    }
    return response.data
  },
  error => {
    return Promise.reject(error)
  }
)

export default request 