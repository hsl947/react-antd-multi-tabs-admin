import React, { FC, useState } from 'react'
import { Upload, message } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import $axios from '@/utils/axios'

interface Props {
  onChange?: (arg0: string) => void;
  value?: string;
  accept?: string[];
  size?: number;
  action?: string;
}

const MyUpload: FC<Props> = (props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const {
    onChange,
    value,
    accept = ['jpg', 'jpeg', 'png', 'gif'],
    size = 5,
    action = '/api/common/upload'
  } = props

  const uploadButton = loading ? <LoadingOutlined /> : <PlusOutlined />

  const onStart = (): void => {
    setLoading(true)
    onChange(undefined)
  }

  const onSuccess = ({ path }: CommonObjectType) => {
    setLoading(false)
    onChange(path)
  }

  const onError = (): void => {}

  const uploadProps = {
    action,
    onStart,
    customRequest({ file, filename }) {
      const isType = accept.some((item: string) => file.type.includes(item))
      const isSize = file.size / 1024 / 1024 < size
      if (!isType || !isSize) {
        message.error('请上传正确文件')
        return false
      }
      const formData = new FormData()
      formData.append(filename, file)
      $axios
        .post(action, formData)
        .then((res) => {
          onSuccess(res)
        })
        .catch(onError)
      return {
        abort() {
          // console.log('upload progress is aborted.')
        }
      }
    }
  }

  return (
    <Upload
      className="avatar-uploader"
      listType="picture-card"
      showUploadList={false}
      {...uploadProps}
    >
      {value ? (
        <img alt="" src={value} style={{ maxWidth: '100%' }} />
      ) : (
        uploadButton
      )}
    </Upload>
  )
}

export default MyUpload
