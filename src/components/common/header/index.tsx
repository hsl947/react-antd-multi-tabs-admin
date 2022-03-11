import React, { useState, useEffect, FC } from 'react'
import { useHistory } from 'react-router-dom'
import { Menu, Dropdown, Layout } from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LoadingOutlined
} from '@ant-design/icons'
import Breadcrumb from '@/components/common/breadcrumb'
import { connect } from 'react-redux'
import * as actions from '@/store/actions'
import { Icon } from '@iconify/react'
import { oidcLogout } from '@/config/oidc_setting'
import style from './Header.module.less'

interface Props extends ReduxProps {}

const Header: FC<Props> = ({
  storeData: { theme, userInfo },
  setStoreData
}) => {
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
      await setStoreData('SET_USERINFO', {})
    } else {
      await setStoreData('SET_USERINFO', {})
      history.replace({ pathname: '/login' })
    }
  }

  const changeTheme = (themes: string) => {
    setStoreData('SET_THEME', themes)
  }

  const menu = (
    <Menu>
      <Menu.Item onClick={logout}>
        <span>退出登录</span>
        {loading && <LoadingOutlined />}
      </Menu.Item>
    </Menu>
  )

  const toggle = (): void => {
    setCollapsed(!collapsed)
    setStoreData('SET_COLLAPSED', !collapsed)
  }

  // 更换主题
  useEffect(() => {
    if (theme === 'default') {
      const script = document.createElement('script')
      script.id = 'themeJs'
      script.src = '/less.min.js'
      document.body.appendChild(script)

      setTimeout(() => {
        const themeStyle = document.getElementById('less:color')
        if (themeStyle) localStorage.setItem('themeStyle', themeStyle.innerText)
      }, 500)
    } else {
      const themeJs = document.getElementById('themeJs')
      const themeStyle = document.getElementById('less:color')
      if (themeJs) themeJs.remove()
      if (themeStyle) themeStyle.remove()
      localStorage.removeItem('themeStyle')
    }
  }, [theme])

  return (
    <Layout.Header className={style.header}>
      <div className={style.toggleMenu} onClick={toggle}>
        {collapsed ? (
          <MenuUnfoldOutlined className={style.trigger} />
        ) : (
          <MenuFoldOutlined className={style.trigger} />
        )}
      </div>
      <Breadcrumb />
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
export default connect((state) => state, actions)(Header)
