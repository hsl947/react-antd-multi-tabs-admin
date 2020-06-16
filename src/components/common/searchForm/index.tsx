import React, {
  forwardRef,
  useImperativeHandle,
  FC,
  MutableRefObject
} from 'react'
import { Form, Button } from 'antd'
import style from './Search.module.css'

interface SearchProps {
  ref?: MutableRefObject<any> | ((instance: any) => void);
  config: object[];
  beforeSearch?: (arg0?: object) => void;
  handleSearch?: (arg0?: object) => void;
  onFieldsChange?: (arg0?: any, arg1?: any) => void;
  onChange?: () => void;
}
const SearchForm: FC<SearchProps> = forwardRef(
  (
    props: SearchProps,
    ref: MutableRefObject<any> | ((instance: any) => void)
  ) => {
    const { config, handleSearch, beforeSearch, onFieldsChange } = props
    const [form] = Form.useForm()
    const getFields = (): JSX.Element[] => {
      return config.map((item: any) => {
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
      (prev: any, next: any) => ({ ...prev, [next.key]: next.initialValue }),
      {}
    )

    useImperativeHandle(ref, () => ({
      // 重置搜索字段
      resetFields(field: any) {
        return field ? form.resetFields([...field]) : form.resetFields()
      }
    }))

    return (
      <div className={style.content}>
        <Form
          form={form}
          initialValues={initialValues}
          onFieldsChange={onFieldsChange}
          layout="inline"
          onFinish={emitSearch}
        >
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
)

export default SearchForm
