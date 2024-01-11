import { useDispatch } from 'react-redux'
import { decimalToTime } from '../services/time-converter'
import {
  resetTimeRecord,
  set as setTrackedTimeRecord,
  saveState
} from '../store/slices/tracked-timerecord'
import { getJobTypesList } from '../store/slices/job-types'
import type JobType from '../models/JobType'
import type TimeRecord from '../models/TimeRecord'
import { setActiveTracking } from '../store/slices/active-tracking'
import { getDateFormatted } from '../services/active-collab/client'

const TimeRecordEdit = (props: { timeRecord: TimeRecord }) => {
  const dispatch = useDispatch()
  const timeRecord = props.timeRecord
  const jobTypesList = getJobTypesList() ?? {}

  const mutableTimeRecord = { ...timeRecord } satisfies TimeRecord
  if (!mutableTimeRecord.value_save) {
    mutableTimeRecord.value_save = decimalToTime(timeRecord.value)
  }

  const backToTaskList = () => {
    dispatch(resetTimeRecord())
  }
  const save = () => {
    dispatch(setTrackedTimeRecord(mutableTimeRecord))
    dispatch(saveState())
    dispatch(resetTimeRecord())
  }
  const startTrackTime = () => {
    dispatch(setTrackedTimeRecord(mutableTimeRecord))
    dispatch(setActiveTracking())
  }

  return (
    <section className="edit-time-report">
      <div className="edit-time-report__form">
        <div className="mb-3 row">
          <label className="col-3 col-form-label">Time</label>
          <div className="col-9">
            <input
              className="form-control"
              defaultValue={mutableTimeRecord.value_save}
              onChange={(e) => mutableTimeRecord.value_save = e.target.value}/>
          </div>
        </div>
        <div className="mb-3 row">
          <label className="col-3">Job Type</label>
          <div className="col-9">
            <select
              className="browser-default form-select"
              defaultValue={mutableTimeRecord.job_type_id}
              onChange={(e) => mutableTimeRecord.job_type_id = Number(e.target.value)}
            >
              {Object.values(jobTypesList).map((jobType: JobType) => {
                return (
                  <option key={jobType.id} value={jobType.id}>{jobType.name}</option>
                )
              })}
            </select>
          </div>
        </div>
        <div className="mb-3 row">
          <label className="col-3">Date</label>
          <div className="col-9">{getDateFormatted(new Date(mutableTimeRecord.record_date * 1000))}</div>
        </div>
        <div className="mb-3 row">
          <label className="col-3">Project</label>
          <div className="col-9">{mutableTimeRecord.project?.name}</div>
        </div>
        <div className="mb-3 row">
          <label className="col-3">Task</label>
          <div className="col-9">{mutableTimeRecord.task?.name}</div>
        </div>
        <div className="mb-3 row">
          <label className="col-3">Description</label>
          <div className="col-9">
            <textarea
              className="form-control"
              rows={3}
              defaultValue={mutableTimeRecord.summary}
              onChange={(e) => mutableTimeRecord.summary = e.target.value}
            />
          </div>
        </div>
      </div>

      <div className="buttons-panel">
        <div className="row">
          <div className="col-6">
            <a className="btn btn-warning" onClick={() => { backToTaskList() }}>
              <i className="bi-backspace"></i> Back
            </a>
          </div>
          <div className="col-6 text-end btn-group">
            <button className="btn btn-primary" type="button" onClick={() => { save() }}>
              Done <i className="bi-save"></i>
            </button>
            <button className="btn btn-success" type="button" onClick={() => { startTrackTime() }}>
              Track <i className="bi-stopwatch"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TimeRecordEdit
