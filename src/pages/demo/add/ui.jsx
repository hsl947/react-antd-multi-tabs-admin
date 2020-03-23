/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react'
import { message, Button } from 'antd'
import { withRouter } from 'react-router-dom'

import { closeTabAction } from '@/assets/js/publicFunc'

const AddForm = ({ history }) => {
  // 提交方法
  const submit = () => {
    message.success('操作成功！')
    const returnUrl = '/user/page1'
    closeTabAction(history, returnUrl)
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
