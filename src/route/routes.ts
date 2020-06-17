import Home from '@/pages/home'
import ErrorPage from '@/pages/public/errorPage'

import UserList from '@/pages/user/list'
import UserEdit from '@/pages/user/edit'

import RoleList from '@/pages/role/list'

import AuthTest from '@/pages/test'

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
    key: 'user',
    routes: [
      {
        path: '/user/list',
        name: '用户列表',
        exact: true,
        key: 'user:list:view',
        component: UserList
      },
      {
        path: '/user/list/add',
        name: '新增用户',
        exact: true,
        key: 'user:list:add',
        component: UserEdit
      },
      {
        path: '/user/list/edit',
        name: '编辑用户',
        exact: true,
        key: 'user:list:edit',
        component: UserEdit
      }
    ]
  },
  {
    path: '/role',
    name: '角色管理',
    key: 'role',
    routes: [
      {
        path: '/role/list',
        name: '角色列表',
        exact: true,
        key: 'role:list:view',
        component: RoleList
      }
    ]
  },
  {
    path: '/auth',
    name: '权限测试页',
    exact: true,
    key: 'auth:test:view',
    component: AuthTest
  },
  {
    path: '/403',
    name: '暂无权限',
    exact: true,
    key: '/403',
    component: ErrorPage
  }
]

export default menus
