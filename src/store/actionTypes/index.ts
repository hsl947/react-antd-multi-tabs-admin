/**
 * redux的 type常量
 * @param {name} string action 要 diapatch 的类型
 * @param {field} string action 要操作的字段名
 */
export default {
  SET_USERINFO: {
    name: 'SET_USERINFO',
    field: 'userInfo'
  },
  SET_COLLAPSED: {
    name: 'SET_COLLAPSED',
    field: 'collapsed'
  },
  SET_CURTAB: {
    name: 'SET_CURTAB',
    field: 'curTab'
  },
  SET_THEME: {
    name: 'SET_THEME',
    field: 'theme'
  },
  SET_RELOADPATH: {
    name: 'SET_RELOADPATH',
    field: 'reloadPath'
  }
}
