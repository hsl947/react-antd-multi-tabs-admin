import {
  Profile,
  User,
  UserManager,
  UserManagerSettings,
  WebStorageStateStore
} from 'oidc-client'
import { UserInfo } from '@/app_models/user'

class Constants {
  public static stsAuthority = process.env.REACT_APP_STS_URI as string // sts服务器

  public static clientId = process.env.REACT_APP_IDENTITY_CLIENT_ID as string // 客户端id

  public static clientRoot = process.env.REACT_APP_CLIENT_ROOT as string // 客户端根目录

  public static clientScope = 'openid profile email api' // 客户端访问Api域

  public static apiRoot = process.env.REACT_APP_API_ROOT as string // api根目录
}

export const oidcSettings: UserManagerSettings = {
  authority: Constants.stsAuthority,
  client_id: Constants.clientId,
  redirect_uri: `${Constants.clientRoot}signin-callback.html`, // # 可以以路由方式提供
  silent_redirect_uri: `${Constants.clientRoot}silent_renew.html`,

  post_logout_redirect_uri: `${Constants.clientRoot}`,
  response_type: 'code',
  scope: Constants.clientScope,
  // login: process.env.REACT_APP_STS_URI + '/login',
  // automaticSilentRenew: true, //(boolean, default: false): Flag to indicate if there should be an automatic attempt to renew the access token prior to its expiration.
  /*
  从后台加载用户数据,默认否.
  因为可以从jwt中解析出用户信息  parseJwt(auth.user?.access_token)
  但是如果是reference_token,那么就需要从后台获取用户信息
  */
  loadUserInfo: true,
  // 听众 一般指定为Api的域名
  //! audience: "https://example.com",
  // 如果服务端包含 access_token,那么就不需要指定responseType为: "id_token token"
  //! responseType: "id_token token", //(string, default: 'id_token'): The type of response desired from the OIDC provider.

  // X-FRAME-OPTION更新.F:\IdentityServer4.Admin-release-1.1.0\src\Skoruba.IdentityServer4.STS.Identity\Skoruba.IdentityServer4.STS.Identity.csproj Commit f50140ad
  // ! BUG 前端iframe超时应在renew令牌的时候不包含idToken (includeIdTokenInSilentRenew) https://github.com/IdentityModel/oidc-client-js/issues/172
  includeIdTokenInSilentRenew: false, // (boolean, default: true): Flag to indicate if the id_token should be included in the silent renew process.
  userStore: new WebStorageStateStore({ store: window.localStorage }) // default: sessionStorage:
}

export const parseJwt = (token) => {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace('-', '+').replace('_', '/')
  return JSON.parse(window.atob(base64))
}

export const userManager = new UserManager(oidcSettings)

export const normalize_roles = (profile: Profile) => {
  let roles: string[] | string = profile.role || profile.roles || []
  if (typeof roles === 'string') {
    roles = roles.replace(' ', ',').split(',')
  }
  return roles
}

// oidc 外部用户, 适配之后的用户, 即为UserInfo wit
interface OidcUser extends UserInfo {
  roleList?: any[]
  is_oidc_user: true
}

// 限时函数
const timeout = (prom, time) =>
  Promise.race([prom(), new Promise((_r, rej) => setTimeout(rej, time))])

// 转换函数
export type OidcUserAdaptFn<TUser extends OidcUser> = (
  user: User
) => Promise<TUser>

// 默认的适配函数.此处你可以通过api查询进行转换
async function defaultAdaptingUser<TUser extends OidcUser>(
  user: User
): Promise<TUser> {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const targetUser = <TUser>{
    username: user.profile.given_name || user.profile.name,
    displayName: user.profile.preferred_username || user.profile.given_name,
    token: user.access_token,
    is_oidc_user: true,
    roleList: normalize_roles(user.profile)
    // todo permissions handler
  }
  return targetUser
}

export async function callOidcLogin<TUser extends OidcUser>(
  storeCallback: (adoptedUser: TUser | null) => unknown,
  adoptingFn = defaultAdaptingUser,
  time = 5000 // 限时,以免oidc服务器超时
) {
  const user: User = await timeout(() => userManager.signinRedirect(), time)
  if (storeCallback) {
    storeCallback(user ? await adoptingFn<TUser>(user) : null)
  }
}

export async function loadOidcUser<TUser extends OidcUser>(
  storeCallback: (adoptedUser: TUser | null) => unknown, // 存储用户信息的回调
  adoptingFn = defaultAdaptingUser, // 适配函数,即把oidc的用户信息转换为本地用户信息
  time = 5000 // 限时,以免oidc服务器超时
) {
  const user: User = await timeout(() => userManager.getUser(), time)
  storeCallback(user ? await adoptingFn<TUser>(user) : null)
}

export async function oidcLogout() {
  return timeout(() => userManager.signoutRedirect(), 2000)
}
