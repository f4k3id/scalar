const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('scalarStore', {
  load: () => ipcRenderer.sendSync('scalar-state-load'),
  save: (data) => ipcRenderer.send('scalar-state-save', data),
});

contextBridge.exposeInMainWorld('scalarDocs', {
  open: (name) => ipcRenderer.invoke('scalar-open-doc', name),
});
