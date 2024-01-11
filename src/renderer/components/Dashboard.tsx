import UserTasks from './UserTasks'
import TimeRecordsList from './TimeRecordsList'
import { getActiveTab, switchToReports, switchToTasks } from '../store/slices/active-tab'
import { useDispatch } from 'react-redux'

const Dashboard = () => {
  const dispatch = useDispatch()
  const activeTab = getActiveTab()

  return (
    <section className="projects-list">
      <div className="projects-list__tabs">
        <ul className="nav nav-tabs">
          <li className="projects-list__nav-item nav-item" onClick={() => dispatch(switchToTasks())}>
            <a className={"nav-link " + (activeTab === 'tasks' ? 'active' : '')} aria-current="page" href="#">Tasks</a>
          </li>
          <li className="projects-list__nav-item nav-item" onClick={() => dispatch(switchToReports())}>
            <a className={"nav-link " + (activeTab === 'reports' ? 'active' : '')} aria-current="page" href="#">Time Reports</a>
          </li>
        </ul>
      </div>

      {activeTab === 'tasks' ? <UserTasks/> : null}
      {activeTab === 'reports' ? <TimeRecordsList/> : null}

    </section>
  )
}

export default Dashboard
