import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button } from 'antd'
import style from './Search.module.css'

const SearchForm = ({ config, handleSearch, beforeSearch }) => {
  const getFields = () => {
    return config.map((item) => {
      return (
        <Form.Item key={item.key} name={item.key} rules={item.rules}>
          {item.slot}
        </Form.Item>
      )
    })
  }

  const emitSearch = (values) => {
    // beforeSearch用于处理一些特殊情况
    beforeSearch(values)
    handleSearch(values)
  }

  const initialValues = config.reduce(
    (prev, next) => ({ ...prev, [next.key]: next.initialValue }),
    {}
  )

  return (
    <div className={style.content}>
      <Form initialValues={initialValues} layout="inline" onFinish={emitSearch}>
        {getFields()}
        <Form.Item>
          <Button htmlType="submit" type="primary">
            搜索
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

SearchForm.propTypes = {
  config: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleSearch: PropTypes.func.isRequired
}

export default SearchForm
