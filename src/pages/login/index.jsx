// import React from 'react'
import { connect } from 'react-redux'
import LoginUi from './ui'

const mapStateToProps = (state) => {
  const { userInfo } = state.storeData
  return {
    userInfo
  }
}

const mapDispatchToProps = (dispatch) => ({
  setStore: (type, payload) => dispatch({ type, payload })
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginUi)
