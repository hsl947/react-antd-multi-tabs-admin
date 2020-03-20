import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import PropTypes from 'prop-types'
import routes from './routes'

class RouterView extends Component {
  // 路由item
  setRouteItem = (routeItem, fn) => (
    <Route
      exact={!!routeItem.exact}
      key={routeItem.path}
      path={routeItem.path}
      cacheKey={routeItem.key}
      render={(props) => fn(props)}
    />
  )

  // 递归路由树 🌲
  createRouteItem = (routeItem) => {
    const {
      userInfo: { permission }
    } = this.props

    if (routeItem.isAuth) {
      const isHasAuth = permission.some((item) =>
        routeItem.key ? routeItem.key.includes(item.code) : false
      )
      if (!isHasAuth) {
        return this.setRouteItem(routeItem, () => (
          <Redirect key={routeItem.key} to="/403" />
        ))
      }
    }
    return this.setRouteItem(routeItem, (props) => (
      <routeItem.component {...props} />
    ))
  }

  createSwitchItem = (routeItem) =>
    this.setRouteItem(routeItem, () =>
      routeItem.routes.map((item) => this.renderRoutes(item))
    )

  // 递归路由树 🌲
  renderRoutes(routeItem) {
    if (routeItem.routes) {
      return this.createSwitchItem(routeItem)
    }
    return this.createRouteItem(routeItem)
  }

  render() {
    return <Switch>{routes.map((item) => this.renderRoutes(item))}</Switch>
  }
}

RouterView.propTypes = {
  userInfo: PropTypes.objectOf(PropTypes.any)
}
RouterView.defaultProps = {
  userInfo: {
    permission: []
  }
}

export default RouterView
