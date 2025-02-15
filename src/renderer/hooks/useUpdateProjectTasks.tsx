import { useDispatch } from 'react-redux'
import { set as setProjects } from '../store/slices/projects-tasks'
import getTasks from '../services/active-collab/endpoints/get-tasks'
import { useEffect } from 'react'

const useUpdateProjectTasks = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const fetchTasks = async () => dispatch(setProjects(await getTasks()))
    fetchTasks().then()
  }, [])
}

export default useUpdateProjectTasks
