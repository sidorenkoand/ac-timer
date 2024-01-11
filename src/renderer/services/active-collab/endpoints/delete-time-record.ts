import { deleteReq } from '../client'
import type TimeRecord from '../../../models/TimeRecord'

/**
 * Delete time record (time report)
 */
const deleteTimeRecord = async (timeRecord: TimeRecord) => {
  if (!timeRecord.project?.id || !timeRecord.id) {
    console.error('Empty project or report ID ' + timeRecord.id +', project ID' + timeRecord.project?.id)
    return null
  }

  const url = `/projects/${timeRecord.project?.id}/time-records/${timeRecord.id}`

  return await deleteReq(url)
}

export default deleteTimeRecord
