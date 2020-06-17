import {
  HomeOutlined,
  BankOutlined,
  UserOutlined,
  AuditOutlined
} from '@ant-design/icons'

const menus = [
  {
    path: '/',
    name: '首页',
    key: 'home',
    icon: HomeOutlined,
    routes: []
  },
  {
    path: '/user',
    name: '用户管理',
    key: 'user',
    type: 'subMenu',
    icon: UserOutlined,
    iconfont: 'icon-xiaoshouzongjian',
    routes: [
      {
        path: '/user/list',
        name: '用户列表',
        key: 'user:list:view'
      }
    ]
  },
  {
    path: '/role',
    name: '角色管理',
    key: 'role',
    type: 'subMenu',
    icon: AuditOutlined,
    routes: [
      {
        path: '/role/list',
        name: '角色列表',
        key: 'role:list:view'
      }
    ]
  },
  {
    path: '/auth',
    name: '测试权限页',
    key: 'auth:test:view',
    icon: BankOutlined
  }
]

export default menus
