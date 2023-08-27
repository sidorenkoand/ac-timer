const {contextBridge, ipcRenderer} = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    contextBridge.exposeInMainWorld(
        'electron',
        {
            initTray: () => {ipcRenderer.invoke('initTray')},
            setAppActive: (isActive) => {ipcRenderer.invoke('setAppActive', isActive)},
            openExtLink: (link) => {ipcRenderer.invoke('openExtLink', link)}
        }
    );
});

