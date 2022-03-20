import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@/store'
import { UserInfo } from '@/app_models/user'

export interface UserState {
  UserInfo: UserInfo & { is_oidc_user: boolean }
}

const initialState: UserState = {
  UserInfo: {
    username: '',
    displayName: '',
    permission: [],
    token: null,
    is_oidc_user: false
  }
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setUserInfo: (state, action) => {
      state.UserInfo = action.payload
    }
  }
})

export const { setUserInfo } = userSlice.actions

export const selectUserInfo = (state: RootState) => state.user.UserInfo

export default userSlice.reducer
