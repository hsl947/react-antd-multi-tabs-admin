/* eslint-disable no-param-reassign */
import { Modal } from 'antd'
import routes from '@/route/routes'
import ErrorPage from '@/pages/public/errorPage'
import { store } from '@/store'

// 通用confirm方法
export const commonConfirm = (title: string, cb: () => void) => {
  const { confirm } = Modal
  confirm({
    okText: '确定',
    cancelText: '取消',
    title,
    onOk() {
      cb()
    },
    onCancel() {}
  })
}

/**
 * 隐藏手机号码
 * @param {string} phone 手机号
 */
export const hidePhone = (phone: string) =>
  phone && phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')

/**
 * 以递归的方式展平react router数组
 * @param {object[]} arr 路由数组
 * @param {string} child 需要递归的字段名
 */
export const flattenRoutes = (arr: CommonObjectType<unknown>[]) =>
  arr.reduce(
    (prev: CommonObjectType<unknown>[], item: CommonObjectType<unknown>) => {
      if (Array.isArray(item.routes)) {
        prev.push(item)
      }
      return prev.concat(
        Array.isArray(item.routes) ? flattenRoutes(item.routes) : item
      )
    },
    []
  )

/**
 * 根据路径获取路由的name和key
 * @param {string} path 路由
 */
