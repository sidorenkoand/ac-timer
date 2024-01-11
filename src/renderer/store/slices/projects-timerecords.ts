import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type Project from '../../models/Project'
import { type RootState } from '../store'
import { useSelector } from 'react-redux'

interface ProjectsState {
  value: Project[]
}

const initialState: ProjectsState = {
  value: []
}

const projectsSlice = createSlice({
  name: 'projects_timerecords',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<Project[]>) => {
      state.value = action.payload
    },
    reset: (state) => {
      state.value = []
    },
  }
})

export const { set, reset } = projectsSlice.actions
export const projectTimeRecords = () => useSelector((state: RootState) => state.projectsTimeRecords.value)
export default projectsSlice.reducer
