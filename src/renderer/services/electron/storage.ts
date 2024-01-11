import type Task from '../../models/Task'
import type Project from '../../models/Project'
import {IElectronAPI} from "../../renderer";


/**
 * Check if authorized
 */
const checkIsAuth = async (): Promise<boolean> => {
  const credentials = await getCredentials()
  return typeof credentials === 'object' && credentials.token && credentials.ac_url
}

const setToken = async (token: string) => {
  await setCredentials(token, await getAcUrl())
}

const getToken = async () : Promise<string> => {
  const credentials = await getCredentials()
  return credentials?.token ?? ''
}

const setAcUrl = async (url: string) => {
  await setCredentials(await getToken(), url)
}

const getAcUrl = async () => {
  const credentials = await getCredentials()
  return credentials?.ac_url ?? ''
}

const setCredentials = async (token: string, url: string) => {
  const electron = getElectronApi()
  if (electron) {
    await electron.setCredentials(token, url)
  }
}

const getCredentials = async () => {
  const electron = getElectronApi()
  return electron ? await electron.getCredentials() : undefined
}

const clear = async () => {
  const electron = getElectronApi()
  if (electron) {
    await electron.clearStorage()
  }
}

/**
 * Return AC ID for current user
 */
const getUserId = async (): Promise<number> => {
  const credentials = await getCredentials();
  const token = credentials?.token;
  return !token ? 0 : Number(token.split('-')[0])
}

const openExternalLink = async (instance: Task | Project) => {
  const url = await getAcUrl() + instance.url_path;
  getElectronApi()?.openExtLink(url);
}

const getElectronApi = (): IElectronAPI | undefined => {
  if (!window.electron) {
    console.error('window.electron not found', window.electron, window)
  }
  return window.electron;
}

export { checkIsAuth, getUserId, setToken, getToken, setAcUrl, getAcUrl, clear, openExternalLink }
