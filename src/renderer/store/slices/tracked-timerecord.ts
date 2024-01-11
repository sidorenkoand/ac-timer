import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { type RootState } from '../store'
import type TimeRecord from '../../models/TimeRecord'
import type Task from '../../models/Task'
import { decimalToTime, TimeConverter } from '../../services/time-converter'
import saveTimeRecordEndpoint from '../../services/active-collab/endpoints/save-time-record'

interface TimeRecordState {
  value?: TimeRecord
}

const initialState: TimeRecordState = {
  value: undefined
}

const trackedTimeRecordSlice = createSlice({
  name: 'tracked_timerecord',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<TimeRecord>) => {
      state.value = action.payload
    },
    resetTimeRecord: (state) => {
      state.value = undefined
    },
    addMinute: (state) => {
      if (state.value) {
        state.value.add_minutes ? state.value.add_minutes++ : state.value.add_minutes = 1
      }
    },
    applyAddMinutes: (state) => {
      if (!state.value) {
        return
      }
      const converter = new TimeConverter()
      if (!state.value.value_save) {
        state.value.value_save = decimalToTime(state.value.value)
      }
      const minutes = converter.setTime(state.value.value_save).getMinutes()
      state.value.value_save = converter.setMinutes(minutes + Number(state.value.add_minutes)).getTime()
    },
    saveState: (state) => {
      if (state.value) {
        saveTimeRecordEndpoint(state.value).then()
      }
    },
    createNew: (state, action: PayloadAction<{task: Task, job_type_id: number}>) => {
      const task = action.payload.task
      const job_type_id = action.payload.job_type_id
      state.value = {
        project: task.project,
        parent_type: 'Task',
        parent_id: task.id,
        task,
        summary: '',
        value: 0,
        value_save: '',
        job_type_id: job_type_id,
        record_date: Math.floor(Date.now() / 1000),
        add_minutes: 0
      } as TimeRecord
    }
  }
})

export const {
  set,
  resetTimeRecord,
  addMinute,
  applyAddMinutes,
  saveState,
  createNew
} = trackedTimeRecordSlice.actions
export const getTrackedTimeRecord = () => useSelector((state: RootState) => state.trackedTimeRecord.value)
export const getTrackedTime = () => useSelector((state: RootState) => {
  const value = state.trackedTimeRecord.value?.value ?? 0
  const add_minutes = state.trackedTimeRecord.value?.add_minutes ?? 0
  const converter = new TimeConverter()
  return converter.setMinutes(converter.setDecimal(value).getMinutes() + add_minutes).getTime()
})
export default trackedTimeRecordSlice.reducer
