import fetch from 'src/fetch'
import * as tableUrl from '../constant/table'

// 数据列表
export const list = data => {
  return fetch({
    url: tableUrl.list,
    method: 'post',
    data
  })
}

// 通讯录列表
export const phoneNumber = (data) => {
  return fetch({
    url: tableUrl.phoneNumber,
    method: 'post',
    data
  })
}

// 短信列表
export const message = (data) => {
  return fetch({
    url: tableUrl.message,
    method: 'post',
    data
  })
}

// 删除用户
export const deleteInfo = (data) => {
  return fetch({
    url: tableUrl.deleteInfo,
    method: 'post',
    data
  })
}
