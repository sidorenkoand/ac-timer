import type Project from './Project.ts'
import type Task from './Task.ts'

export default interface TimeRecord {
  id: number
  project?: Project
  parent_type: 'Project' | 'Task'
  parent_id: number
  task: Task | undefined
  summary: string
  value: number
  value_save: string
  job_type_id: number
  record_date: number
  add_minutes: number
}
