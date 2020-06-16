import initState from '@/store/state'
import actionTypes from '@/store/actionTypes'

interface StoreAction {
  type: string;
  payload: any;
}

const storeData = (
  state = initState,
  { type, payload }: StoreAction
): object => {
  if (!actionTypes[type]) return state
  const { field } = actionTypes[type]
  return {
    ...state,
    [field]: payload
  }
}

export default storeData
