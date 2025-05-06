const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (message: string) => ipcRenderer.send('message', message),
  versions: () => "Versions: Node: " + process.versions.node + "Chrome: " + process.versions['chrome'] + "Electron: " +  process.versions['electron']
})
