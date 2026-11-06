const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('scalarStore', {
  load: () => ipcRenderer.sendSync('scalar-state-load'),
  save: (data) => ipcRenderer.send('scalar-state-save', data),
});
