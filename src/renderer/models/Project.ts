import type Task from './Task'
import type TimeRecord from './TimeRecord'

export default interface Project {
  id: number
  name: string
  url_path: string
  tasks: Task[]
  time_records: TimeRecord[]
}
