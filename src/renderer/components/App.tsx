import Login from './Login'
import Header from "./Header";
import { isAuth } from "../store/slices/is-auth";
import Main from "./Main";
import useRefreshIsAuthState from "../hooks/useRefreshIsAuthState";
import {useDispatch} from "react-redux";

function App() {
  const dispatch = useDispatch()
  //Refresh isAuth state
  useRefreshIsAuthState(dispatch).then()
  if (isAuth()) {
    return <Main/>
  } else {
    return (
      <>
        <Header isAuth={false} title="Sign in"/>
        <Login/>
      </>
    )
  }
}

export default App
