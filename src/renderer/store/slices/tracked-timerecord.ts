import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { type RootState } from '../store'
import type TimeRecord from '../../models/TimeRecord'
import type Task from '../../models/Task'
import { decimalPlusMinutes } from '../../services/time-converter'
import saveTimeRecordEndpoint from '../../services/active-collab/endpoints/save-time-record'

export const saveState = createAsyncThunk<
  void,
  void,
  { state: RootState }
>(
  'state/saveState',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const timeRecord = state.trackedTimeRecord.value;
    if (timeRecord) {
      try {
        await saveTimeRecordEndpoint(timeRecord)
      } catch (error) {
        return thunkAPI.rejectWithValue(error)
      }
    }
  }
);

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
    applyAddMinutes: (state, action: PayloadAction<number>) => {
      if (!state.value) {
        return
      }
      state.value.value = decimalPlusMinutes(state.value.value, action.payload).getDecimal()
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
        job_type_id: job_type_id,
        record_date: Math.floor(Date.now() / 1000),
      } as TimeRecord
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveState.fulfilled, (state, action) => {
        // Process saveState
      })
      .addCase(saveState.rejected, (state, action) => {
        // Process saveState
      });
  }
})

export const {
  set,
  resetTimeRecord,
  applyAddMinutes,
  createNew
} = trackedTimeRecordSlice.actions
export const getTrackedTimeRecord = () => useSelector((state: RootState) => state.trackedTimeRecord.value)
export default trackedTimeRecordSlice.reducer
