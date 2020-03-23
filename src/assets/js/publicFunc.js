import routes from '@/route/routes'
import ErrorPage from '@/pages/public/errorPage'
import store from '@/redux/store'

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
 * 页签关闭操作回调
 * @param {object} history 路由history对象。不能new新实例，不然参数无法传递
 * @param {string} returnUrl 返回地址
 * @param {function} cb 回调操作，可选
 */
export const closeTabAction = (history, returnUrl = '/', cb) => {
  const { curTab } = store.getState().storeData
  const { href } = window.location
  const pathname = href.split('#')[1]
  // 删除tab
  const tabArr = JSON.parse(JSON.stringify(curTab))
  const delIndex = tabArr.findIndex((item) => item === pathname)
  tabArr.splice(delIndex, 1)

  // 如果要返回的页面被关闭了，再加进去
  if (!tabArr.includes(returnUrl)) {
    tabArr.push(returnUrl)
  }

  // 储存新的tabs数组
  const action = store.dispatch({
    type: 'SET_CURTAB',
    payload: tabArr
  })
  // 刷新回调
  const callback = () => {
    if (cb && typeof cb === 'function') {
      return cb
    }
    return history.push({
      pathname: returnUrl,
      params: { reload: true }
    })
  }

  asyncAction(action)(callback)
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
