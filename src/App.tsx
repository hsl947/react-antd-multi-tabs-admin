import React, { Component } from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import Container from '@/pages/container'
import Login from '@/pages/login'
import { BackTop } from 'antd'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Route exact path="/login" component={Login} />
          <Route
            path="/"
            key="container"
            render={(props) => <Container {...props} />}
          />
        </Router>
        <BackTop visibilityHeight={1080} />
      </div>
    )
  }
}

export default App
