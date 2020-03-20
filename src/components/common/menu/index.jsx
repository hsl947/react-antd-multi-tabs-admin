// import React from 'react'
import { connect } from 'react-redux'
import MenuUi from './ui'

const mapStateToProps = (state) => {
  const { userInfo, collapsed, menuKeys } = state.storeData
  return {
    userInfo,
    collapsed,
    menuKeys
  }
}

const mapDispatchToProps = (dispatch) => ({
  setStore: (type, payload) => dispatch({ type, payload })
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuUi)
