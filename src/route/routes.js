import Home from '@/pages/home'
import ErrorPage from '@/pages/public/errorPage'

import Page1 from '@/pages/demo/page1'
import Page2 from '@/pages/demo/page2'
import Page3 from '@/pages/demo/page3'
import Page4 from '@/pages/demo/page4'
import Add from '@/pages/demo/add'
import Edit from '@/pages/demo/edit'

/**
 * path 跳转的路径
 * component 对应路径显示的组件
 * exact 匹配规则，true的时候则精确匹配。
 */

const menus = [
  {
    path: '/',
    name: '首页',
    exact: true,
    key: 'home',
    component: Home
  },
  {
    path: '/user',
    name: '用户管理',
    routes: [
      {
        path: '/user/page1',
        name: '用户列表',
        exact: true,
        isAuth: true,
        component: Page1,
        key: 'page1'
      },
      {
        path: '/user/page2',
        name: '登录记录',
        exact: true,
        isAuth: true,
        component: Page2,
        key: 'page2'
      },
      {
        path: '/user/page1/add',
        name: '用户添加',
        exact: true,
        isAuth: true,
        component: Add,
        key: 'add'
      },
      {
        path: '/user/page1/edit',
        name: '用户编辑',
        exact: true,
        isAuth: true,
        component: Edit,
        key: 'edit'
      }
    ]
  },
  {
    path: '/system',
    name: '系统设置',
    routes: [
      {
        path: '/system/page3',
        name: '帮助中心',
        exact: true,
        isAuth: true,
        component: Page3,
        key: 'page3'
      },
      {
        path: '/system/page4',
        name: '消息提醒',
        exact: true,
        isAuth: true,
        component: Page4,
        key: 'page4'
      }
    ]
  },
  {
    path: '/403',
    name: '暂无权限',
    exact: true,
    key: '403',
    component: ErrorPage
  }
]

export default menus
