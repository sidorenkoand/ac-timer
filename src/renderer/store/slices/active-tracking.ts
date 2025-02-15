import { createSlice } from '@reduxjs/toolkit'
import { type RootState } from '../store'
import { useSelector } from 'react-redux'

interface ActiveTrackingState {
  value: boolean
}

const initialState: ActiveTrackingState = {
  value: false
}

const activeTrackingSlice = createSlice({
  name: 'active_tracking',
  initialState,
  reducers: {
    setActiveTracking: (state) => {
      state.value = true
    },
    setNotActiveTracking: (state) => {
      state.value = false
    }
  }
})

export const {
  setActiveTracking,
  setNotActiveTracking
} = activeTrackingSlice.actions
export const isTrackingActive = () => useSelector((state: RootState) => state.activeTracking.value)
export default activeTrackingSlice.reducer
