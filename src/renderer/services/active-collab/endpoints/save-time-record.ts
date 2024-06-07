import { postReq, putReq } from '../client'
import type TimeRecord from '../../../models/TimeRecord'
import { decimalToTime } from '../../time-converter';

const timestampToDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000)
  return date.toISOString().split('T')[0]
}

/**
 * Create time record (time report)
 */
export const saveTimeRecord = async (timeRecord: TimeRecord) => {
  if (!timeRecord.project || !timeRecord.task) {
    console.error('Empty project or task.')
    return null
  }

  const url = `/projects/${timeRecord.project.id}/time-records`

  return timeRecord.id
    ? await putReq(`${url}/${timeRecord.id}`, {
      value: decimalToTime(timeRecord.value),
      job_type_id: timeRecord.job_type_id,
      summary: timeRecord.summary
    })
    : await postReq(url, {
      value: decimalToTime(timeRecord.value),
      job_type_id: timeRecord.job_type_id,
      summary: timeRecord.summary,
      parent_id: timeRecord.task.id,
      task_id: timeRecord.task.id,
      parent_type: 'Task',
      record_date: timestampToDate(timeRecord.record_date),
      billable_status: 1,
      source: "task_sidebar"
    })
}


export default saveTimeRecord
