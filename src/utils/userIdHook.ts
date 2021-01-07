/**
 * 用于处理详情页多tab页签时，数据多余请求的问题
 * 当 userId 有值，且有变化时，才会去请求接口
 */

import { useRef } from 'react'

interface Props {
  userIdRef: RefType;
  canRequest: boolean;
}

const useControl = (userId: string): Props => {
  const userIdRef: RefType = useRef()

  // 如果没有 userId，或者 userId 不变
  if (!userId || userIdRef.current === userId) {
    return { userIdRef, canRequest: false }
  }

  // 记录上一次的 userId，用于比较
  userIdRef.current = userId
  return { userIdRef, canRequest: true }
}

export default useControl
