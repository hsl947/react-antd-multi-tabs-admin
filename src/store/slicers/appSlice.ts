import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/store'

export interface AppState {
  theme: string
  collapsed: boolean // 菜单收纳状态
}

const initialState: AppState = {
  collapsed: false,
  theme: 'dark'
}

export const appSlice = createSlice({
  name: 'user',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload
    },
    setCollapsed(state, action) {
      state.collapsed = action.payload
    }
  }
})

export const { setCollapsed, setTheme } = appSlice.actions

export const selectTheme = (state: RootState) => state.app.theme
export const selectCollapsed = (state: RootState) => state.app.collapsed

export default appSlice.reducer
