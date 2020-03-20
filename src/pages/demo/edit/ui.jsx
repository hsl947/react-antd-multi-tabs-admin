/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useEffect } from 'react'
import { message, Button } from 'antd'
import { withRouter } from 'react-router-dom'

import { asyncAction, getQuery } from '@/assets/js/publicFunc'

const EditForm = (props) => {
  const { location, history, setStore, curTab } = props
  const [editId, setEditId] = useState('')

  // 编辑时的回调操作
  useEffect(() => {
    // 编辑状态, 获取数据
    const { name } = getQuery()
    setEditId(name)
  }, [setEditId])

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
      <h1>当前编辑的用户：{editId}</h1>
      <Button type="primary" onClick={submit}>
        保存并返回🔙
      </Button>
    </div>
  )
}

export default withRouter(EditForm)
