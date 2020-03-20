import React from 'react'
import ReactDOM from 'react-dom'

import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import moment from 'moment'
import store, { persistor } from '@/redux/store'
import 'moment/locale/zh-cn'
import App from './App'
import '@/assets/css/public.less'
import '@/utils'

moment.locale('zh-cn')

ReactDOM.render(
  <ReduxProvider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </ReduxProvider>,
  document.getElementById('root')
)
