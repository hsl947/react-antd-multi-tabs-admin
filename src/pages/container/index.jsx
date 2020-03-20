// import React from 'react'
import { connect } from 'react-redux'
import ContainerUi from './ui'

const mapStateToProps = (state) => {
  const { userInfo, collapsed, curTab } = state.storeData
  return {
    userInfo,
    collapsed,
    curTab
  }
}

const mapDispatchToProps = (dispatch) => ({
  setStore: (type, payload) => dispatch({ type, payload })
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContainerUi)
