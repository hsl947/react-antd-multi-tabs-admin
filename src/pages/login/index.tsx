import React, { useEffect, FC } from 'react'
import { useHistory } from 'react-router-dom'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Form, Input, Button, message } from 'antd'
import ReactCanvasNest from 'react-canvas-nest'
import './login.less'
import { connect } from 'react-redux'
import Logo from '@/assets/img/logo.png'
import { setUserInfo } from '@/assets/js/publicFunc'
import * as actions from '@/store/actions'
import session from '@/api/sys/session'
import { OidcLogin } from '@/pages/login/OidcLogin'

interface Props extends ReduxProps {}

const LoginForm: FC<Props> = ({
  storeData: { theme, userInfo = {} },
  setStoreData
}) => {
  const history = useHistory()
  useEffect(() => {
    const { token } = userInfo
    if (token) {
      history.push('/')
      return
    }
    // 重置 tab栏为首页
    setStoreData('SET_CURTAB', ['/'])
  }, [history, setStoreData, userInfo])

  // 触发登录方法
  const onFinish = async (values: CommonObjectType<string>) => {
    const { username, password } = values
    try {
      const result = await session.login({ username, password })
      setUserInfo(result, setStoreData)
      history.push('/')
    } catch (e) {
      const response = (e as any)?.response // Axios异常
      message.error(
        response
          ? `发生错误:${response.data}`
          : `认证服务异常,请联系管理员:${e}`
      )
    }
  }

  const FormView = (
    <Form className="login-form" name="login-form" onFinish={onFinish}>
      <Form.Item
        name="username"
        initialValue="admin"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input placeholder="用户名" prefix={<UserOutlined />} size="large" />
      </Form.Item>
      <Form.Item
        name="password"
        initialValue="123456"
        rules={[{ required: true, message: '请输入密码' }]}
        extra="用户名：admin 密码：123456"
      >
        <Input.Password
          placeholder="密码"
          prefix={<LockOutlined />}
          size="large"
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
        <OidcLogin loginCallback={() => history.push('/')} />
      </Form.Item>
    </Form>
  )

  const floatColor = theme === 'default' ? '24,144,255' : '110,65,255'
  return (
    <div className="login-layout" id="login-layout">
      <ReactCanvasNest
        config={{
          pointColor: floatColor,
          lineColor: floatColor,
          pointOpacity: 0.6
        }}
        style={{ zIndex: 1 }}
      />
      <div className="logo-box">
        <img alt="" className="logo" src={Logo} />
        <span className="logo-name">React-Antd Multi-Tab</span>
      </div>
      {FormView}
    </div>
  )
}

export default connect((state) => state, actions)(LoginForm)
