import { useDispatch } from 'react-redux'
import { set as setJobTypes } from '../store/slices/job-types'
import getJobTypes from '../services/active-collab/endpoints/get-job-types'
import { useEffect } from 'react'

const useUpdateJobTypes = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const fetchJobTypes = async () => dispatch(setJobTypes(await getJobTypes()))
    fetchJobTypes().then()
  }, [])
}

export default useUpdateJobTypes
