import React, { useRef } from 'react'
import { withRouter } from 'react-router-dom'
import { Input, Button } from 'antd'
import MyTable from '@/components/common/table'
import MySelect from '@/components/common/mySelect'
import api from '@/api'

import styles from './Style.module.less'

const Page1 = ({ history }) => {
  const tableRef = useRef()

  // 到编辑页面
  const toEdit = (name) => {
    history.push(`/user/page1/edit?name=${name}`)
  }

  // 到新增页面
  const toAdd = () => {
    history.push('/user/page1/add')
  }

  // 新增按钮
  const AddBtn = () => {
    return (
      <Button className="fr" onClick={toAdd} type="primary">
        新增用户
      </Button>
    )
  }
  // 复选框选中
  const onSelectRow = (rowKeys) => {
    console.log('rowKeys: ', rowKeys)
  }

  // 搜索栏配置项
  const searchConfigList = [
    {
      key: 'name',
      slot: <Input placeholder="输入名字" />,
      rules: [],
      initialValue: 'this is a demo🤓'
    },
    {
      key: 'gender',
      slot: (
        <MySelect
          data={[
            { name: 'male', key: 'male' },
            { name: 'female', key: 'female' }
          ]}
          placeholder="选择性别"
        />
      )
    }
  ]

  const columns = [
    {
      title: 'avatar',
      dataIndex: 'picture',
      render: (picture) => <img src={picture.thumbnail} width="40" alt="" />,
      width: '3%'
    },
    {
      title: 'name',
      dataIndex: 'name',
      render: (name) => `${name.first} ${name.last}`,
      width: '20%'
    },
    {
      title: 'gender',
      dataIndex: 'gender',
      width: '20%'
    },
    {
      title: 'email',
      dataIndex: 'email'
    },
    {
      title: 'operation',
      dataIndex: 'operations',
      align: 'center',
      render: (text, { name }) => {
        return (
          <Button
            className={styles.btn}
            onClick={() => toEdit(name.first + name.last)}
            size="small"
          >
            编辑
          </Button>
        )
      }
    }
  ]

  return (
    <div>
      <AddBtn />
      <MyTable
        apiFun={api.getList}
        columns={columns}
        ref={tableRef}
        searchConfigList={searchConfigList}
        onSelectRow={onSelectRow}
        extraProps={{ results: 10 }}
      />
    </div>
  )
}

export default withRouter(Page1)
