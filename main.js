const { app, BrowserWindow, Menu, MenuItem } = require('electron');
const path = require('path');
const isMac = process.platform === 'darwin'
if (require('electron-squirrel-startup')) {
  app.quit();
}
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    minHeight: 700,
    minWidth: 1030,
    width: 1030,
    height: 700,
    show: false,
  })
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  const splash = new BrowserWindow({
    width: 700,
    height: 250,
    transparent: true,
    frame: false,
    alwaysOnTop: true
  });
  function UpsertKeyValue(obj, keyToChange, value) {
    const keyToChangeLower = keyToChange.toLowerCase();
    for (const key of Object.keys(obj)) {
      if (key.toLowerCase() === keyToChangeLower) {
        // Reassign old key
        obj[key] = value;
        // Done
        return;
      }
    }
    obj[keyToChange] = value;
  }
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    const { responseHeaders } = details;
    UpsertKeyValue(responseHeaders, 'Access-Control-Allow-Origin', ['*']);
    UpsertKeyValue(responseHeaders, 'Access-Control-Allow-Headers', ['*']);
    callback({
      responseHeaders,
    });
  });
  mainWindow.webContents.on('new-window', function (e, url) {
    e.preventDefault();
    require('electron').shell.openExternal(url);
  });
}