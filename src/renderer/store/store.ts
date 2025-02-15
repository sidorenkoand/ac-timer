import { configureStore } from '@reduxjs/toolkit'
import isAuthReducer from './slices/is-auth'
import projectsTasksReducer from './slices/projects-tasks'
import projectsTimerecordsReducer from './slices/projects-timerecords'
import JobTypesReducer from './slices/job-types'
import RecordsDateReducer from './slices/records-date'
import TrackedTimeRecordReducer from './slices/tracked-timerecord'
import ActiveTrackingReducer from './slices/active-tracking'
import ActiveTabReducer from './slices/active-tab'

const store = configureStore({
  reducer: {
    isAuth: isAuthReducer,
    projectsTasks: projectsTasksReducer,
    projectsTimeRecords: projectsTimerecordsReducer,
    jobTypes: JobTypesReducer,
    recordsDate: RecordsDateReducer,
    activeTracking: ActiveTrackingReducer,
    trackedTimeRecord: TrackedTimeRecordReducer,
    activeTab: ActiveTabReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export default store;