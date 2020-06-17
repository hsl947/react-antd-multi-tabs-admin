import React, { useEffect, FC } from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Form, Input, Button, message } from 'antd'
import ReactCanvasNest from 'react-canvas-nest'
import './login.less'
import Logo from '@/assets/img/logo.png'
import { setUserInfo } from '@/assets/js/publicFunc'
import { connect } from 'react-redux'
import actions from '@/store/actions'

const mapStateToProps = (state: any) => {
  const { userInfo, theme } = state.storeData
  return {
    userInfo,
    theme
  }
}

const mapDispatchToProps = (dispatch: (arg0: any) => any) => ({
  setStoreData: (type: string, payload: any) => dispatch(actions(type, payload))
})

const LoginForm: FC<any> = ({
  theme,
  userInfo = {},
  history,
  setStoreData
}) => {
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
  const onFinish = (values: any): void => {
    const { userName, password } = values
    if (userName !== 'admin' && password !== '123456') {
      message.error('用户名或密码错误')
      return
    }

    // 登录后返回的数据，包括权限
    const res = {
      userName,
      token: 'asdfghjkl',
      permission: [
        {
          code: 'user:list:view',
          name: '查看用户列表'
        },
        {
          code: 'user:list:add',
          name: '新增用户列表'
        },
        {
          code: 'user:list:edit',
          name: '编辑用户列表'
        },
        {
          code: 'role:list:view',
          name: '查看角色列表'
        },
        {
          code: 'auth:test:view',
          name: '查看权限测试页'
        }
      ]
    }
    setUserInfo(res, setStoreData)
    history.push('/')
  }

  const FormView = (
    <Form className="login-form" name="login-form" onFinish={onFinish}>
      <Form.Item
        name="userName"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input placeholder="用户名" prefix={<UserOutlined />} size="large" />
      </Form.Item>
      <Form.Item
        name="password"
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
        <span className="logo-name">React-Antd多页签模板管理后台</span>
      </div>
      {FormView}
    </div>
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginForm)
