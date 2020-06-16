import { message } from 'antd'
import OSS from 'ali-oss'
import moment from 'moment'
import common from '@/api'

export default async function ossUpload(
  progressFn?: (arg0?: any) => void,
  uploadFile?: any
) {
  const {
    accessKeyId,
    accessKeySecret,
    securityToken: stsToken,
    bucketName: bucket
  } = await common.getList()
  const client = () => {
    return new OSS({
      region: 'oss-cn-hangzhou',
      accessKeyId,
      accessKeySecret,
      stsToken,
      bucket
    })
  }
  // 要上传到oss上的路径
  const uploadPath = (path: string, file: any) => {
    return `/${path}/${moment().format('YYYYMMDD')}/${+new Date()}.${
      file.type.split('/')[1]
    }`
  }
  // 可选参数
  const extraParams = {
    progress: (p: number) => {
      progressFn(p)
    }
  }
  // 直传到oss方法
  const uploadToOss = (path: string, file: any) => {
    message.loading({ content: '上传中...', key: 'updatable', duration: 0 })
    const url = uploadPath(path, file)
    return new Promise((resolve, reject) => {
      client()
        .multipartUpload(url, file, extraParams)
        .then((data: any) => {
          resolve(data)
        })
        .catch((error: any) => {
          reject(error)
        })
    })
  }

  return uploadToOss('videos', uploadFile)
}
