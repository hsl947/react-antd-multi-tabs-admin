import React, { useState, useEffect, useCallback, FC } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, Layout } from 'antd'

import MyIconFont from '@/components/common/myIconfont'
import { getKeyName, flattenRoutes } from '@/assets/js/publicFunc'
import menus from '@/config/menu'
import logo from '@/assets/img/logo.png'
import { connect } from 'react-redux'
import * as actions from '@/store/actions'
import styles from './Menu.module.less'

const { SubMenu } = Menu
const flatMenu = flattenRoutes(menus)

interface Props extends ReduxProps {}

type MenuType = CommonObjectType<string>

const MenuView: FC<Props> = ({ storeData: { theme, userInfo, collapsed } }) => {
  const { pathname } = useLocation()
  const { tabKey: curKey = 'home' } = getKeyName(pathname)
  const [current, setCurrent] = useState(curKey)
  const { permission = [] } = userInfo
  // 递归逐级向上获取最近一级的菜单，并高亮
  const higherMenuKey = useCallback(
    (checkKey = 'home', path = pathname) => {
      const higherKey = checkKey
      if (
        checkKey === '403' ||
        flatMenu.some((item: MenuType) => item.key === checkKey)
      ) {
        return higherKey
      }
      const higherPath = path.match(/(.*)\//g)[0].replace(/(.*)\//, '$1')
      const { tabKey } = getKeyName(higherPath)
      return higherMenuKey(tabKey, higherPath)
    },
    [pathname]
  )

  useEffect(() => {
    const { tabKey } = getKeyName(pathname)
    const higherKey = higherMenuKey(tabKey)
    setCurrent(higherKey)
  }, [higherMenuKey, pathname])

  // 菜单点击事件
  const handleClick = ({ key }): void => {
    setCurrent(key)
  }

  // 子菜单的标题
  const subMenuTitle = (data: MenuType): JSX.Element => {
    const { icon: MenuIcon, iconfont } = data
    return (
      <span>
        {iconfont ? (
          <MyIconFont type={iconfont} style={{ fontSize: '14px' }} />
        ) : (
          !!MenuIcon && <MenuIcon />
        )}
        <span className={styles.noselect}>{data.name}</span>
      </span>
    )
  }

  // 创建可跳转的多级子菜单
  const createMenuItem = (data: MenuType): JSX.Element => {
    return (
      <Menu.Item className={styles.noselect} key={data.key} title={data.name}>
        <Link to={data.path}>{subMenuTitle(data)}</Link>
      </Menu.Item>
    )
  }

  // 创建可展开的第一级子菜单
  const creatSubMenu = (data: CommonObjectType): JSX.Element => {
    const menuItemList = []
    data.routes.map((item: MenuType) => {
      const arr = permission.filter((ele: MenuType) => item.key === ele.code)
      if (arr.length > 0) {
        menuItemList.push(renderMenu(item))
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
  const renderMenuMap = (list: CommonObjectType): JSX.Element[] =>
    list.map((item) => renderMenu(item))

  // 判断是否有子菜单，渲染不同组件
  function renderMenu(item: MenuType) {
    return item.type === 'subMenu' ? creatSubMenu(item) : createMenuItem(item)
  }

  const setDefaultKey = flatMenu
    .filter((item: MenuType) => item.type === 'subMenu')
    .reduce((prev: MenuType[], next: MenuType) => [...prev, next.key], [])

  const showKeys = document.body.clientWidth <= 1366 ? [] : setDefaultKey

  return (
    <Layout.Sider
      collapsed={collapsed}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        userSelect: 'none'
      }}
      width={220}
    >
      <div className="logo">
        <Link to={{ pathname: '/' }}>
          <img alt="logo" src={logo} />
          {!collapsed && <h1>Antd多页签模板</h1>}
        </Link>
      </div>
      <Menu
        defaultOpenKeys={showKeys}
        mode="inline"
        onClick={handleClick}
        selectedKeys={[current]}
        theme={theme === 'default' ? 'light' : 'dark'}
      >
        {renderMenuMap(menus)}
      </Menu>
    </Layout.Sider>
  )
}

export default connect(
  (state) => state,
  actions
)(MenuView)
