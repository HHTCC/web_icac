import fetch from 'src/fetch'
import * as userUrl from '../constant/user'

// 登录
export const login = (data) => {
  return fetch({
    url: userUrl.login,
    method: 'post',
    data
  })
}
// 登出
export const logout = () => {
  return fetch({
    url: userUrl.logout,
    method: 'get'
  })
}
// 是否登录
export const home = () => {
  return fetch({
    url: userUrl.home,
    method: 'get'
  })
}
export const getIosEnable = () => {
  return fetch({
    url: userUrl.getIosEnable,
    method: 'post'
  })
}
export const updateIosEnable = (data) => {
  return fetch({
    url: userUrl.updateIosEnable,
    method: 'post',
    data
  })
}
