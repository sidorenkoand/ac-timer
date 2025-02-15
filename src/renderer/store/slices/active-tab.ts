import { createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { type RootState } from '../store'

interface ActiveTabState {
  value: 'tasks' | 'reports'
}

const initialState: ActiveTabState = {
  value: 'tasks'
}

const activeTabSlice = createSlice({
  name: 'active-tab',
  initialState,
  reducers: {
    switchToTasks: (state) => {
      state.value = 'tasks'
    },
    switchToReports: (state) => {
      state.value = 'reports'
    }
  }
})

export const { switchToTasks, switchToReports } = activeTabSlice.actions
export const getActiveTab = () => useSelector((state: RootState) => state.activeTab.value)
export default activeTabSlice.reducer
