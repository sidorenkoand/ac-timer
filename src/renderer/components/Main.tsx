import {isTrackingActive} from "../store/slices/active-tracking";
import {getTrackedTimeRecord} from "../store/slices/tracked-timerecord";
import Header from "./Header";
import TimeRecordTrack from "./TimeRecordTrack";
import TimeRecordEdit from "./TimeRecordEdit";
import Dashboard from "./Dashboard";
import useUpdateJobTypes from "../hooks/useUpdateJobTypes";

const Main = () => {
  useUpdateJobTypes()
  const trackingActiveState = isTrackingActive()
  const trackedTimeRecord = getTrackedTimeRecord()
  if (trackedTimeRecord && trackingActiveState) {
    return (
      <>
        <Header isAuth={true} title="Tracking Time"/>
        <TimeRecordTrack timeRecord={trackedTimeRecord}/>
      </>
    )
  } else if (trackedTimeRecord && !trackingActiveState) {
    return (
      <>
        <Header isAuth={true} title="Edit Time Record"/>
        <TimeRecordEdit timeRecord={trackedTimeRecord}/>
      </>
    )
  } else {
    return (
      <>
        <Header isAuth={true} title="Task list & Time reports"/>
        <Dashboard/>
      </>
    )
  }
}

export default Main
