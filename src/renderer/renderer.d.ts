import {CredentialsStorage} from "../main/credentials-storage";

export interface IElectronAPI {
  openExtLink: (url: string) => void,
  setAppActive: (isActive: boolean) => void,
  setCredentials: (token: string, url: string) => Promise<void>,
  getCredentials: () => Promise<any>,
  clearStorage: () => Promise<void>,
}

declare global {
  interface Window {
    electron: IElectronAPI
  }
}
