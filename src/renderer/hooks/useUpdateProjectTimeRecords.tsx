import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import getTimeRecords from '../services/active-collab/endpoints/get-time-records'
import { set as setProjectTimeRecords } from '../store/slices/projects-timerecords'
import {Dispatch} from "@reduxjs/toolkit";

const useUpdateProjectTimeRecords = (date: string, dispatchFromComponent?: Dispatch<any>) => {
  const dispatch = dispatchFromComponent ?? useDispatch()

  useEffect(() => {
    const fetchTimeRecords = async () => {
      dispatch(setProjectTimeRecords(await getTimeRecords(new Date(date))))
    }

    fetchTimeRecords().then()
  }, [date])
}

export default useUpdateProjectTimeRecords
