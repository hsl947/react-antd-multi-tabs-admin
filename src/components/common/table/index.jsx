import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { Table } from 'antd'
import PropTypes from 'prop-types'
import useService from '@/assets/js/tableHook'
import SearchView from '@/components/common/searchForm'

/**
 * 封装列表、分页、多选、搜索组件
 * @param {object[]} columns 表格列的配置
 * @param {function} apiFun 表格数据的请求方法
 * @param {object[]} searchConfigList 搜索栏配置
 * @param {function} beforeSearch 搜索前的操作（如处理一些特殊数据）
 * @param {object} extraProps 额外的搜索参数（不在搜索配置内的）
 * @param {function} onSelectRow 复选框操作回调
 * @param {string} rowKey 表格行的key
 */
const MyTable = forwardRef((props, ref) => {
  /**
   * @forwardRef
   * 引用父组件的ref实例，成为子组件的一个参数
   * 可以引用父组件的ref绑定到子组件自身的节点上.
   */
  const {
    columns,
    apiFun,
    searchConfigList,
    beforeSearch,
    extraProps,
    onSelectRow,
    rowKey
  } = props

  // 搜索参数
  const searchObj = searchConfigList.reduce(
    (prev, next) => Object.assign(prev, { [next.key]: next.initialValue }),
    {}
  )
  // 初始参数
  const initParams = {
    ...searchObj,
    pageNum: 1,
    pageSize: 10,
    ...extraProps
  }
  // 列表搜索参数
  const [selectedKeys, setSelectedKeys] = useState([])
  const [tableParams, setTableParams] = useState(initParams)
  const { loading = false, response = {} } = useService(apiFun, tableParams)
  const validData = response && response.total ? response : {}
  const { rows = [], total } = validData
  const handleSearch = (val) => {
    setTableParams({ ...tableParams, ...val, ...extraProps, ...{ pageNum: 1 } })
  }
  /**
   * @useImperativeHandle
   * 第一个参数，接收一个通过forwardRef引用父组件的ref实例
   * 第二个参数一个回调函数，返回一个对象,对象里面存储需要暴露给父组件的属性或方法
   */
  useImperativeHandle(ref, () => ({
    // 编辑、删除后更新
    update() {
      setTableParams({
        ...tableParams,
        ...extraProps,
        ...{ pageNum: 1 }
      })
    }
  }))

  // 列表复选框选中变化
  const onSelectChange = (selectedRowKeys) => {
    setSelectedKeys(selectedRowKeys)
    onSelectRow(selectedRowKeys)
  }
  // 复选框配置
  const rowSelection = {
    selectedRowKeys: selectedKeys,
    onChange: onSelectChange
  }

  return (
    <div>
      {searchConfigList.length > 0 && (
        <SearchView
          beforeSearch={beforeSearch}
          config={searchConfigList}
          handleSearch={handleSearch}
        />
      )}
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={rows}
        loading={loading}
        rowKey={rowKey}
        pagination={{
          total,
          pageSize: tableParams.pageSize,
          current: tableParams.pageNum,
          onChange: (pageNum, pageSize) => {
            setSelectedKeys([])
            setTableParams({ ...tableParams, pageNum, pageSize, ...extraProps })
          }
        }}
      />
    </div>
  )
})

MyTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  apiFun: PropTypes.func.isRequired,
  searchConfigList: PropTypes.arrayOf(PropTypes.object),
  extraProps: PropTypes.objectOf(PropTypes.any),
  beforeSearch: PropTypes.func,
  onSelectRow: PropTypes.func,
  rowKey: PropTypes.string
}

MyTable.defaultProps = {
  searchConfigList: [],
  extraProps: {},
  beforeSearch: () => {},
  onSelectRow: () => {},
  rowKey: 'id'
}

export default MyTable
