const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');

// Keep the existing data folder (localStorage + scalar-state.json) under
// "calcbot" while showing "Scalar" in the macOS app menu.
app.setPath('userData', path.join(app.getPath('appData'), 'calcbot'));
app.setName('Scalar');

function statePath() {
  return path.join(app.getPath('userData'), 'scalar-state.json');
}

ipcMain.on('scalar-state-load', (event) => {
  try {
    event.returnValue = JSON.parse(fs.readFileSync(statePath(), 'utf8'));
  } catch {
    event.returnValue = {};
  }
});

ipcMain.on('scalar-state-save', (_event, data) => {
  try {
    fs.writeFileSync(statePath(), JSON.stringify(data));
  } catch (_) {}
});

// Reference PDFs bundled with the app (electron-builder extraResources -> resources/docs).
const DOCS = new Set(['osg-drilling-technical-guide-vol1.pdf', 'irwin-metal-drilling-reference-guide.pdf']);
ipcMain.handle('scalar-open-doc', async (_event, name) => {
  if (!DOCS.has(name)) return 'unknown document';
  const file = app.isPackaged
    ? path.join(process.resourcesPath, 'docs', name)
    : path.join(__dirname, '..', 'docs', 'reference', name);
  return shell.openPath(file);
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 400,
    minHeight: 300,
    title: 'Scalar',
    backgroundColor: '#212427',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      sandbox: true,
    },
  });
  win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
