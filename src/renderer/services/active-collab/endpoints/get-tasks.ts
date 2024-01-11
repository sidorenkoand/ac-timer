import { getReq } from '../client'
import { getUserId } from '../../electron/storage'
import type Task from '../../../models/Task'
import type Project from '../../../models/Project'

export default async function getTasks () {
  const response = await fetchTasks()
  const tasks = response.tasks || []
  const projects = Object.values(response.related?.Project ?? {})

  if (!tasks || !projects) {
    return []
  }

  const projectsList: Record<number, Project> = {}
  projects.forEach((project: Project) => {
    projectsList[project.id] = project
  })

  tasks.map((task: Task) => {
    if (!Array.isArray(projectsList[task.project_id].tasks)) {
      projectsList[task.project_id].tasks = []
    }
    if (projectsList[task.project_id]) {
      projectsList[task.project_id].tasks.push(task)
    }
  })

  return Object.values(projectsList)
}

/**
 * Return opened tasks for current user
 */
async function fetchTasks (): Promise<GetTasksResponse> {
  const userId = await getUserId()
  if (userId === 0) {
    throw "Can't find current user ID"
  }

  return await getReq(`/users/${userId}/tasks`)
}

interface GetTasksResponse {
  tasks: Task[] | undefined
  related: {
    Project: Project[] | undefined
  } | undefined
}
