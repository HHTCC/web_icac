/**
 * @intro: http统一封装,同时支持callback模式调用.
 */
import axios from 'axios'
import { serverBaseUrl, homePage } from 'src/common/setting'
import { Message } from 'element-ui'
import queryString from 'src/common/queryString'

// 默认get请求
const DEFAULT_METHOD = 'get'

const Http = async options => {
  // eslint-disable-next-line
    if (!options) throw '请求参数不能为空！'
  if (typeof options === 'string') options = { url: options }

  const {
    before, // 请求开始之前的函数
    success, // 请求成功的函数
    error, // 请求失败，如果是系统错误(500,400)则type为system，其他为business
    complete, // 请求完成，这里不管成功还是失败都会执行
    method = DEFAULT_METHOD, // 请求方式，默认为get
    // params = {}, // get请求参数
    data = {} // 非get请求参数
  } = options

  // 请求之前调用一次
  before && before(options)

  if (method.toLowerCase() !== DEFAULT_METHOD) {
    // 将参数转成form表单的形式
    options.data = queryString(data)
  }

  // https://github.com/mzabriskie/axios
  // 创建一个axios实例
  const instance = axios.create({
    // 设置全局默认的headers
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'token': sessionStorage.getItem('token'),
      'account': sessionStorage.getItem('account')
    },
    // 设置默认根地址
    baseURL: serverBaseUrl,
    // 设置请求超时设置
    timeout: 30000,
    // 返回类型json
    responseType: 'json'
    // 允许在 then / catch之前对响应数据进行更改
    // transformResponse: [function (data) {
    //   return {code: data.code, data: JSON.parse(data)}
    // }]
  })
  try {
    // 开始请求
    const response = await instance(options)
    /**
     * code非0是抛错
    */
    console.log('http: response', response)
    const data = response.data
    
    if (data.code === 0) {
      console.log('http: response success', data)
      // 请求成功
      success && success(data)
      return Promise.resolve(data)
    } else {
      if (data.code == 999) {
        // 用户登录失效
        Message.error('会话过期，即将自动跳转到登录页！')
        setTimeout(() => {
          sessionStorage.clear()
          this.$router.replace(homePage)
        }, 1000)
      } else {
        Message.error(data.data || '')
      }
      // const errorObj = { type: 'business', ...data }
      // console.log('http: response error', errorObj)
      // 失败
      // error && error(errorObj)
      // return Promise.reject(errorObj)
    }
  } catch (err) {
    let resError = err.response || {}
    let resCode = resError.status || '500'
    let resMsg = err.message || '操作失败，请稍后重试!'
    const errorObj = { code: resCode, message: resMsg, type: 'system' }
    console.log('http: response error', errorObj)
    error && error(errorObj)
    return Promise.reject(errorObj)
  } finally {
    console.log('http: complete')
    complete && complete()
  }
}

export default Http
