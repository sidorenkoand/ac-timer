import {contextBridge, ipcRenderer} from "electron";

contextBridge.exposeInMainWorld(
  'electron',
  {
    setAppActive: (isActive: boolean) => {
      ipcRenderer.invoke('setAppActive', isActive).then()
    },
    openExtLink: (link: string) => {
      ipcRenderer.invoke('openExtLink', link).then()
    },
    setCredentials: async (token: string, url: string) => {
      await ipcRenderer.invoke('setCredentials', token, url).then()
    },
    clearStorage: async () => {
      await ipcRenderer.invoke('clearStorage').then()
    },
    getCredentials: async () => {
      return await ipcRenderer.invoke('getCredentials')
    },
  }
)
