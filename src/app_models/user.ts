export interface Permission {
  code: string
  name: string
  description?: string
}

export interface UserInfo {
  username: string
  displayName?: string
  password?: string
  token: string
  permission: Permission[]
}
