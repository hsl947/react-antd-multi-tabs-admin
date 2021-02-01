import React, { forwardRef, useImperativeHandle, FC } from 'react'
import { Form, Button } from 'antd'

interface SearchProps {
  config: object[];
  handleSearch: (arg0?: object) => void;
  ref: RefType;
  beforeSearch?: (arg0?: object) => void;
  onFieldsChange?: (arg0?: unknown, arg1?: unknown) => void;
}

const SearchForm: FC<SearchProps> = forwardRef(
  (props: SearchProps, ref: RefType) => {
    const { config, handleSearch, beforeSearch, onFieldsChange } = props
    const [form] = Form.useForm()
    const getFields = (): JSX.Element[] => {
      return config.map((item: CommonObjectType) => {
        return (
          <Form.Item
            key={item.key}
            name={item.key}
            rules={item.rules}
            style={{ marginBottom: '6px' }}
          >
            {item.slot}
          </Form.Item>
        )
      })
    }

    const emitSearch = (values: object): void => {
      // beforeSearch用于处理一些特殊情况
      beforeSearch(values)
      handleSearch(values)
    }

    const initialValues = config.reduce(
      (prev: CommonObjectType, next: CommonObjectType) => ({
        ...prev,
        [next.key]: next.initialValue
      }),
      {}
    )

    useImperativeHandle(ref, () => ({
      // 重置搜索字段
      resetFields(field: string[]) {
        return field ? form.resetFields([...field]) : form.resetFields()
      }
    }))

    return (
      <Form
        form={form}
        initialValues={initialValues}
        onFieldsChange={onFieldsChange}
        layout="inline"
        onFinish={emitSearch}
        style={{ marginBottom: 10 }}
      >
        {getFields()}
        <Form.Item>
          <Button htmlType="submit" type="primary">
            搜索
          </Button>
        </Form.Item>
      </Form>
    )
  }
)

SearchForm.defaultProps = {
  beforeSearch: () => {},
  onFieldsChange: () => {}
}

export default SearchForm
