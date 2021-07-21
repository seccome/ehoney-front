/* eslint-disable */
import Vue from 'vue'
import axios from 'axios'
import { Message } from 'element-ui'
import env from '@/env.config.js'

axios.defaults.timeout = 15000
// axios.defaults.headers['x-requested-with'] = 'XMLHttpRequest'
axios.defaults.withCredentials = true

export const baseUrl = env[window.__env__ || 'default'].VUE_APP_API_URL

console.log('baseUrl', baseUrl)

axios.defaults.baseURL = baseUrl

// 添加请求拦截器
axios.interceptors.request.use(req => {
  req.url = req.url.includes('?') ? `${req.url}&t=${new Date().getTime()}` : `${req.url}?t=${new Date().getTime()}`

  return req
})

// 添加响应拦截器
axios.interceptors.response.use(res => {
  if (res.status !== 200) {
    Message.error('请求错误')

    // throw new Error('请求错误')
  }

  const { code, data, message } = res.data

  // 登陆失效
  if (code === 401) {
    const loginUrl = `${window.location.origin}/decept-defense/login`

    window.location.href = loginUrl
  }

  // 失败
  if (code === 1001) {
    Message.error(message)
    throw new Error(message)
  }

  return { message, code, data }
})

const REQUEST_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

const Server = function(url, method, params = {}) {
  const _params = JSON.parse(JSON.stringify(params)) || {}
  const _method = method.toUpperCase()
  const type = _method === 'GET' ? 'params' : 'data'

  if (REQUEST_METHODS.includes(_method)) {
    return axios({
      url,
      method: _method,
      [type]: _params,
    })
  }

  throw new Error(`暂不支持这个method：${method}`)
}

Vue.prototype.$Server = Server

export default Server
