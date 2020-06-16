import actionTypes from '@/store/actionTypes'

const setStoreData = (type: string, payload: any): object => {
  if (!actionTypes[type]) throw new Error('请传入修改的数据类型和值')
  return { type, payload }
}

export default setStoreData
