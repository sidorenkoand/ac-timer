import { putReq } from '../client'

/**
 * Update time record (time report)
 */
export const updateTimeReport = async (
  projectId: number,
  reportId: number,
  value: number,
  jobType: number,
  summary: string
) => {
  if (!projectId || projectId < 1 || !reportId || reportId < 1) {
    console.error('Empty project or report ID: ' + projectId, +', ' + reportId)
    return null
  }

  const url = `/projects/${projectId}/time-records/${reportId}`
  return await putReq(url, {
    value,
    job_type_id: jobType,
    summary
  })
}
