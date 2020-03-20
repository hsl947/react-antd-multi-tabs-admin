// 🦄
import React from 'react'
import { withRouter } from 'react-router-dom'
import MenuView from '@/components/common/menu'
import classNames from 'classnames'
import { Layout } from 'antd'

import { getKeyName } from '@/assets/js/publicFunc'
import Header from '@/components/common/header'
import TabPanes from '@/components/common/tabPanes'
import styles from './Home.module.less'

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tabActiveKey: 'home',
      panesItem: {},
      noNewTab: ['/login']
    }
  }

  componentDidMount() {
    const { userInfo, history, setStore } = this.props
    const { token } = userInfo
    if (!token) {
      history.push({ pathname: '/login' })
      return
    }
    setStore('SET_COLLAPSED', false)
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { location } = this.props
    const { noNewTab } = this.state
    const { pathname } = location
    const { pathname: newPathname, search } = nextProps.location

    if (newPathname === pathname || noNewTab.includes(newPathname)) return

    const { tabKey, title, component: Content } = getKeyName(newPathname)
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

  render() {
    const { panesItem, tabActiveKey } = this.state
    const { collapsed } = this.props
    return (
      <Layout className={styles.container}>
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
      </Layout>
    )
  }
}

export default withRouter(Home)
