import { HomeOutlined, UserOutlined, ReadOutlined } from '@ant-design/icons'

const menus = [
  {
    name: '首页',
    key: 'home',
    icon: HomeOutlined,
    path: '/',
    routes: []
  },
  {
    name: '用户管理',
    key: 'user',
    type: 'subMenu',
    icon: UserOutlined,
    routes: [
      {
        path: '/user/page1',
        name: '用户列表',
        key: 'page1'
      },
      {
        path: '/user/page2',
        name: '登录记录',
        key: 'page2'
      }
    ]
  },
  {
    name: '系统设置',
    key: 'system',
    type: 'subMenu',
    icon: ReadOutlined,
    routes: [
      {
        path: '/system/page3',
        name: '帮助中心',
        key: 'page3'
      },
      {
        path: '/system/page4',
        name: '消息提醒',
        key: 'page4'
      }
    ]
  }
]

export default menus
