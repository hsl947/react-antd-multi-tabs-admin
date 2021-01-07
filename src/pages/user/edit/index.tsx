import React, { useEffect, useState, FC } from 'react'
import { useHistory } from 'react-router-dom'
import { Form, Input, Button, message, Switch, Spin } from 'antd'
import { formItemLayout, wrapperCol } from '@/config/layout'
import { closeTabAction, getQuery } from '@/assets/js/publicFunc'
import MySelect from '@/components/common/mySelect'
import MyUpload from '@/components/common/myUpload'
import Editor from '@/components/common/editor'

const FormView: FC = () => {
  const query = getQuery()
  const { id } = query

  const [form] = Form.useForm()
  const { setFieldsValue, resetFields } = form

  const [loading, setLoading] = useState<boolean>(false)

  const history: CommonObjectType = useHistory()

  // 编辑状态
  useEffect(() => {
    if (!id) {
      resetFields()
      return
    }
    setFieldsValue({
      name: 'Jacob Jørgensen',
      gender: 'male',
      avatar: 'https://randomuser.me/api/portraits/thumb/men/84.jpg',
      content: 'jacob.jorgensen@example.com',
      status: Math.random() > 0.5
    })
  }, [id, resetFields, setFieldsValue])

  const handleSubmit = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      message.success('修改成功')
      const returnUrl = '/user/list'
      closeTabAction(history, returnUrl)
    }, 1000)
  }

  return (
    <Spin spinning={loading}>
      <Form {...formItemLayout} form={form} onFinish={handleSubmit}>
        <Form.Item
          label="名称"
          name="name"
          rules={[
            {
              required: true,
              message: '请输入名称'
            }
          ]}
        >
          <Input placeholder="请输入名称" />
        </Form.Item>
        <Form.Item
          label="性别"
          name="gender"
          rules={[
            {
              required: true,
              message: '请选择性别'
            }
          ]}
        >
          <MySelect
            data={[
              { key: 'male', name: 'male' },
              { key: 'female', name: 'female' }
            ]}
            placeholder="请选择性别"
          />
        </Form.Item>
        <Form.Item
          label="头像"
          name="avatar"
          extra={
            <span>
              只支持<b>JPG、PNG、GIF</b>，大小不超过<b>5M</b>
            </span>
          }
        >
          <MyUpload />
        </Form.Item>
        <Form.Item
          label="描述"
          name="content"
          rules={[
            {
              validator: async (rule, value) => {
                const h = value.toHTML()
                if (h === '<p></p>' || !h) {
                  throw new Error('请输入内容')
                }
              }
            }
          ]}
        >
          <Editor />
        </Form.Item>
        <Form.Item label="状态" name="status" valuePropName="checked">
          <Switch checkedChildren="开启" unCheckedChildren="禁用" />
        </Form.Item>
        <Form.Item wrapperCol={wrapperCol}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  )
}

export default FormView
