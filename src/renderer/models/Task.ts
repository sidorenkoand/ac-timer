import type Project from './Project.ts'
import type TimeRecord from './TimeRecord.ts'

export default interface Task {
  id: number
  name: string
  url_path: string
  project_id: number
  project?: Project
  time_records: TimeRecord[],
}
