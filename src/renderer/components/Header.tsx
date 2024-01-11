import { clear } from '../services/electron/storage'
import useRefreshIsAuthState from "../hooks/useRefreshIsAuthState"
import {useDispatch} from "react-redux";

const Header = (props: {title: string, isAuth: boolean}) => {
  const dispatch = useDispatch()
  const logout = async () => {
    await clear()
    useRefreshIsAuthState(dispatch).then()
  }

  return (
    <header className="header">
      <div className="row header__row">
        <div className="col-9">
          <h5 className="header__title">{props.title}</h5>
        </div>
        <div className="col-3 text-end">
          {props.isAuth ? (
            <div>
              <button type="button" className="btn btn-primary" onClick={() => logout()}>
                Logout <i className="bi-door-open"></i>
              </button>
            </div>
          ) : ''}
        </div>
      </div>
    </header>
  )
}

export default Header;