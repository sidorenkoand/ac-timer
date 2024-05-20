import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store/store';
import { openExternalLink, setAppActive } from '../services/electron/storage'
import type TimeRecord from '../models/TimeRecord'
import {
  resetTimeRecord,
  applyAddMinutes,
  saveState,
  getTrackedTimeRecord
} from '../store/slices/tracked-timerecord'
import { setNotActiveTracking } from '../store/slices/active-tracking'
import { decimalPlusMinutes } from '../services/time-converter';

const MINUTE_MILLISECONDS = 6000;

const TimeRecordTrack = (props: { timeRecord: TimeRecord }) => {
  const dispatch = useDispatch<AppDispatch>()
  const timeRecord = props.timeRecord
  const [addMinutes, setAddMinutes] = useState(0)
  const [isActive, setActive] = useState(true)
  const incrementAddMinutes = () => setAddMinutes(addMinutes + 1)
  const pause = () => setActive(false)
  const resume = () => setActive(true)
  const edit = () => {
    dispatch(applyAddMinutes(addMinutes))
    setAddMinutes(0)
    dispatch(setNotActiveTracking())
  }
  const discard = () => {
    dispatch(resetTimeRecord())
    setAddMinutes(0)
  }
  const save = async () => {
    dispatch(applyAddMinutes(addMinutes)) // add minutes from timer to the saved value
    setAddMinutes(0)
    const saveResultAction = await dispatch(saveState()) // save the state to database
    if (saveState.fulfilled.match(saveResultAction)) {
      dispatch(resetTimeRecord())
      dispatch(setNotActiveTracking())
    }
  }
  const time = decimalPlusMinutes(getTrackedTimeRecord()?.value ?? 0, addMinutes).getTime()

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined
    setAppActive(isActive).then()
    if (!interval && isActive) {
      interval = setInterval(() => incrementAddMinutes(), MINUTE_MILLISECONDS)
      return () => { clearInterval(interval) }
    } else if (interval && !isActive) {
      clearInterval(interval)
    }
  }, [isActive, addMinutes])

  if (!timeRecord.project || !timeRecord.task) {
    return ''
  }

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
                  Save <i className="bi-save"></i>
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