export const getKeyName = (path: string = '/403') => {
  const truePath = path.split('?')[0]
  const curRoute = flattenRoutes(routes).filter(
    (item: { path: string | string[] }) => item.path.includes(truePath)
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
export const asyncAction = (action: unknown) => {
  const wait = new Promise((resolve) => {
    resolve(action)
  })
  return (cb: () => void) => {
    wait.then(() => setTimeout(() => cb()))
  }
}

/**
 * 页签关闭操作回调
 * @param {object} history 路由history对象。不能new新实例，不然参数无法传递
 * @param {string} returnUrl 返回地址
 * @param {function} cb 回调操作，可选
 */
export const closeTabAction = (
  history: CommonObjectType,
  returnUrl: string = '/',
  cb?: () => void
) => {
  const { curTab } = store.getState().storeData
  const { href } = window.location
  const pathname = href.split('#')[1]
  // 删除tab
  const tabArr = JSON.parse(JSON.stringify(curTab))
  const delIndex = tabArr.findIndex((item: string) => item === pathname)
  tabArr.splice(delIndex, 1)

  // 如果要返回的页面被关闭了，再加进去
  if (!tabArr.includes(returnUrl)) {
    tabArr.push(returnUrl)
  }

  // 储存新的tabs数组
  const setTab = store.dispatch({
    type: 'SET_CURTAB',
    payload: tabArr
  })
  // 刷新tab
  const reloadTab = store.dispatch({
    type: 'SET_RELOADPATH',
    payload: returnUrl
  })
  // 停止刷新tab
  const stopReload = setTimeout(() => {
    store.dispatch({
      type: 'SET_RELOADPATH',
      payload: 'null'
    })
  }, 500)

  const action = () => setTab && reloadTab && stopReload

  // 刷新回调
  const callback = () => {
    if (cb && typeof cb === 'function') {
      return cb
    }
    return history.push({
      pathname: returnUrl
    })
  }

  asyncAction(action)(callback)
}

/**
 * 获取地址栏 ?参数，返回键值对对象
 */
export const getQuery = (): CommonObjectType<string> => {
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

/**
 * 深拷贝操作，简单类型的对象的可以直接用 JSON.parse(JSON.stringify())或 [...]/{...}
 * @param {object} obj 需要拷贝的对象
 */
export const deepClone = (obj: CommonObjectType) => {
  if (
    obj === null ||
    typeof obj !== 'object' ||
    obj instanceof Date ||
    obj instanceof Function
  ) {
    return obj
  }
  const cloneObj = Array.isArray(obj) ? [] : {}
  Object.keys(obj).map((key) => {
    cloneObj[key] = deepClone(obj[key])
    return cloneObj
  })
  return cloneObj
}

/**
 * 获取图片地址
 * @param {*} html 富文本字符串
 */
export const getImgsUrl = (html?: string) => {
  // 匹配图片（g表示匹配所有结果i表示区分大小写）
  const imgReg = /<img.*?(?:>|\/>)/gi
  // 匹配src属性
  const srcReg = /src=['"]?([^'"]*)['"]?/i
  const arr = html.match(imgReg)
  if (!arr) return null
  // 获取图片地址
  const urlArr = arr.reduce((prev, next) => {
    const src = next.match(srcReg)
    return src[1] ? [...prev, src[1]] : prev
  }, [])
  return urlArr
}

/**
 * 获取视频地址
 * @param {*} html 富文本字符串
 */
export const getVideoUrl = (html?: string) => {
  // 匹配图片（g表示匹配所有结果i表示区分大小写）
  const imgReg = /<(video|iframe).*?(?:>|\/>)/gi
  // 匹配src属性
  const srcReg = /src=['"]?([^'"]*)['"]?/i
  const arr = html.match(imgReg)
  if (!arr) return null
  // 获取图片地址
  const urlArr = arr.reduce((prev, next) => {
    const src = next.match(srcReg)
    return src[1] ? [...prev, src[1]] : prev
  }, [])
  return urlArr
}

/**
 * 获取本地存储中的权限
 */
export const getPermission = () => localStorage.getItem('permissions') || []

/**
 * 根据权限判断是否有权限
 */
export const isAuthorized = (val: string): boolean => {
  const permissions = getPermission()
  return permissions.includes(val)
}

/**
 * 用requestAnimationFrame替代setTimeout、setInterval，解决内存溢出
 * @export
 * @param {*} cb 定时回调
 * @param {*} interval 定时时间
 */
export const customizeTimer = {
  intervalTimer: null,
  timeoutTimer: null,
  setTimeout(cb: () => void, interval: number) {
    // 实现setTimeout功能
    const { now } = Date
    const stime = now()
    let etime = stime
    const loop = () => {
      this.timeoutTimer = requestAnimationFrame(loop)
      etime = now()
      if (etime - stime >= interval) {
        cb()
        cancelAnimationFrame(this.timeoutTimer)
      }
    }
    this.timeoutTimer = requestAnimationFrame(loop)
    return this.timeoutTimer
  },
  clearTimeout() {
    cancelAnimationFrame(this.timeoutTimer)
  },
  setInterval(cb: () => void, interval: number) {
    // 实现setInterval功能
    const { now } = Date
    let stime = now()
    let etime = stime
    const loop = () => {
      this.intervalTimer = requestAnimationFrame(loop)
      etime = now()
      if (etime - stime >= interval) {
        stime = now()
        etime = stime
        cb()
      }
    }
    this.intervalTimer = requestAnimationFrame(loop)
    return this.intervalTimer
  },
  clearInterval() {
    cancelAnimationFrame(this.intervalTimer)
  }
}

/**
 * 预览图片
 */
export const previewImg = (children: string | React.ReactNode) => {
  Modal.info({
    title: '预览',
    icon: false,
    okText: '关闭',
    maskClosable: true,
    content: children
  })
}

/**
 * 限制两位小数，可 ±
 * @param {string} val 要格式化的数字
 */
export const limitDecimal = (val: string) =>
  val.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')

/**
 * 处理用户信息并储存起来
 */
export const setUserInfo = (
  userInfo: CommonObjectType,
  action: (arg0: string, arg1: unknown) => unknown,
  oldToken?: string
) => {
  const { permission, userName, token } = userInfo
  const permissionArray = permission.reduce(
    (prev: CommonObjectType<string>[], next: CommonObjectType<string>) => [
      ...prev,
      next.code
    ],
    []
  )
  localStorage.setItem('permissions', permissionArray)

  const result = {
    userName,
    permission,
    token: token || oldToken
  }
  action('SET_USERINFO', result)
}
