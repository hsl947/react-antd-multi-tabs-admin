import React from 'react'
import { Select } from 'antd'

const { Option } = Select

interface Props {
  data: any[];
  placeholder?: string;
  name?: string;
  type?: string;
  value?: string;
  onChange?: (arg0: any) => void;
  width?: string | number;
  disabled?: boolean;
  onSearch?: () => void;
  defaultValue?: any;
}

class MySelect extends React.Component<Props> {
  render() {
    const {
      data,
      placeholder = '请输入搜索条件',
      name = 'name',
      type = 'key',
      value,
      onChange = () => {},
      width = '100%',
      disabled,
      onSearch,
      defaultValue
    } = this.props
    const handerChange = (val: string | number): void => {
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
        value={value ? `${value}` : value}
        onSearch={onSearch}
        defaultValue={defaultValue}
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

export default MySelect
