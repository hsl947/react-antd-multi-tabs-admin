// import React from 'react'
import { connect } from 'react-redux'
import Ui from './ui'

const mapStateToProps = (state) => {
  const { curTab } = state.storeData
  return {
    curTab
  }
}

const mapDispatchToProps = (dispatch) => ({
  setStore: (type, payload) => dispatch({ type, payload })
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Ui)
