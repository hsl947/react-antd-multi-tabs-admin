import React, { useState, useEffect, FC } from 'react'
import { useHistory } from 'react-router-dom'
import { Menu, Dropdown, Layout, Divider } from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LoadingOutlined
} from '@ant-design/icons'
import Breadcrumb from '@/components/common/breadcrumb'
import { Icon } from '@iconify/react'
import { oidcLogout } from '@/config/oidc_setting'
import { useAppDispatch, useAppSelector } from '@/store/redux-hooks'
import { selectUserInfo, setUserInfo } from '@/store/slicers/userSlice'
import {
  selectTheme,
  setCollapsed as setCollapsedGlobal,
  setMenuMode,
  setTheme
} from '@/store/slicers/appSlice'

import classNames from 'classnames'
import style from './Header.module.less'

const Header: FC = () => {
  const dispatch = useAppDispatch()
  const theme = useAppSelector(selectTheme)
  const userInfo = useAppSelector(selectUserInfo)
  const menuMode = useAppSelector((state) => state.app.menuMode)
  const history = useHistory()
  const { username = '-' } = userInfo
  const firstWord = username.slice(0, 1)
  const [collapsed, setCollapsed] = useState(false)
  const [loading, setLoading] = useState(false)
  const logout = async () => {
    console.log('user 登出', userInfo)
    if (userInfo.is_oidc_user) {
      setLoading(true)
      await oidcLogout()
      dispatch(setUserInfo({})) // 清除用户信息 下同
    } else {
      dispatch(setUserInfo({}))
      history.replace({ pathname: '/login' })
    }
  }

  const changeTheme = (themes: string) => {
    dispatch(setTheme(themes))
  }

  const menu = (
    <Menu>
      <Menu.Item onClick={logout}>
        <span>退出登录</span>
        {loading && <LoadingOutlined />}
      </Menu.Item>
      <Divider />
      <Menu.Item>
        <Icon
          icon="ant-design:layout-filled"
          rotate={3}
          fontSize={24}
          color="green"
          onClick={() => dispatch(setMenuMode('vertical'))}
        />
        <Icon
          icon="tabler:layout-navbar"
          fontSize={24}
          color="blue"
          onClick={() => dispatch(setMenuMode('horizontal'))}
        />
      </Menu.Item>
    </Menu>
  )

  const toggle = (): void => {
    setCollapsed(!collapsed)
    dispatch(setCollapsedGlobal(!collapsed))
  }

  // 更换主题
  useEffect(() => {
    if (theme === 'default') {
      // 通过挂载 预定义的postcss less.min.js 来处于 挂载预定义的color.less
      const script = document.createElement('script')
      script.id = 'themeJs'
      script.src = '/less.min.js'
      document.body.appendChild(script)

      setTimeout(() => {
        const themeStyle = document.getElementById('less:color')
        if (themeStyle) localStorage.setItem('themeStyle', themeStyle.innerText)
      }, 500)
    } else {
      // 深色主题: 移除自定义主题 style 节点和 script.src=themeJs 节点. 深色主题见
      const themeJs = document.getElementById('themeJs')
      const themeStyle = document.getElementById('less:color')
      if (themeJs) themeJs.remove()
      /*
      // 入口文件 index.html中,优先加载用户偏好的主题
      const themeStyle = localStorage.getItem('themeStyle')
      if(themeStyle) {
        const styles = document.createElement('style')
        styles.id = 'less:color'
        styles.innerText = themeStyle
        document.body.appendChild(styles)
      }
      * */
      if (themeStyle) themeStyle.remove()
      localStorage.removeItem('themeStyle')
    }
  }, [theme])

  return (
    <Layout.Header
      className={classNames(style.header, {
        [style.horizontal]: menuMode === 'horizontal'
      })}
    >
      {menuMode === 'vertical' && (
        <>
          <div className={style.toggleMenu} onClick={toggle}>
            {collapsed ? (
              <MenuUnfoldOutlined className={style.trigger} />
            ) : (
              <MenuFoldOutlined className={style.trigger} />
            )}
          </div>
          {/* 面包屑 */}
          <Breadcrumb />
        </>
      )}

      <Dropdown className={`fr ${style.content}`} overlay={menu}>
        <span className={style.user}>
          <span className="avart">{firstWord}</span>
          <span>{username}</span>
        </span>
      </Dropdown>
      <div className={`fr ${style.themeSwitchWrapper}`}>
        <div
          className={`${style.themeSwitch} ${
            theme === 'default' ? '' : style.themeSwitchDark
          }`}
          title="更换主题"
          onClick={() => changeTheme(theme === 'default' ? 'dark' : 'default')}
        >
          <div className={style.themeSwitchInner} />
          <Icon icon="emojione:sun" />
          <Icon icon="bi:moon-stars-fill" color="#ffe62e" />
        </div>
      </div>
      <a
        className="fr"
        href="https://github.com/hsl947/react-antd-multi-tabs-admin"
        target="_blank"
        rel="noopener noreferrer"
        title="view github"
        style={{ marginRight: 20 }}
      >
        <img
          src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjQwcHgiIGhlaWdodD0iNDBweCIgdmlld0JveD0iMTIgMTIgNDAgNDAiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMTIgMTIgNDAgNDAiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxwYXRoIGZpbGw9IiMzMzMzMzMiIGQ9Ik0zMiAxMy40Yy0xMC41IDAtMTkgOC41LTE5IDE5YzAgOC40IDUuNSAxNS41IDEzIDE4YzEgMC4yIDEuMy0wLjQgMS4zLTAuOWMwLTAuNSAwLTEuNyAwLTMuMiBjLTUuMyAxLjEtNi40LTIuNi02LjQtMi42QzIwIDQxLjYgMTguOCA0MSAxOC44IDQxYy0xLjctMS4yIDAuMS0xLjEgMC4xLTEuMWMxLjkgMC4xIDIuOSAyIDIuOSAyYzEuNyAyLjkgNC41IDIuMSA1LjUgMS42IGMwLjItMS4yIDAuNy0yLjEgMS4yLTIuNmMtNC4yLTAuNS04LjctMi4xLTguNy05LjRjMC0yLjEgMC43LTMuNyAyLTUuMWMtMC4yLTAuNS0wLjgtMi40IDAuMi01YzAgMCAxLjYtMC41IDUuMiAyIGMxLjUtMC40IDMuMS0wLjcgNC44LTAuN2MxLjYgMCAzLjMgMC4yIDQuNyAwLjdjMy42LTIuNCA1LjItMiA1LjItMmMxIDIuNiAwLjQgNC42IDAuMiA1YzEuMiAxLjMgMiAzIDIgNS4xYzAgNy4zLTQuNSA4LjktOC43IDkuNCBjMC43IDAuNiAxLjMgMS43IDEuMyAzLjVjMCAyLjYgMCA0LjYgMCA1LjJjMCAwLjUgMC40IDEuMSAxLjMgMC45YzcuNS0yLjYgMTMtOS43IDEzLTE4LjFDNTEgMjEuOSA0Mi41IDEzLjQgMzIgMTMuNHoiLz48L3N2Zz4="
          alt="github"
          width="26"
        />
      </a>
    </Layout.Header>
  )
}
export default Header
