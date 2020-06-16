interface StoreState {
  userInfo: {
    userName: string,
    permission: string[],
    token: string
  };
  collapsed: boolean;
  curTab: string[];
  theme: string;
  reloadPath: string;
}

const initState: StoreState = {
  userInfo: {
    userName: '',
    permission: [],
    token: ''
  }, // 用户信息
  collapsed: false, // 菜单收纳状态
  curTab: [], // 当前tab页面
  theme: '', // 网站主题
  reloadPath: 'null' // 需要刷新的tab路径
}

export default initState
