import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type Project from '../../models/Project'
import { useSelector } from 'react-redux'
import { type RootState } from '../store'

interface ProjectsState {
  value: Project[]
}

const initialState: ProjectsState = {
  value: []
}

const projectsSlice = createSlice({
  name: 'projects_tasks',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<Project[]>) => {
      state.value = action.payload
    }
  }
})

export const { set } = projectsSlice.actions
export const projectsTasks = () => useSelector((state: RootState) => state.projectsTasks.value)
export default projectsSlice.reducer
