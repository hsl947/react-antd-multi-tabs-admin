import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
import { List, Typography, Button } from 'antd'
import { KeyOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import * as actions from '@/store/actions'
import { setUserInfo } from '@/assets/js/publicFunc'

const { Text } = Typography

interface Props extends ReduxProps {}

const AuthTest: FC<Props> = ({ storeData: { userInfo }, setStoreData }) => {
  const history = useHistory()
  const { userName, permission } = userInfo

  // 切换权限
  const changeAuth = () => {
    const newInfo = {
      ...userInfo,
      // 模拟权限
      permission:
        permission.length === 5
          ? [
              {
                code: 'user:list:view',
                name: '查看用户列表'
              },
              {
                code: 'user:list:edit',
                name: '编辑用户列表'
              },
              {
                code: 'auth:test:view',
                name: '查看权限测试页'
              }
            ]
          : [
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
    setUserInfo(newInfo, setStoreData)
  }

  return (
    <>
      <Text style={{ margin: 20 }}>
        当前用户：<Text code>{userName}</Text>
      </Text>
      <br />
      <Text style={{ margin: 20 }}>
        当前权限：
        <KeyOutlined />
      </Text>
      <List
        size="large"
        footer={
          <Button type="primary" onClick={changeAuth}>
            切换权限
          </Button>
        }
        bordered
        dataSource={permission}
        renderItem={(item: CommonObjectType<string>) => (
          <List.Item>
            {item.name} - {item.code}
          </List.Item>
        )}
        style={{ margin: 20 }}
      />
      <Button onClick={() => history.push('/role/list')} style={{ margin: 20 }}>
        切换权限后，点击这里，访问【角色列表】试试
      </Button>
    </>
  )
}

export default connect(
  (state) => state,
  actions
)(AuthTest)
