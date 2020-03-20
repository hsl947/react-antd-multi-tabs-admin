/* eslint-disable no-param-reassign */
import routes from '@/route/routes'
import ErrorPage from '@/pages/public/errorPage'

/**
 * 以递归的方式展平react router数组
 * @param {object[]} arr 路由数组
 */
export const flattenRoutes = (arr) =>
  arr.reduce((prev, item) => {
    prev.push(item)
    return prev.concat(
      Array.isArray(item.routes) ? flattenRoutes(item.routes) : item
    )
  }, [])

/**
 * 根据路径获取路由的name和key
 * @param {string} path 路由
 */
export const getKeyName = (path = '/403') => {
  const truePath = path.split('?')[0]
  const curRoute = flattenRoutes(routes).filter((item) =>
    item.path.includes(truePath)
  )
  if (!curRoute[0])
    return { title: '暂无权限', tabKey: '403', component: ErrorPage }
  const { name, key, component } = curRoute[0]
  return { title: name, tabKey: key, component }
}

/**
 * 同步执行操作，Currying
 * @param {*} action 要执行的操作
 * @param {function} cb 下一步操作回调
 */
export const asyncAction = (action) => {
  const wait = new Promise((resolve) => {
    resolve(action)
  })
  return (cb) => {
    wait.then(() => setTimeout(() => cb()))
  }
}

/**
 * 获取地址栏 ?参数，返回键值对对象
 */
export const getQuery = () => {
  const { href } = window.location
  const query = href.split('?')
  if (!query[1]) return {}

  const queryArr = decodeURI(query[1]).split('&')
  const queryObj = queryArr.reduce((prev, next) => {
    const item = next.split('=')
    return { ...prev, [item[0]]: item[1] }
  }, {})
  return queryObj
}
