import React, { FC, useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd'

import MyIconFont from '@/components/common/myIconfont'
import { flattenRoutes, getKeyName } from '@/assets/js/publicFunc'
import menus from '@/route/routes'
import logo from '@/assets/img/logo.png'
import { useAppSelector } from '@/store/redux-hooks'
import { selectUserInfo } from '@/store/slicers/userSlice'
import { selectCollapsed, selectTheme } from '@/store/slicers/appSlice'
import classNames from 'classnames'
import styles from './Menu.module.less'

const { Header } = Layout

const { SubMenu } = Menu
const flatMenu = flattenRoutes(menus)

type MenuType = CommonObjectType<string>

interface MenuProps {
  menuMode: 'horizontal' | 'vertical'
}

const MenuView: FC<MenuProps> = ({ menuMode }) => {
  const userInfo = useAppSelector(selectUserInfo)
  const collapsed = useAppSelector(selectCollapsed)
  const theme = useAppSelector(selectTheme)
  const { pathname } = useLocation()
  const { tabKey: curKey = 'home' } = getKeyName(pathname)
  const [current, setCurrent] = useState(curKey)
  const { permission = [] } = userInfo

  // 递归逐级向上获取最近一级的菜单，并高亮
  const higherMenuKey = useCallback(
    (checkKey = 'home', path = pathname) => {
      if (
        checkKey === '403' ||
        flatMenu.some((item: MenuType) => item.key === checkKey)
      ) {
        return checkKey
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
      <div className="flex items-center">
        {iconfont ? <MyIconFont type={iconfont} /> : !!MenuIcon && <MenuIcon />}
        <span className={styles.noselect}>{data.name}</span>
      </div>
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
      const arr = permission.filter((ele) => item.key === ele.code)
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

  const showKeys = collapsed ? [] : setDefaultKey
  const LogLink = () => (
    <Link to={{ pathname: '/' }}>
      <div
        className={classNames({
          [styles.horizontalHeader]: menuMode === 'horizontal'
        })}
      >
        <img alt="logo" src={logo} className="h-12 inline" />
        {!collapsed && <h1 className="inline">Antd多页签模板</h1>}
      </div>
    </Link>
  )
  if (menuMode === 'horizontal')
    return (
      <Header className="header">
        <Menu
          mode="horizontal"
          onClick={handleClick}
          selectedKeys={[current]}
          theme={theme === 'default' ? 'light' : 'dark'}
        >
          <Menu.Item className={styles.noselect}>
            <LogLink />
          </Menu.Item>
          {renderMenuMap(menus)}
        </Menu>
      </Header>
    )
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
        <LogLink />
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

export default MenuView
