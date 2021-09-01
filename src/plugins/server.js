/* eslint-disable */
import Vue from 'vue'
import axios from 'axios'
import apiList from './apiList.js';
import { Message } from 'element-ui'

axios.defaults.timeout = 120000
axios.defaults.withCredentials = true

// 添加请求拦截器
axios.interceptors.request.use(req => {
  req.url = req.url.includes('?') ? `${req.url}&t=${new Date().getTime()}` : `${req.url}?t=${new Date().getTime()}`;
  req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  return req;
})

// 添加响应拦截器
axios.interceptors.response.use(res => {
  if (res.status !== 200) {
    Message.error('请求错误')
    return Promise.reject(res)
  }

  const { code, msg } = res.data
  if (code === 200) {
    return res.data;
  } else {
    // 登录过期
    if (code === 401) {
      window.location.href = `${window.location.origin}/decept-defense/login`;
    } else {
      Message.error(msg);
    }
    return Promise.reject(res.data)
  }
}, (error) => {
  console.log(error);
  return Promise.reject(error.response.data)
})

/* const REQUEST_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

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
} */

Vue.prototype.$axios = axios;
Vue.prototype.$apis = apiList;

// export default Server
