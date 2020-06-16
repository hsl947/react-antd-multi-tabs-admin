import { createStore, applyMiddleware, combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import promiseMiddleware from 'redux-promise'
import storage from 'redux-persist/lib/storage'
import storeData from '@/store/reducers'

const reducers = combineReducers({
  storeData
})

const persistConfig = {
  key: 'root',
  storage
}

const myPersistReducer = persistReducer(persistConfig, reducers)
const store: any = createStore(
  myPersistReducer,
  applyMiddleware(promiseMiddleware)
)
const persistor = persistStore(store)

export { store, persistor }
