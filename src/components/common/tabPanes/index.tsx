import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Tabs, Alert, Dropdown, Menu } from 'antd'
import Home from '@/pages/home'
import { getKeyName } from '@/assets/js/publicFunc'
import { SyncOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import actions from '@/store/actions'
import style from './TabPanes.module.less'

const mapStateToProps = (state: any) => {
  const { curTab, reloadPath } = state.storeData
  return {
    curTab,
    reloadPath
  }
}

const mapDispatchToProps = (dispatch: (arg0: any) => any) => ({
  setStoreData: (type: string, payload: any) => dispatch(actions(type, payload))
})

const { TabPane } = Tabs

const initPane = [
  {
    title: '首页',
    key: 'home',
    content: Home,
    closable: false,
    path: '/'
  }
]

// 多页签组件
class TabPanes extends Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      panes: initPane,
      isReload: false,
      selectedPanel: {}
    }
  }

  componentDidMount() {
    this.resetTabs()
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps: any) {
    const { panes } = this.state
    const { location } = this.props
    const {
      panesItem,
      tabActiveKey,
      location: { params, pathname, search = '' }
    } = nextProps

    // 如果从登陆页面进来，或需要刷新重置tab，刷新
    if ((params && params.reload) || location.pathname === '/login') {
      this.resetTabs()
      this.setState({
        activeKey: tabActiveKey
      })
      return
    }

    const index = panes.findIndex((_: any) => _.key === panesItem.key)
    const newPath = pathname + search
    // 无效的新tab，return
    if (!panesItem.key || (index > -1 && newPath === panes[index].path)) {
      this.setState({
        activeKey: tabActiveKey
      })
      return
    }

    // 新tab已存在，重新覆盖掉（解决带id地址数据错乱问题）
    if (index > -1) {
      panes[index].path = pathname + search
      this.setState({ panes, activeKey: tabActiveKey }, () => {
        this.storeTabs()
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
  resetTabs = (): void => {
    const {
      curTab,
      location: { pathname }
    } = this.props
    const initPanes = curTab.reduce((prev: any, next: any) => {
      const { title, tabKey, component: Content } = getKeyName(next)
      return [
        ...prev,
        {
          title,
          key: tabKey,
          content: Content,
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
  onChange = (activeKey: string): void => {
    this.setState({ activeKey })
  }

  // tab新增删除操作
  onEdit = (targetKey: string, action: string | number): void => {
    this[action](targetKey)
  }

  // tab点击
  onTabClick = (targetKey: string): void => {
    const { panes } = this.state
    const { history } = this.props
    const { path } = panes.filter((item: any) => item.key === targetKey)[0]
    history.push({ pathname: path })
  }

  // 移除tab
  remove = (targetKey: string): void => {
    const { history, curTab } = this.props
    const { panes, activeKey } = this.state
    const delIndex = panes.findIndex((item: any) => item.key === targetKey)
    panes.splice(delIndex, 1)

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

  // 刷新当前 tab
  refreshTab = (): void => {
    this.setState({ isReload: true }, () => {
      setTimeout(() => {
        this.setState({ isReload: false })
      }, 1000)
    })

    const {
      setStoreData,
      location: { pathname, search }
    } = this.props
    setStoreData('SET_RELOADPATH', pathname + search)
    setTimeout(() => {
      setStoreData('SET_RELOADPATH', 'null')
    }, 500)
  }

  // 关闭其他或关闭所有
  removeAll = async (isCloseAll?: boolean) => {
    const { history } = this.props
    const { selectedPanel } = this.state
    const { path, key } = selectedPanel
    history.push(path)
    this.setState(
      {
        panes: key !== 'home' ? [...initPane, selectedPanel] : [selectedPanel],
        activeKey: isCloseAll ? 'home' : key
      },
      () => {
        this.storeTabs()
      }
    )
  }

  // 记录当前打开的tab
  storeTabs(): void {
    const { panes } = this.state
    const { setStoreData } = this.props
    const pathArr = panes.reduce(
      (prev: any, next: any) => [...prev, next.path],
      []
    )
    setStoreData('SET_CURTAB', pathArr)
  }

  render() {
    const {
      onChange,
      onEdit,
      onTabClick,
      refreshTab,
      remove,
      removeAll
    }: any = this
    const { activeKey, panes, isReload, selectedPanel } = this.state

    const {
      reloadPath,
      defaultActiveKey,
      location: { pathname, search }
    } = this.props
    const fullPath = pathname + search

    const isDisabled = () => selectedPanel.key === 'home'
    // tab右击菜单
    const menu = (
      <Menu>
        <Menu.Item
          key="1"
          onClick={() => refreshTab()}
          disabled={selectedPanel.path !== fullPath}
        >
          刷新
        </Menu.Item>
        <Menu.Item
          key="2"
          onClick={(e) => {
            e.domEvent.stopPropagation()
            remove(selectedPanel.key)
          }}
          disabled={isDisabled()}
        >
          关闭
        </Menu.Item>
        <Menu.Item
          key="3"
          onClick={(e) => {
            e.domEvent.stopPropagation()
            removeAll()
          }}
        >
          关闭其他
        </Menu.Item>
        <Menu.Item
          key="4"
          onClick={(e) => {
            e.domEvent.stopPropagation()
            removeAll(true)
          }}
          disabled={isDisabled()}
        >
          全部关闭
        </Menu.Item>
      </Menu>
    )
    // 阻止右键默认事件
    const preventDefault = (e: any, panel: object) => {
      e.preventDefault()
      this.setState({
        selectedPanel: panel
      })
    }

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
          {panes.map((pane: any) => (
            <TabPane
              closable={pane.closable}
              key={pane.key}
              tab={
                <Dropdown
                  overlay={menu}
                  placement="bottomLeft"
                  trigger={['contextMenu']}
                >
                  <span onContextMenu={(e) => preventDefault(e, pane)}>
                    {isReload &&
                      pane.path === fullPath &&
                      pane.path !== '/403' && (
                        <SyncOutlined title="刷新" spin={isReload} />
                      )}
                    {pane.title}
                  </span>
                </Dropdown>
              }
            >
              {reloadPath !== pane.path ? (
                <pane.content path={pane.path} />
              ) : (
                <div style={{ height: '100vh' }}>
                  <Alert message="刷新中..." type="info" />
                </div>
              )}
            </TabPane>
          ))}
        </Tabs>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TabPanes))
