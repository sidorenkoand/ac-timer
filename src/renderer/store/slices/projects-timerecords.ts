import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type Project from '../../models/Project'
import { type RootState } from '../store'
import { useSelector } from 'react-redux'
import getTimeRecords from '../../services/active-collab/endpoints/get-time-records';

export const updateState = createAsyncThunk<
  Project[],
  void,
  { state: RootState }
>(
  'state/updateState',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState()
    const date = state.recordsDate.value
    try {
      return await getTimeRecords(new Date(date));
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateState.fulfilled, (state, action: PayloadAction<Project[]>) => {
        state.value = action.payload;
      })
      .addCase(updateState.rejected, (state, action) => {
        //todo: response errors processing can be added
        state.value = []
      });
  }
})

export const { set, reset } = projectsSlice.actions
export const projectTimeRecords = () => useSelector((state: RootState) => state.projectsTimeRecords.value)
export default projectsSlice.reducer
