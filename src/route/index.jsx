// import React from 'react'
import { connect } from 'react-redux'
import RouterUi from './ui'

const mapStateToProps = (state) => {
  const { userInfo } = state.storeData
  return {
    userInfo
  }
}

export default connect(mapStateToProps)(RouterUi)
