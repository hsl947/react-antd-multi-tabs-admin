/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useEffect } from 'react'
import { message, Button } from 'antd'
import { withRouter } from 'react-router-dom'

import { closeTabAction, getQuery } from '@/assets/js/publicFunc'

const EditForm = ({ history }) => {
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
    const returnUrl = '/user/page1'
    closeTabAction(history, returnUrl)
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
