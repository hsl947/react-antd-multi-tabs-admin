import React, {
  FC,
  useState,
  useEffect,
  useRef,
  MutableRefObject,
  useCallback
} from 'react'
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
const TabPanes: FC<any> = (props: any) => {
  const [activeKey, setActiveKey] = useState<string>('')
  const [panes, setPanes] = useState<any[]>(initPane)
  const [isReload, setIsReload] = useState<boolean>(false)
  const [selectedPanel, setSelectedPanel] = useState<any>({})
  const pathRef: MutableRefObject<any> = useRef<string>('')

  const {
    location,
    history,
    setStoreData,
    curTab,
    defaultActiveKey,
    reloadPath,
    panesItem,
    tabActiveKey
  } = props

  const { pathname, search, params } = location

  const fullPath = pathname + search

  // 记录当前打开的tab
  const storeTabs = useCallback(
    (ps): void => {
      const pathArr = ps.reduce(
        (prev: any, next: any) => [...prev, next.path],
        []
      )
      setStoreData('SET_CURTAB', pathArr)
    },
    [setStoreData]
  )

  // 从本地存储中恢复已打开的tab列表
  const resetTabs = useCallback((): void => {
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
    const { tabKey } = getKeyName(pathname)
    setPanes(initPanes)
    setActiveKey(tabKey)
  }, [curTab, pathname])

  // 初始化页面
  useEffect(() => {
    resetTabs()
  }, [resetTabs])

  // tab切换
  const onChange = (tabKey: string): void => {
    setActiveKey(tabKey)
  }

  // 移除tab
  const remove = (targetKey: string): void => {
    const delIndex = panes.findIndex((item: any) => item.key === targetKey)
    panes.splice(delIndex, 1)

    // 删除非当前tab
    if (targetKey !== activeKey) {
      const nextKey = activeKey
      setPanes(panes)
      setActiveKey(nextKey)
      storeTabs(panes)
      return
    }

    // 删除当前tab，地址往前推
    const nextPath = curTab[delIndex - 1]
    history.push(nextPath)
    setPanes(panes)
    storeTabs(panes)
  }

  // tab新增删除操作
  const onEdit = (targetKey: string | any, action: string) =>
    action === 'remove' && remove(targetKey)

  // tab点击
  const onTabClick = (targetKey: string): void => {
    const { path } = panes.filter((item: any) => item.key === targetKey)[0]
    history.push({ pathname: path })
  }

  // 刷新当前 tab
  const refreshTab = (): void => {
    setIsReload(true)
    setTimeout(() => {
      setIsReload(false)
    }, 1000)

    setStoreData('SET_RELOADPATH', pathname + search)
    setTimeout(() => {
      setStoreData('SET_RELOADPATH', 'null')
    }, 500)
  }

  // 关闭其他或关闭所有
  const removeAll = async (isCloseAll?: boolean) => {
    const { path, key } = selectedPanel
    history.push(isCloseAll ? '/' : path)

    const homePanel = [
      {
        title: '首页',
        key: 'home',
        content: Home,
        closable: false,
        path: '/'
      }
    ]

    const nowPanes =
      key !== 'home' && !isCloseAll ? [...homePanel, selectedPanel] : homePanel
    setPanes(nowPanes)
    setActiveKey(isCloseAll ? 'home' : key)
    storeTabs(nowPanes)
  }

  useEffect(() => {
    const newPath = pathname + search

    // 当前的路由和上一次的一样，return
    if (!panesItem.path || panesItem.path === pathRef.current) return

    // 如果从登陆页面进来，或需要刷新重置tab，刷新
    if ((params && params.reload) || pathRef.current === '/login') {
      resetTabs()
      setActiveKey(tabActiveKey)
      pathRef.current = newPath
      return
    }

    // 保存这次的路由地址
    pathRef.current = newPath

    const index = panes.findIndex((_: any) => _.key === panesItem.key)
    // 无效的新tab，return
    if (!panesItem.key || (index > -1 && newPath === panes[index].path)) {
      setActiveKey(tabActiveKey)
      return
    }

    // 新tab已存在，重新覆盖掉（解决带参数地址数据错乱问题）
    if (index > -1) {
      panes[index].path = newPath
      setPanes(panes)
      setActiveKey(tabActiveKey)
      return
    }

    // 添加新tab并保存起来
    panes.push(panesItem)
    setPanes(panes)
    setActiveKey(tabActiveKey)
    storeTabs(panes)
  }, [
    panes,
    panesItem,
    params,
    pathname,
    resetTabs,
    search,
    storeTabs,
    tabActiveKey
  ])

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
    setSelectedPanel(panel)
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TabPanes))
