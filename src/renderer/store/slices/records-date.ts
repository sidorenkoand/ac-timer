import { createSlice } from '@reduxjs/toolkit'
import { getDateFormatted } from '../../services/active-collab/client'
import { useSelector } from 'react-redux'
import { type RootState } from '../store'

interface RecordsDateState {
  value: string
}

const initialState: RecordsDateState = {
  value: getDateFormatted(new Date())
}

const recordsDateSlice = createSlice({
  name: 'reports-date',
  initialState,
  reducers: {
    minusDay: (state) => {
      const date = new Date(state.value)
      date.setDate(date.getDate() - 1)
      state.value = getDateFormatted(date)
    },
    plusDay: (state) => {
      const date = new Date(state.value)
      date.setDate(date.getDate() + 1)
      state.value = getDateFormatted(date)
    }
  }
})

export const { minusDay, plusDay } = recordsDateSlice.actions
export const getRecordsDate = () => useSelector((state: RootState) => state.recordsDate.value)
export default recordsDateSlice.reducer
