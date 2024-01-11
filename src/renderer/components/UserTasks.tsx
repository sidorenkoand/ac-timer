import type Task from '../models/Task'
import type Project from '../models/Project'
import { openExternalLink } from '../services/electron/storage'
import { projectsTasks } from '../store/slices/projects-tasks'
import useUpdateProjectTasks from '../hooks/useUpdateProjectTasks'
import { useDispatch } from 'react-redux'
import { createNew } from '../store/slices/tracked-timerecord'
import {getJobTypesList} from "../store/slices/job-types";

const UserTasks = () => {
  useUpdateProjectTasks()

  return projectsTasks().map((project: Project) => {
    return (
      <div key={'project' + project.id} className="project-item">
        <ul className="list-group">
          <li className="list-group-item">
            <h5 className="project-item__title">
              <span className="clickable" onClick={() => { openExternalLink(project) }}>{project.name}</span>
            </h5>
          </li>
          <List project={project} tasks={project.tasks}/>
        </ul>
      </div>
    )
  })
}

function List (props: { project: Project, tasks: Task[] }) {
  const dispatch = useDispatch()
  const tasks = props.tasks
  const project = props.project
  const jobTypesList = getJobTypesList()
  const jobTypeKeys = jobTypesList ? Object.keys(jobTypesList) : []
  const jobTypeFirstKey = jobTypeKeys.length > 0 ? Number(jobTypeKeys[0]) : 0

  const showTimeReport = (task: Task) => {
    dispatch(createNew({
      task: {...task, project} as Task,
      job_type_id: jobTypeFirstKey
    }))
  }

  return tasks
    ? tasks.map((task: Task) => {
      return (
      <li className="list-group-item" key={task.id}>
        <div className="row">
          <div className="col-10 task-name clickable" onClick={() => { openExternalLink(task) }}>{task.name}</div>
          <div className="col-2 text-end">
            <a href="#" className="btn btn-primary btn-sm" onClick={() => { showTimeReport(task) }}>
              <i className="bi-stopwatch"></i>
            </a>
          </div>
        </div>
      </li>
      )
    })
    : ''
}

export default UserTasks
