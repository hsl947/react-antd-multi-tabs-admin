import React, { FC, useState, useEffect, useRef, Component } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import MenuView from '@/components/common/menu'
import classNames from 'classnames'
import { Layout, BackTop } from 'antd'
import { getKeyName, isAuthorized } from '@/assets/js/publicFunc'
import Header from '@/components/common/header'
import TabPanes from '@/components/common/tabPanes'
import { connect } from 'react-redux'
import * as actions from '@/store/actions'
import styles from './Home.module.less'

const noNewTab = ['/login'] // 不需要新建 tab的页面
const noCheckAuth = ['/', '/403'] // 不需要检查权限的页面
// 检查权限
const checkAuth = (newPathname: string): boolean => {
  // 不需要检查权限的
  if (noCheckAuth.includes(newPathname)) {
    return true
  }
  const { tabKey: currentKey } = getKeyName(newPathname)
  return isAuthorized(currentKey)
}

interface Props extends ReduxProps {}

interface PanesItemProps {
  title: string;
  content: Component;
  key: string;
  closable: boolean;
  path: string;
}

const Home: FC<Props> = (props) => {
  const [tabActiveKey, setTabActiveKey] = useState<string>('home')
  const [panesItem, setPanesItem] = useState<PanesItemProps>({
    title: '',
    content: null,
    key: '',
    closable: false,
    path: ''
  })
  const pathRef: RefType = useRef<string>('')

  const history = useHistory()
  const { pathname, search } = useLocation()

  const {
    storeData: { collapsed, userInfo },
    setStoreData
  } = props
  const { token } = userInfo

  useEffect(() => {
    setStoreData('SET_COLLAPSED', document.body.clientWidth <= 1366)

    // 未登录
    if (!token && pathname !== '/login') {
      history.replace({ pathname: '/login' })
      return
    }

    const { tabKey, title, component: Content } = getKeyName(pathname)
    // 新tab已存在或不需要新建tab，return
    if (pathname === pathRef.current || noNewTab.includes(pathname)) {
      setTabActiveKey(tabKey)
      return
    }

    // 检查权限，比如直接从地址栏输入的，提示无权限
    const isHasAuth = checkAuth(pathname)
    if (!isHasAuth) {
      const errorUrl = '/403'
      const {
        tabKey: errorKey,
        title: errorTitle,
        component: errorContent
      } = getKeyName(errorUrl)
      setPanesItem({
        title: errorTitle,
        content: errorContent,
        key: errorKey,
        closable: true,
        path: errorUrl
      })
      pathRef.current = errorUrl
      setTabActiveKey(errorKey)
      history.replace(errorUrl)
      return
    }

    // 记录新的路径，用于下次更新比较
    const newPath = search ? pathname + search : pathname
    pathRef.current = newPath
    setPanesItem({
      title,
      content: Content,
      key: tabKey,
      closable: tabKey !== 'home',
      path: newPath
    })
    setTabActiveKey(tabKey)
  }, [history, pathname, search, setStoreData, token])

  return (
    <Layout
      className={styles.container}
      onContextMenu={(e) => e.preventDefault()}
      style={{ display: pathname.includes('/login') ? 'none' : 'flex' }}
    >
      <MenuView />
      <Layout
        className={classNames(styles.content, {
          [styles.collapsed]: collapsed
        })}
      >
        <Header />
        <Layout.Content>
          <TabPanes
            defaultActiveKey="home"
            panesItem={panesItem}
            tabActiveKey={tabActiveKey}
          />
        </Layout.Content>
      </Layout>
      <BackTop visibilityHeight={1080} />
    </Layout>
  )
}

export default connect(
  (state) => state,
  actions
)(Home)
