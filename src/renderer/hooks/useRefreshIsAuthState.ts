import { checkIsAuth } from "../services/electron/storage"
import { refresh } from "../store/slices/is-auth"
import {Dispatch} from "@reduxjs/toolkit";

const useRefreshIsAuthState = async (dispatch: Dispatch<any>) => {
  const isAuth = await checkIsAuth()
  dispatch(refresh(isAuth))
}

export default useRefreshIsAuthState