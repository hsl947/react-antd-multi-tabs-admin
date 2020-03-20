import React, { Component } from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import RouterSwitch from '@/route'
import Container from '@/pages/container'
import Login from '@/pages/login'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Route exact path="/login" component={Login} />
          <Route
            path="/"
            key="container"
            render={(props) => (
              <Container {...props}>
                <RouterSwitch />
              </Container>
            )}
          />
        </Router>
      </div>
    )
  }
}

export default App
