import { postReq } from '../client'
import { setAcUrl, setToken } from '../../electron/storage'

/**
 * Authorization
 */
export const authorize = async (url: string, email: string, password: string) => {
  url = url.replace(/\/$/, '')
  await setAcUrl(url)

  const response: AuthorizeResponse = await postReq('/issue-token', {
    username: email,
    password,
    client_name: 'Timer',
    client_vendor: 'Andrew'
  })

  if (response.is_ok && response.token) {
    await setToken(response.token)
  }
}

interface AuthorizeResponse {
  is_ok: boolean
  token: string
}
