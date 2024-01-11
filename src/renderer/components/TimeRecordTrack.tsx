import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { openExternalLink } from '../services/electron/storage'
import type TimeRecord from '../models/TimeRecord'
import {
  addMinute,
  resetTimeRecord,
  applyAddMinutes,
  saveState,
  getTrackedTime
} from '../store/slices/tracked-timerecord'
import { setNotActiveTracking } from '../store/slices/active-tracking'

const MINUTE_MILLISECONDS = 60000;

const TimeRecordTrack = (props: { timeRecord: TimeRecord }) => {
  const dispatch = useDispatch()
  const timeRecord = props.timeRecord
  const [isActive, setActive] = useState(true)

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined
    if (isActive) {
      interval = setInterval(() => dispatch(addMinute()), MINUTE_MILLISECONDS)
      return () => { clearInterval(interval) }
    } else if (interval) {
      clearInterval(interval)
    }
  }, [isActive])

  if (!timeRecord.project || !timeRecord.task) {
    return ''
  }

  const pause = () => {
    setActive(false)
  }
  const resume = () => {
    setActive(true)
  }
  const save = () => {
    dispatch(applyAddMinutes()) // add minutes from timer to the saved value
    dispatch(saveState()) // save the state to database
    dispatch(resetTimeRecord())
    dispatch(setNotActiveTracking())
  }
  const edit = () => {
    dispatch(applyAddMinutes())
    dispatch(setNotActiveTracking())
  }
  const discard = () => {
    dispatch(resetTimeRecord())
  }

  const time = getTrackedTime()

  return (
    <section className="track-time">
      <div className={"track-time__time " + (isActive ? 'red' : 'blue')}>
        <h1 className="track-time__title text-center">{time}</h1>
      </div>

      <div className="track-time__info">
        <div className="mb-3 row">
          <div className="col-3">Project</div>
          <div
            className="col-9 project-name clickable"
            onClick={() => timeRecord.project ? openExternalLink(timeRecord.project) : ''}
          >{timeRecord.project?.name}</div>
        </div>
        <div className="mb-3 row">
          <div className="col-3">Task</div>
          <div
            className="col-9 task-name clickable"
            onClick={() => timeRecord.task ? openExternalLink(timeRecord.task) : ''}
          >{timeRecord.task?.name}</div>
        </div>
      </div>

      <div className="buttons-panel">
        {isActive
          ? (
          <div className="row">
            <div className="col-12 text-center">
              <button className="btn btn-primary" type="button" onClick={() => { pause() }}>
                Pause <i className="bi-pause-fill"></i>
              </button>
            </div>
          </div>
          ) : (
          <div className="row">
            <div className="col-6">
              <div className="btn-group">
                <button className="btn btn-primary" type="button" onClick={() => { save() }}>
                  Done <i className="bi-save"></i>
                </button>
                <button className="btn btn-warning" type="button" onClick={() => { discard() }}>
                  Discard <i className="bi-trash"></i>
                </button>
              </div>
            </div>
            <div className="col-6 text-end">
              <div className="btn-group">
                <button className="btn btn-primary" type="button" onClick={() => { edit() }}>
                  Edit <i className="bi-pencil"></i>
                </button>
                <button className="btn btn-success" type="button" onClick={() => { resume() }}>
                  Track <i className="bi-stopwatch"></i>
                </button>
              </div>
            </div>
          </div>
            )}
      </div>
    </section>
  )
}

export default TimeRecordTrack
