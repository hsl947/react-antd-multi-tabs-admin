import React, { useRef, MutableRefObject, FC } from 'react'
import { withRouter } from 'react-router-dom'
import MyTable from '@/components/common/table'
import { previewImg } from '@/assets/js/publicFunc'
import commom from '@/api'

const RoleList: FC<any> = () => {
  const tableRef: MutableRefObject<any> = useRef()

  const preview = (url: string) =>
    previewImg(<img src={url} width="100%" alt="" />)

  const columns = [
    {
      title: 'avatar',
      dataIndex: 'picture',
      align: 'center',
      render: (picture: any) => (
        <span onClick={() => preview(picture.thumbnail)}>
          <img src={picture.thumbnail} width="40" alt="" />
        </span>
      )
    },
    {
      title: 'name',
      dataIndex: 'name',
      align: 'center',
      render: (name: any) => `${name.first} ${name.last}`
    },
    {
      title: 'gender',
      dataIndex: 'gender',
      align: 'center'
    },
    {
      title: 'phone',
      align: 'center',
      dataIndex: 'phone'
    },
    {
      title: 'cell',
      align: 'center',
      dataIndex: 'cell',
      sorter: true
    }
  ]
  return (
    <>
      <MyTable
        apiFun={commom.getList}
        columns={columns}
        ref={tableRef}
        extraProps={{ results: 10 }}
      />
    </>
  )
}
export default withRouter(RoleList)
