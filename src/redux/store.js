import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import promiseMiddleware from 'redux-promise'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import reducers from './reducers'

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2 // 查看 'Merge Process' 部分的具体情况
}

const myPersistReducer = persistReducer(persistConfig, reducers)

const store = createStore(myPersistReducer, applyMiddleware(promiseMiddleware))

export const persistor = persistStore(store)

export default store
