import { getDateFormatted, getReq } from '../client'
import { getUserId } from '../../electron/storage'
import type TimeRecord from '../../../models/TimeRecord'
import type Project from '../../../models/Project'
import type Task from '../../../models/Task'

export default async function getTimeRecords (date: Date) {
  const response = await fetchTimeRecords(date)
  const timeRecords = response.time_records ?? []
  const projects = response.related?.Project ? Object.values(response.related?.Project) : []
  const tasks = response.related?.Task ? Object.values(response.related?.Task) : []

  if (!timeRecords || !projects) {
    return []
  }

  const projectsList: Record<number, Project> = {}
  projects.forEach((project: Project) => {
    projectsList[project.id] = project
  })

  const tasksList: Record<number, Task> = {}
  tasks.forEach((task: Task) => {
    tasksList[task.id] = task
    if (projectsList[task.project_id]) {
      if (!projectsList[task.project_id].tasks) {
        projectsList[task.project_id].tasks = []
      }
      projectsList[task.project_id].tasks.push(task)
    }
  })

  timeRecords.forEach((timeRecord: TimeRecord) => {
    if (timeRecord.parent_type === 'Project' && projectsList[timeRecord.parent_id]) {
      if (!projectsList[timeRecord.parent_id].time_records) {
        projectsList[timeRecord.parent_id].time_records = []
      }
      projectsList[timeRecord.parent_id].time_records.push(timeRecord)
    }

    if (timeRecord.parent_type === 'Task' && tasksList[timeRecord.parent_id]) {
      if (!tasksList[timeRecord.parent_id].time_records) {
        tasksList[timeRecord.parent_id].time_records = []
      }
      tasksList[timeRecord.parent_id].time_records.push(timeRecord)
    }
  })

  return Object.values(projectsList)
}

/**
 * Return time reports for current user
 */
async function fetchTimeRecords (date: Date): Promise<GetTimeReportsResponse> {
  const userId = await getUserId()
  let url = '/users/' + userId + '/time-records/filtered-by-date'

  // todo refactor this
  url = url + '?from=' + encodeURIComponent(getDateFormatted(date)) + '&to=' + encodeURIComponent(getDateFormatted(date))

  return await getReq(url)
}

interface GetTimeReportsResponse {
  time_records: TimeRecord[] | undefined
  related: {
    Project: Project[] | undefined
    Task: Task[] | undefined
  } | undefined
}
