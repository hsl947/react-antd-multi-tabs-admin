import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Menu, Dropdown, Layout } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import Breadcrumb from '@/components/common/breadcrumb'
import style from './Header.module.less'

const Header = ({ userInfo, setStore, history }) => {
  const { userName = '-' } = userInfo
  const firstWord = userName.slice(0, 1)
  const [collapsed, setCollapsed] = useState(false)
  const logout = async () => {
    await setStore('SET_USERINFO', {})
    history.replace({ pathname: '/login' })
  }

  const menu = (
    <Menu>
      <Menu.Item onClick={logout}>
        <span>退出登录</span>
      </Menu.Item>
    </Menu>
  )

  const toggle = () => {
    setCollapsed(!collapsed)
    setStore('SET_COLLAPSED', !collapsed)
  }

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
          <span className={style.avart}>{firstWord}</span>
          <span>{userName}</span>
        </span>
      </Dropdown>
    </Layout.Header>
  )
}

Header.propTypes = {
  userInfo: PropTypes.objectOf(PropTypes.any)
}
Header.defaultProps = {
  userInfo: {
    userName: '-'
  }
}

export default withRouter(Header)
