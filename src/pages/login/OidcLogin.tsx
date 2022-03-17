// use either bob/bob, alice/alice or your Google account

import React, { useEffect, useState } from 'react'
import { callOidcLogin, oidcSettings, userManager } from '@/config/oidc_setting'
import { Button } from 'antd'
import { useAppDispatch } from '@/store/redux-hooks'
import { setUserInfo } from '@/store/slicers/userSlice'

export const OidcLogin = ({ loginCallback }) => {
  const dispatch = useAppDispatch()
  const [state, setState] = useState('登录第三方...')
  const [loggedIn, setLoggedIn] = useState(false)
  const [logging, setLogging] = useState(false)

  const oidcLogin = async () => {
    setLogging(true)
    setState('登录中...')
    try {
      await callOidcLogin(
        (provided) => provided && dispatch(setUserInfo(provided))
      )
      setLogging(false)
      loginCallback()
    } catch (e) {
      setState(
        `登录失败, 请检查网络,是否能连接认证中心:${oidcSettings.authority}`
      )
    }
    setState('跳转中...')
  }
  useEffect(() => {
    userManager.getUser().then((user) => {
      if (user) {
        setState('你已登录,进入你的工作台')
        setLoggedIn(true)
      } else {
        setLoggedIn(false)
      }
    })
  }, [])

  return (
    <div className="login-form-logo">
      {(loggedIn && (
        <Button type="link" size="large" shape="round">
          <a href="/">{state}</a>
        </Button>
      )) || (
        <>
          <Button
            loading={logging}
            className="login-form-button"
            size="large"
            type="link"
            onClick={() => oidcLogin()}
          >
            {state.split('\n')}
          </Button>
          <Button
            className="login-form-button"
            size="large"
            type="link"
            disabled
          >
            (第三方用户密码: bob/bob, alice/alice)
          </Button>
        </>
      )}
    </div>
  )
}
