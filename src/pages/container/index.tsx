import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import MenuView from '@/components/common/menu'
import classNames from 'classnames'
import { Layout, BackTop } from 'antd'
import { getKeyName, isAuthorized } from '@/assets/js/publicFunc'
import Header from '@/components/common/header'
import TabPanes from '@/components/common/tabPanes'
import { connect } from 'react-redux'
import actions from '@/store/actions'
import styles from './Home.module.less'

const mapStateToProps = (state: any) => {
  const { userInfo, collapsed, curTab } = state.storeData
  return {
    userInfo,
    collapsed,
    curTab
  }
}

const mapDispatchToProps = (dispatch: (arg0: any) => any) => ({
  setStoreData: (type: string, payload: any) => dispatch(actions(type, payload))
})

class Home extends Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      tabActiveKey: 'home',
      panesItem: {},
      noNewTab: ['/login'],
      noCheckAuth: ['/', '/403']
    }
  }

  componentDidMount() {
    const {
      userInfo = {},
      location: { pathname },
      history,
      setStoreData
    } = this.props
    const { token } = userInfo

    if (!token && pathname !== '/login') {
      history.replace({ pathname: '/login' })
      return
    }

    if (document.body.clientWidth <= 1366) {
      setStoreData('SET_COLLAPSED', true)
      return
    }
    setStoreData('SET_COLLAPSED', false)
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps: any) {
    const { location, history, userInfo = {} } = this.props
    const { noNewTab } = this.state
    const { pathname } = location
    const { pathname: newPathname, search } = nextProps.location
    const { token } = userInfo
    if (!token && newPathname !== '/login') {
      history.replace({ pathname: '/login' })
      return
    }

    const { tabKey, title, component: Content } = getKeyName(newPathname)
    // 新tab已存在或不需要新建tab，return
    if (newPathname === pathname || noNewTab.includes(newPathname)) {
      this.setState({
        tabActiveKey: tabKey
      })
      return
    }

    // 检查权限，比如直接从地址栏输入的，提示无权限
    const isHasAuth = this.checkAuth(newPathname)
    if (!isHasAuth) {
      const errorUrl = '/403'
      const {
        tabKey: errorKey,
        title: errorTitle,
        component: errorContent
      } = getKeyName(errorUrl)
      this.setState({
        panesItem: {
          title: errorTitle,
          content: errorContent,
          key: errorKey,
          closable: true,
          path: errorUrl
        },
        tabActiveKey: errorKey
      })
      history.replace(errorUrl)
      return
    }

    this.setState({
      panesItem: {
        title,
        content: Content,
        key: tabKey,
        closable: tabKey !== 'home',
        path: search ? newPathname + search : newPathname
      },
      tabActiveKey: tabKey
    })
  }

  checkAuth(newPathname: string): boolean {
    const { noCheckAuth } = this.state
    // 不需要检查权限的
    if (noCheckAuth.includes(newPathname)) {
      return true
    }
    const { tabKey: currentKey } = getKeyName(newPathname)
    return isAuthorized(currentKey)
  }

  render() {
    const { panesItem, tabActiveKey } = this.state
    const {
      collapsed,
      location: { pathname }
    } = this.props
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
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Home))
