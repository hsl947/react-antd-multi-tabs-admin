import React from 'react'
import { Select } from 'antd'
import PropTypes from 'prop-types'

const { Option } = Select

class MySelect extends React.Component {
  render() {
    const {
      data,
      placeholder,
      name,
      type,
      value,
      onChange,
      width,
      disabled
    } = this.props
    const handerChange = (val) => {
      onChange(val)
    }
    return (
      <Select
        allowClear
        disabled={disabled}
        onChange={handerChange}
        optionFilterProp="children"
        placeholder={placeholder}
        showSearch
        style={{ width }}
        value={value}
      >
        {data.map((item, index) => (
          <Option
            key={item[type] || index}
            title={item[name]}
            value={item[type]}
          >
            {item[name]}
          </Option>
        ))}
      </Select>
    )
  }
}

MySelect.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

MySelect.defaultProps = {
  placeholder: '请输入搜索条件',
  name: 'name',
  type: 'key',
  width: 200
}

export default MySelect
