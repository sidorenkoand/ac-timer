import { getReq } from '../client'
import type JobType from '../../../models/JobType'
import { type JobTypesList } from '../../../models/JobTypesList'

const getJobTypes = async () => {
  const jobTypes = await fetchJobTypes()
  const jobTypesList: JobTypesList = {}

  jobTypes.forEach((jobType: JobType) => {
    jobTypesList[jobType.id] = jobType
  })

  return jobTypesList
}

const fetchJobTypes = async (): Promise<JobType[]> => {
  return await getReq('/job-types')
}

export default getJobTypes
