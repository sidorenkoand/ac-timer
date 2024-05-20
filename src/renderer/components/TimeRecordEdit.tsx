import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store/store';
import { decimalToTime, timeToDecimal } from '../services/time-converter'
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
  const dispatch = useDispatch<AppDispatch>()
  const timeRecord = props.timeRecord
  const jobTypesList = getJobTypesList() ?? {}

  const mutableTimeRecord = { ...timeRecord } satisfies TimeRecord

  const backToTaskList = () => {
    dispatch(resetTimeRecord())
  }
  const save = async () => {
    dispatch(setTrackedTimeRecord(mutableTimeRecord))
    const saveResultAction = await dispatch(saveState())
    if (saveState.fulfilled.match(saveResultAction)) {
      dispatch(resetTimeRecord())
    }
  }
  const startTrackTime = () => {
    dispatch(setTrackedTimeRecord(mutableTimeRecord))
    dispatch(setActiveTracking())
  }

  const updateTime = (value: string) => {
    mutableTimeRecord.value = timeToDecimal(value)
  }

  return (
    <section className="edit-time-report">
      <div className="edit-time-report__form">
        <div className="mb-3 row">
          <label className="col-3 col-form-label">Time</label>
          <div className="col-9">
            <input
              className="form-control"
              defaultValue={decimalToTime(mutableTimeRecord.value)}
              onChange={(e) => updateTime(e.target.value)}/>
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
              Save <i className="bi-save"></i>
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
