import { useDispatch } from 'react-redux'
import { openExternalLink } from '../services/electron/storage'
import type Project from '../models/Project'
import type Task from '../models/Task'
import type TimeRecord from '../models/TimeRecord'
import { minusDay, plusDay, getRecordsDate } from '../store/slices/records-date'
import { projectTimeRecords, updateState } from '../store/slices/projects-timerecords'
import { getJobTypesList } from '../store/slices/job-types'
import { getDateFormatted } from '../services/active-collab/client'
import deleteTimeRecord from '../services/active-collab/endpoints/delete-time-record'
import { decimalToTime } from '../services/time-converter'
import { set as setTrackingTimeRecord } from '../store/slices/tracked-timerecord'
import { AppDispatch } from '../store/store';
import {useEffect} from "react";

const TimeRecordsList = () => {
  const dispatch = useDispatch<AppDispatch>()
  const date = getRecordsDate()

  useEffect(() => {
    dispatch(updateState())
  }, [date]);

  const changeDay = async (isPlusDay: boolean) => {
    isPlusDay ? dispatch(plusDay()) : dispatch(minusDay())
  }

  const timeRecords = projectTimeRecords();

  return (
    <div className="flex-column dynamic">
      <div className="date-switcher row">
        <div className="col-2 date-switcher__button">
          <a
            className="btn btn-outline-primary"
            href="#"
            onClick={async () => { await changeDay(false) }}>
            <i className="bi-chevron-left"></i>
          </a>
        </div>
        <div className="col-8 text-center">{getDateFormatted(new Date(date))}</div>
        <div className="col-2 text-end date-switcher__button">
          <a className="btn btn-outline-primary" href="#" onClick={async () => { await changeDay(true) }}>
            <i className="bi-chevron-right"></i>
          </a>
        </div>
      </div>

      <div className="dynamic">
      <List projects={timeRecords}/>
      </div>
      <Total projects={timeRecords}/>
    </div>
  )
}

const List = (props: { projects: Project[] }) => {
  return props.projects.map((project: Project) => {
    return (
      <div className="time-reports-project" key={project.id}>
        <ul className="list-group">
          <li className="list-group-item">
            <h5 className="header__title">
              <span className="clickable" onClick={() => { openExternalLink(project) }}>{project.name}</span>
            </h5>
          </li>
          {Array.isArray(project.tasks)
            ? project.tasks.map((task: Task) => {
              return task.time_records.map((timeRecord: TimeRecord) => {
                return <Item
                  key={timeRecord.id}
                  project={project}
                  task={task}
                  timeRecord={timeRecord}/>
              })
            })
            : ''}
          {Array.isArray(project.time_records)
            ? project.time_records.map((timeRecord: TimeRecord) => {
              return <Item
                key={timeRecord.id}
                project={project}
                timeRecord={timeRecord}/>
            })
            : ''}
        </ul>
      </div>
    )
  })
}

const Item = (props: { project: Project, timeRecord: TimeRecord, task?: Task }) => {
  const dispatch = useDispatch<AppDispatch>()
  const jobTypes = getJobTypesList()

  const project = props.project
  const timeRecord = props.timeRecord
  const task = props.task

  const edit = (timeRecord: TimeRecord, project: Project, task?: Task) => {
    timeRecord = { ...timeRecord } as TimeRecord
    timeRecord.task = task
    timeRecord.project = project
    dispatch(setTrackingTimeRecord(timeRecord))
  }

  const deleteRecord = (timeRecord: TimeRecord, project: Project) => {
    const timeRecordMutable = {...timeRecord} as TimeRecord
    timeRecordMutable.project = project
    deleteTimeRecord(timeRecordMutable).then(() => {
      dispatch(updateState())
    })
  }

  return (
    <li className="time-reports-task list-group-item">
      <div className="row">
        <div className="col-10 summary">
          <span>{timeRecord.summary}</span>
        </div>
        <div className="col-2 text-end report-time">
          <span>{decimalToTime(timeRecord.value)}</span>
        </div>
      </div>
      <div className="row additional-info">
        {task
          ? (
          <div className="col-8">
            <h6 className="task-name clickable" onClick={() => { openExternalLink(task) }}>
              {`#${task.task_number}: ${task.name}`}
            </h6>
          </div>
            )
          : ''}
        {jobTypes && jobTypes[timeRecord.job_type_id]
          ? (
          <div className="col-4 job-type">
            <h6 className="text-end">{jobTypes[timeRecord.job_type_id].name}</h6>
          </div>
            )
          : ''}
      </div>
      <div className="time-reports-item__buttons btn-group">
        {task
          ? (
          <a className="btn btn-primary btn-sm" onClick={() => { edit(timeRecord, project, task) }}>
            <i className="bi-pencil"></i>
          </a>
            )
          : ''}
        <a className="btn btn-warning btn-sm" onClick={() => { deleteRecord(timeRecord, project) }}>
          <i className="bi-trash"></i>
        </a>
      </div>
    </li>
  )
}

const Total = (props: { projects: Project[] }) => {
  let sum = 0
  let count = 0

  const sumTimeRecord = (timeRecord: TimeRecord) => {
    sum += timeRecord.value
    count++
  }

  props.projects?.forEach((project: Project) => {
    project.time_records?.forEach(sumTimeRecord)

    project.tasks?.forEach((task: Task) => {
      task.time_records?.forEach(sumTimeRecord)
    })
  })

  return (
    <div className="time-reports__total">
      <div className="row">
        <div className="col-6">
          Count: {count}
        </div>
        <div className="col-6 text-end">
          Total: {decimalToTime(sum)}
        </div>
      </div>
    </div>
  )
}

export default TimeRecordsList
