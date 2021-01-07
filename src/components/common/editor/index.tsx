import 'braft-editor/dist/index.css'
import React, { FC } from 'react'
import BraftEditor from 'braft-editor'
import { message, Modal } from 'antd'
import $axios from '@/utils/axios'
import aliOss from './ali-oss'

interface Props {
  uploadType?: string;
  value?: string;
  onChange?: () => void;
}

const Editor: FC<Props> = (props) => {
  const { value, onChange, uploadType } = props

  const uploadFn = (param: CommonObjectType): void => {
    // 上传中
    const progressFn = (p: number) => {
      // 上传进度发生变化时调用param.progress
      param.progress(p * 100)
    }

    const successFn = (res: CommonObjectType) => {
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

    const errorFn = (err: string) => {
      message.destroy()
      message.error('上传失败')
      // 上传发生错误时调用param.error
      param.error({
        msg: err
      })
    }

    // 上传视频到oss
    if (uploadType === 'video') {
      aliOss(progressFn, param.file)
        .then((res: CommonObjectType) => {
          const video = {
            path: `https://xxx.oss-accelerate.aliyuncs.com${res.name}`
          }
          successFn(video)
        })
        .catch(errorFn)
      return
    }

    // 上传图片
    const serverURL = '/api/common/upload'
    const fd = new FormData()
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
  const validateFn = (file: {
    type: string | string[],
    size: number
  }): boolean => {
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

  const defaultControls: any[] = [
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

  // 自定义扩展
  const extendControls: any[] = [
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

  // 上传格式
  const accepts: object = {
    image: 'image/png, image/jpeg, image/gif',
    video: 'video/mp4'
  }

  return (
    <BraftEditor
      controls={defaultControls}
      media={{
        uploadFn,
        validateFn,
        accepts
      }}
      value={BraftEditor.createEditorState(value)}
      onChange={onChange}
      extendControls={extendControls}
      style={{ border: 'solid 1px rgba(0,0,0,.2)' }}
    />
  )
}

export default Editor
