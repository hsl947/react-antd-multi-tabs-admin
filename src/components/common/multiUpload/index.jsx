import React from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Upload, Modal } from 'antd'
import store from '@/redux/store'
import uploadUrl from '@/config/upload'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

class PicturesWall extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: []
    }
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      const fileObj = await getBase64(file.originFileObj)
      Object.assign(file, {
        preview: fileObj
      })
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true
    })
  }

  handleChange = ({ fileList }) => this.setState({ fileList })

  render() {
    const { previewVisible, previewImage, fileList } = this.state
    const { token } = store.getState().storeData.userInfo
    const uploadButton = <PlusOutlined />
    return (
      <div className="clearfix">
        <Upload
          action={uploadUrl}
          fileList={fileList}
          headers={{
            token
          }}
          listType="picture-card"
          multiple
          onChange={this.handleChange}
          onPreview={this.handlePreview}
        >
          {uploadButton}
        </Upload>
        <Modal
          footer={null}
          onCancel={this.handleCancel}
          visible={previewVisible}
        >
          <img alt="example" src={previewImage} style={{ width: '100%' }} />
        </Modal>
      </div>
    )
  }
}

export default PicturesWall
