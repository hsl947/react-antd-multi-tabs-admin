import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Form, Input, Button } from 'antd'
import ReactCanvasNest from 'react-canvas-nest'

import './login.less'
import Logo from '@/assets/img/logo.png'

const LoginForm = ({ userInfo, history, setStore }) => {
  useEffect(() => {
    const { token } = userInfo
    if (token) {
      history.push('/')
      return
    }
    // 重置tab标签列表
    setStore('SET_CURTAB', ['/'])
  }, [history, setStore, userInfo])

  // 触发登录方法
  const onFinish = (values) => {
    const result = {
      userName: values.username,
      permission: ['page1', 'page2', 'page3', 'page4', 'add', 'edit'],
      token: 'asdfghjkl'
    }
    setStore('SET_USERINFO', result)
    window.location.href = '/'
  }

  const FormView = (
    <Form
      className="login-form"
      name="login-form"
      onFinish={onFinish}
      initialValues={{
        username: 'admin',
        password: 'hello-antd'
      }}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input placeholder="用户名" prefix={<UserOutlined />} size="large" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input
          placeholder="密码"
          prefix={<LockOutlined />}
          size="large"
          type="password"
        />
      </Form.Item>
      <Form.Item>
        <Button
          className="login-form-button"
          htmlType="submit"
          size="large"
          type="primary"
        >
          登录
        </Button>
      </Form.Item>
    </Form>
  )

  return (
    <div className="login-layout" id="login-layout">
      <ReactCanvasNest
        config={{
          pointColor: '110,65,255',
          lineColor: '110,65,255',
          pointOpacity: 0.6
        }}
        style={{ zIndex: 1 }}
      />
      <div className="logo-box">
        <img alt="" className="logo" src={Logo} />
        <span className="logo-name">多页签模板后台</span>
      </div>
      {FormView}
    </div>
  )
}
LoginForm.propTypes = {
  userInfo: PropTypes.objectOf(PropTypes.any)
}
LoginForm.defaultProps = {
  userInfo: {}
}
export default LoginForm
