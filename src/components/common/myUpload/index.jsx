import React from 'react'
import PropTypes from 'prop-types'
import { Upload } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import uploadProps from '@/assets/js/customeUpload'

class MyUpload extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  render() {
    const { onChange, value, accept, size, isWatermark } = this.props
    const { loading } = this.state
    const uploadButton = loading ? <LoadingOutlined /> : <PlusOutlined />

    const onStart = () => {
      this.setState({
        loading: true
      })
      onChange('')
    }
    const onSuccess = ({ path }) => {
      this.setState({
        loading: false
      })
      onChange(path)
    }
    const onError = () => {}
    const uploadPropsObj = uploadProps(
      onStart,
      onSuccess,
      onError,
      accept,
      size,
      isWatermark
    )
    return (
      <Upload
        className="avatar-uploader"
        listType="picture-card"
        showUploadList={false}
        {...uploadPropsObj}
      >
        {value ? (
          <img alt="" src={value} style={{ maxWidth: '100%' }} />
        ) : (
          uploadButton
        )}
      </Upload>
    )
  }
}
MyUpload.propTypes = {
  isWatermark: PropTypes.number,
  accept: PropTypes.arrayOf(PropTypes.string),
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}
MyUpload.defaultProps = {
  isWatermark: 1,
  accept: ['jpg', 'jpeg', 'png', 'gif'],
  size: 5
}

export default MyUpload
