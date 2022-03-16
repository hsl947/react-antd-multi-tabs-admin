import React from 'react'
import ReactDOM from 'react-dom'

import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { persistor, store } from '@/store'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { loadOidcUser } from '@/config/oidc_setting'
import { setStoreData } from '@/store/actions'
import App from './App'
import '@/assets/css/public.less'
import '@/utils'

moment.locale('zh-cn')

// https://mswjs.io/docs/getting-started/integrate/browser 浏览器环境MOCK

let appReady = Promise.resolve()

// Enable API mocking only in development
if (process.env.NODE_ENV === 'development') {
  const worker = require('./mocks/browser').default
  console.log('Mocking API...', worker)

  appReady = worker.start({
    serviceWorker: {
      url: '/mockServiceWorker.js' //  static in public/mockServiceWorker.js
    },
    onUnhandledRequest: 'bypass'
  })
}

/**
 * Use deferred application mounting in order to work in a sandbox.
 * You MAY NOT need this in your application.
 * @see https://mswjs.io/docs/recipes/deferred-mounting
 */
appReady.then(async () => {
  await loadOidcUser((provided) => {
    store.dispatch(setStoreData('SET_USERINFO', provided))
  })

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
})
