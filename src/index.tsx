import React from 'react'
import ReactDOM from 'react-dom'

import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { store, persistor } from '@/store'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
import App from './App'
import '@/assets/css/public.less'
import '@/utils'

moment.locale('zh-cn')

// https://mswjs.io/docs/getting-started/integrate/browser 浏览器环境MOCK
// if (process.env.NODE_ENV === 'development') {
//   const worker = require('./mocks/browser')
//   worker.start()
// }

ReactDOM.render(
  <ReduxProvider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConfigProvider locale={zhCN}>
        <App />
      </ConfigProvider>
    </PersistGate>
  </ReduxProvider>,
  document.getElementById('root')
)
