import actionTypes from '@/store/actionTypes'

// eslint-disable-next-line import/prefer-default-export
export const setStoreData = (type: string, payload: any): object => {
  if (!actionTypes[type]) throw new Error('请传入修改的数据类型和值')
  return { type, payload }
}
