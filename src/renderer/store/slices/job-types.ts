import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type JobTypesList } from '../../models/JobTypesList'
import { useSelector } from 'react-redux'
import { type RootState } from '../store'

interface JobTypesState {
  value: JobTypesList | null
}

const initialState: JobTypesState = {
  value: {}
}

const jobTypesSlice = createSlice({
  name: 'job-types',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<JobTypesList>) => {
      state.value = action.payload
    }
  }
})

export const { set } = jobTypesSlice.actions
export const getJobTypesList = () => useSelector((state: RootState) => state.jobTypes.value)
export default jobTypesSlice.reducer
