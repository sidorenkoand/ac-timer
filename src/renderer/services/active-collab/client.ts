import {getAcUrl, getToken} from "../electron/storage";

const postReq = async (url: string, data: object) => {
  const response = await fetch(await getApiUrl(url), {
    method: 'POST',
    body: JSON.stringify(data),
    headers: await getHeader()
  })

  if (!response.ok) {
    throw new Error(`Response error: ${response.toString()}`)
  }

  return await response.json()
}

const putReq = async (url: string, data: object) => {
  const response = await fetch(await getApiUrl(url), {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: await getHeader()
  })

  if (!response.ok) {
    throw new Error(`Response error: ${response.toString()}`)
  }

  return await response.json()
}

const getReq = async (url: string) => {
  const response = await fetch(await getApiUrl(url), {
    method: 'GET',
    headers: await getHeader()
  })

  if (!response.ok) {
    throw new Error(`Response error: ${response.toString()}`)
  }

  return await response.json()
}

/**
 * Delete something
 */
const deleteReq = async (url: string) => {
  const response = await fetch(await getApiUrl(url), {
    method: 'DELETE',
    headers: await getHeader()
  })

  if (!response.ok) {
    throw new Error(`Response error: ${response.toString()}`)
  }

  return await response.json()
}

/**
 * Return header object
 */
const getHeader = async (): Promise<Headers> => {
  const headers = new Headers()
  const token = await getToken()

  headers.append('Content-Type', 'application/json')
  if (token) {
    headers.append('X-Angie-AuthApiToken', token)
  }

  return headers
}

/**
 * Return base url for AC API
 */
const getApiUrl = async (uri: string = ''): Promise<string> => {
  let url = await getAcUrl()
  return url ? url + '/api/v1' + uri : ''
}

const getDateFormatted = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

export { postReq, putReq, deleteReq, getReq, getDateFormatted }
