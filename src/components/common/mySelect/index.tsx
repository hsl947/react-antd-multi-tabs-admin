import React, { FC } from 'react'
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

const MySelect: FC<Props> = (props) => {
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
  } = props

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
      {data.map((item) => (
        <Option key={item[type]} title={item[name]} value={item[type]}>
          {item[name]}
        </Option>
      ))}
    </Select>
  )
}

export default MySelect
