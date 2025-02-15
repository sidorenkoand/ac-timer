import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { type RootState } from '../store'

interface IsAuthState {
  value: boolean
}

const initialState: IsAuthState = {
  value: false
}

const isAuthSlice = createSlice({
  name: 'is-auth',
  initialState,
  reducers: {
    refresh: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload
    },
  }
})

export const { refresh } = isAuthSlice.actions
export const isAuth = () => useSelector((state: RootState) => state.isAuth.value)
export default isAuthSlice.reducer
