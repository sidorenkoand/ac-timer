import { postReq, putReq } from '../client'
import type TimeRecord from '../../../models/TimeRecord'

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
      value: timeRecord.value_save,
      job_type_id: timeRecord.job_type_id,
      summary: timeRecord.summary
    })
    : await postReq(url, {
      value: timeRecord.value_save,
      job_type_id: timeRecord.job_type_id,
      summary: timeRecord.summary,
      task_id: timeRecord.task.id,
      record_date: timeRecord.record_date,
      billable_status: 1
    })
}

export default saveTimeRecord
