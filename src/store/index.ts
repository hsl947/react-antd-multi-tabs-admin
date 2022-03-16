import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from 'redux'
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist'
import promiseMiddleware from 'redux-promise'
import tabReducer from '@/store/slicers/tabSlice'
import userReducer from '@/store/slicers/userSlice'
import appReducer from '@/store/slicers/appSlice'

const reducers = combineReducers({
  tab: tabReducer,
  user: userReducer,
  app: appReducer
})

const persistConfig = {
  key: 'root',
  storage
  // 以下是性能优化
  // whitelist = ['navigation']
  // blacklist = ['navigation']
}

const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat([promiseMiddleware])
})

export const persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
