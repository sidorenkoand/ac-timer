import React, { useState } from 'react'
import { authorize } from '../services/active-collab/endpoints/authorize'
import useRefreshIsAuthState from "../hooks/useRefreshIsAuthState"
import {useDispatch} from "react-redux";

function Login () {
  const [url, setUrl] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const dispatch = useDispatch()

  const formSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await authorize(url, email, password)
    useRefreshIsAuthState(dispatch).then()
  }

  return (
    <section id="login">
      <form className="login-form" onSubmit={formSubmit}>
        <div className="mb-3">
          <label htmlFor="url" className="form-label">ActiveCollab Url</label>
          <input type="url" className="form-control" required value={url} onChange={(e) => { setUrl(e.target.value) }}/>
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" className="form-control" required value={email} onChange={(e) => { setEmail(e.target.value) }}/>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" required value={password} onChange={(e) => { setPassword(e.target.value) }}/>
        </div>
        <div className="text-center">
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </div>
      </form>
    </section>
  )
}

export default Login
