/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react'
import { message, Button } from 'antd'
import { withRouter } from 'react-router-dom'

import { asyncAction } from '@/assets/js/publicFunc'

const AddForm = (props) => {
  const { location, history, setStore, curTab } = props

  // 提交方法
  const submit = () => {
    message.success('操作成功！')
    // 返回列表页
    const tabArr = JSON.parse(JSON.stringify(curTab))
    const delIndex = tabArr.findIndex((item) => item === location.pathname)
    tabArr.splice(delIndex, 1)

    // 删除tab，刷新回调
    const action = setStore('SET_CURTAB', tabArr)
    const cb = () =>
      history.push({ pathname: '/user/page1', params: { reload: true } })
    asyncAction(action)(cb)
  }

  return (
    <div>
      <h2>测试非菜单栏内页关闭效果🕹️</h2>
      <Button type="primary" onClick={submit}>
        保存并返回🔙
      </Button>
    </div>
  )
}

export default withRouter(AddForm)
