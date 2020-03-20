import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { withRouter, Link, useLocation } from 'react-router-dom'
import { Menu, Layout } from 'antd'

import { getKeyName, flattenRoutes } from '@/assets/js/publicFunc'
import menus from '@/config/menu'
import logo from '@/assets/img/logo.png'
import styles from './Menu.module.less'

const { SubMenu } = Menu
const flatMenu = flattenRoutes(menus)

const MenuView = ({ userInfo, collapsed, setStore, menuKeys }) => {
  const { pathname } = useLocation()
  const { tabKey: curKey = 'home' } = getKeyName(pathname)
  const [current, setCurrent] = useState(curKey)
  const { permission = [] } = userInfo

  // 递归逐级向上获取最近一级的菜单，并高亮
  const higherMenuKey = useCallback(
    (checkKey) => {
      const higherKey = checkKey
      if (flatMenu.some((item) => item.key === checkKey)) {
        return higherKey
      }
      const higherPath = pathname.match(/(.*)\//g)[0].replace(/(.*)\//, '$1')
      const { tabKey } = getKeyName(higherPath)
      return higherMenuKey(tabKey)
    },
    [pathname]
  )

  useEffect(() => {
    const { tabKey } = getKeyName(pathname)
    const higherKey = higherMenuKey(tabKey)
    setCurrent(higherKey)
  }, [higherMenuKey, pathname])

  // 菜单点击事件
  const handleClick = ({ key }) => {
    setCurrent(key)
  }

  // 子菜单的标题
  const subMenuTitle = (data) => {
    const { icon: MenuIcon } = data
    return (
      <span>
        {!!MenuIcon && <MenuIcon />}
        <span className={styles.noselect}>{data.name}</span>
      </span>
    )
  }

  // 创建可跳转的多级子菜单
  const createMenuItem = (data) => {
    return (
      <Menu.Item className={styles.noselect} key={data.key} name={data.name}>
        <Link to={data.path}>{subMenuTitle(data)}</Link>
      </Menu.Item>
    )
  }

  // 创建可展开的第一级子菜单
  const creatSubMenu = (data) => {
    const menuItemList = []
    data.routes.map((item) => {
      const arr = permission.filter((ele) => item.key === ele)
      if (arr.length > 0) {
        menuItemList.push(createMenuItem(item))
      }
      return arr
    })

    return menuItemList.length > 0 ? (
      <SubMenu key={data.key} title={subMenuTitle(data)}>
        {menuItemList}
      </SubMenu>
    ) : null
  }

  // 创建菜单树
  const renderMenuMap = (list) =>
    list.map((item) =>
      item.type === 'subMenu' ? creatSubMenu(item) : createMenuItem(item)
    )

  // 获取一级菜单的 key
  const getSubMenuKey = (list) => list.map((item) => item.key)
  // 设置默认展开的menu
  const setDefaultKey = () => {
    if (menuKeys.length) {
      return menuKeys
    }
    const allKeys = getSubMenuKey(menus)
    setStore('SET_MENU_KEY', allKeys)
    return allKeys
  }

  return (
    <Layout.Sider
      collapsed={collapsed}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0
      }}
      width={250}
    >
      <div className={styles.logo}>
        <Link to={{ pathname: '/' }}>
          <img alt="logo" src={logo} />
          {!collapsed && <h1>多页签后台</h1>}
        </Link>
      </div>
      <Menu
        defaultOpenKeys={setDefaultKey()}
        mode="inline"
        onClick={handleClick}
        selectedKeys={[current]}
        theme="dark"
      >
        {renderMenuMap(menus)}
      </Menu>
    </Layout.Sider>
  )
}

MenuView.propTypes = {
  userInfo: PropTypes.objectOf(PropTypes.any)
}
MenuView.defaultProps = {
  userInfo: {
    permission: []
  }
}

export default withRouter(MenuView)
