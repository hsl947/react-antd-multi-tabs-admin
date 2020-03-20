import React from 'react'
import withBreadcrumbs from 'react-router-breadcrumbs-hoc'
import { Breadcrumb, Button } from 'antd'
// import { Link } from 'react-router-dom'
import routes from '@/route/routes'
import { flattenRoutes } from '@/assets/js/publicFunc'
import style from './Breadcrumb.module.less'

const allRoutes = flattenRoutes(routes)

// 通用面包屑
const Breadcrumbs = ({ breadcrumbs, history }) => {
  return (
    <Breadcrumb className={style.myBreadcrumb}>
      {breadcrumbs.map((bc, index) => {
        return (
          <Breadcrumb.Item key={bc.key}>
            <Button
              className={style.link}
              disabled={
                (!bc.exact && bc.match.path !== '/') ||
                index === breadcrumbs.length - 1
              }
              onClick={() => {
                history.push(bc.match.path)
              }}
              style={{ padding: '0' }}
              type="link"
            >
              {bc.name}
            </Button>
          </Breadcrumb.Item>
        )
      })}
    </Breadcrumb>
  )
}

export default withBreadcrumbs(allRoutes)(Breadcrumbs)
