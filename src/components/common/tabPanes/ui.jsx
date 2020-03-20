import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { dropByCacheKey } from 'react-router-cache-route'
import { Tabs } from 'antd'
import Home from '@/pages/home'
import { getKeyName } from '@/assets/js/publicFunc'
import style from './TabPanes.module.less'

const { TabPane } = Tabs

// 多页签组件
class TabPanes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      panes: [
        {
          title: '首页',
          key: 'home',
          content: <Home />,
          closable: false,
          path: '/'
        }
      ]
    }
  }

  componentDidMount() {
    this.resetTabs()
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { panes } = this.state
    const { history } = this.props
    const {
      panesItem,
      tabActiveKey,
      location: { params }
    } = nextProps

    // console.log(3333333333333)
    // console.log(nextProps, tabActiveKey)

    // 如果需要刷新重置tab，刷新
    if (params && params.reload) {
      history.go(0)
      return
    }

    // 无效的新tab或新tab已存在，return
    if (!panesItem.key || panes.some((item) => item.key === panesItem.key)) {
      this.setState({
        activeKey: tabActiveKey
      })
      return
    }

    // 添加新tab并保存起来
    panes.push(panesItem)
    this.setState({ panes, activeKey: tabActiveKey }, () => {
      this.storeTabs()
    })
  }

  // 从本地存储中恢复已打开的tab列表
  resetTabs = () => {
    const {
      curTab,
      location: { pathname }
    } = this.props
    const initPanes = curTab.reduce((prev, next) => {
      const { title, tabKey, component: Content } = getKeyName(next)
      return [
        ...prev,
        {
          title,
          key: tabKey,
          content: <Content />,
          closable: tabKey !== 'home',
          path: next
        }
      ]
    }, [])
    const activeKey = getKeyName(pathname).tabKey

    this.setState({
      panes: initPanes,
      activeKey
    })
  }

  // tab切换
  onChange = (activeKey) => {
    this.setState({ activeKey })
  }

  // tab新增删除操作
  onEdit = (targetKey, action) => {
    this[action](targetKey)
  }

  // tab点击
  onTabClick = (targetKey) => {
    const { panes } = this.state
    const { history } = this.props
    const { path } = panes.filter((item) => item.key === targetKey)[0]
    history.push({ pathname: path })
  }

  // 移除tab
  remove = (targetKey) => {
    const { history, curTab } = this.props
    const { panes, activeKey } = this.state
    const delIndex = panes.findIndex((item) => item.key === targetKey)
    panes.splice(delIndex, 1)

    // 删除页面缓存
    dropByCacheKey(targetKey)

    // 删除非当前tab
    if (targetKey !== activeKey) {
      const nextKey = activeKey
      this.setState({ panes, activeKey: nextKey }, () => {
        this.storeTabs()
      })
      return
    }
    // 删除当前tab，地址往前推
    const nextKey = panes[delIndex - 1].key
    const nextPath = curTab[delIndex - 1]
    history.push(nextPath)
    this.setState({ panes, activeKey: nextKey }, () => {
      this.storeTabs()
    })
  }

  // 记录当前打开的tab
  storeTabs() {
    const { panes } = this.state
    const { setStore } = this.props
    const pathArr = panes.reduce((prev, next) => [...prev, next.path], [])
    setStore('SET_CURTAB', pathArr)
  }

  render() {
    const { onChange, onEdit, onTabClick } = this
    const { activeKey, panes } = this.state
    const { defaultActiveKey } = this.props
    return (
      <div>
        <Tabs
          activeKey={activeKey}
          className={style.tabs}
          defaultActiveKey={defaultActiveKey}
          hideAdd
          onChange={onChange}
          onEdit={onEdit}
          onTabClick={onTabClick}
          type="editable-card"
        >
          {panes.map((pane) => (
            <TabPane closable={pane.closable} key={pane.key} tab={pane.title}>
              {pane.content}
            </TabPane>
          ))}
        </Tabs>
      </div>
    )
  }
}

export default withRouter(TabPanes)
