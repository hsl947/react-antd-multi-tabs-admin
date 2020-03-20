const initState = {
  userInfo: {
    userName: '',
    permission: [],
    token: ''
  },
  // 菜单收纳状态
  collapsed: false,
  menuKeys: [], // 菜单的全部key
  curTab: [] // 当前tab页面
}

function storeData(state = initState, action) {
  switch (action.type) {
    case 'SET_USERINFO': // 设置用户信息
      return {
        ...state,
        userInfo: action.payload
      }
    case 'SET_COLLAPSED': // 切换菜单收纳状态
      return {
        ...state,
        collapsed: action.payload
      }
    case 'SET_MENU_KEY': // 菜单的全部key
      return {
        ...state,
        menuKeys: action.payload
      }
    case 'SET_CURTAB': // 当前tab页面
      return {
        ...state,
        curTab: action.payload
      }
    default:
      return state
  }
}

export default storeData
