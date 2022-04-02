import { ReactNode } from 'react'

export interface NestedRoute {
  path: string
  routes?: Array<NestedRoute>
}

type MenuType = 'menu' | 'subMenu'

export interface MenuRoute extends NestedRoute {
  // path: string
  name?: string
  routes?: MenuRoute[] | undefined
  authority?: string[] | string
  hideChildrenInMenu?: boolean
  hideInMenu?: boolean
  icon?: string | ReactNode
  locale?: string
  type?: MenuType

  [key: string]: any
}
