import 'braft-editor/dist/index.css'
import React from 'react'
import BraftEditor from 'braft-editor'
import PropTypes from 'prop-types'
import { message, Modal } from 'antd'
import uploadUrl from '@/config/upload'
import $axios from '@/utils/axios'
import styles from './Style.module.css'

class Editor extends React.Component {
  uploadFn = (param) => {
    const uploadVideo = `${process.env.REACT_APP_BASE_URL}/api/common/uploadVideos`
    const { artType } = this.props
    const serverURL = artType === 'video' ? uploadVideo : uploadUrl
    const fd = new FormData()

    const successFn = (res) => {
      message.destroy()
      message.success({ content: '上传成功!', key: 'updatable', duration: 2 })
      // 假设服务端直接返回文件上传后的地址
      // 上传成功后调用param.success并传入上传后的文件地址
      param.success({
        url: res.path,
        meta: {
          loop: true, // 指定音视频是否循环播放
          autoPlay: true, // 指定音视频是否自动播放
          controls: true // 指定音视频是否显示控制栏
        }
      })
    }

    const errorFn = (err) => {
      message.destroy()
      message.error('上传失败')
      // 上传发生错误时调用param.error
      param.error({
        msg: err
      })
    }
    fd.append('file', param.file)
    message.loading({ content: '上传中...', key: 'updatable', duration: 0 })
    $axios
      .post(serverURL, fd)
      .then((res) => {
        successFn(res)
      })
      .catch(errorFn)
  }

  // 不允许添加尺寸大于10M的文件
  validateFn = (file) => {
    if (file.type.includes('image') && file.size > 1024 * 1000 * 5) {
      message.error('图片上传文件大小超出限制（10M）')
      return false
    }
    // 不允许添加尺寸大于100M的文件
    if (file.type.includes('video') && file.size > 1024 * 1000 * 100) {
      message.error('视频上传文件大小超出限制（100M）')
      return false
    }
    return true
  }

  render() {
    const { uploadFn, validateFn } = this
    const { artType, value, onChange } = this.props

    const defaultControls = [
      'fullscreen',
      'separator',
      'undo',
      'redo',
      'separator',
      'font-size',
      'line-height',
      'letter-spacing',
      'separator',
      'text-color',
      'bold',
      'italic',
      'underline',
      'strike-through',
      'hr',
      'separator',
      'superscript',
      'subscript',
      'remove-styles',
      'emoji',
      'separator',
      'text-indent',
      'text-align',
      'separator',
      'headings',
      'list-ul',
      'list-ol',
      'blockquote',
      'code',
      'separator',
      {
        key: 'media',
        title: '上传大小规范：图片不超过5M，视频不超过100M',
        text: '上传图片/视频（图片不超过5M，视频不超过100M）'
      },
      'separator',
      'link',
      'separator',
      'clear'
    ]
    const mediaControls = [
      'fullscreen',
      'separator',
      'undo',
      'redo',
      'separator',
      {
        key: 'media',
        title: '上传大小规范：图片不超过5M，视频不超过100M',
        text: '上传图片/视频（图片不超过5M，视频不超过100M）'
      },
      'separator',
      'clear'
    ]
    const controls = artType === 'article' ? defaultControls : mediaControls
    // 添加编辑图片时不能上传视频，添加编辑视频时不能上传图片
    const accepts = {
      image: artType === 'video' ? false : 'image/png, image/jpeg, image/gif',
      video: artType === 'picture' ? false : 'video/mp4'
    }
    // 自定义扩展
    const extendControls = [
      'separator',
      {
        key: 'view-html', // 控件唯一标识，必传
        type: 'button',
        title: '点击查看html内容', // 指定鼠标悬停提示文案
        text: '查看html', // 指定按钮文字，此处可传入jsx，若已指定html，则text不会显示
        onClick: () => {
          const { info } = Modal
          const curHtml = BraftEditor.createEditorState(value).toHTML()
          info({
            width: '60%',
            icon: false,
            title: '当前内容的html',
            maskClosable: true,
            okText: '关闭',
            content: curHtml
          })
        }
      }
    ]
    return (
      <BraftEditor
        controls={controls}
        media={{
          uploadFn,
          validateFn,
          accepts
        }}
        forceNewLine
        className={styles.editor}
        value={BraftEditor.createEditorState(value)}
        onChange={onChange}
        extendControls={extendControls}
      />
    )
  }
}

Editor.propTypes = {
  artType: PropTypes.string
}

Editor.defaultProps = {
  artType: 'article'
}

export default Editor
