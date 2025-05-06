const { app, BrowserWindow, ipcMain } = require('electron/main');
const path = require('node:path');
//const fs = require('fs');
const url = require("url");


try {
  app.on("ready", createWindow);

  app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
  });

  app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
  });

  process.on('uncaughtException', (error) => {
      console.error("Unexpected error: ", error);
  });

  ipcMain.on('message', (event: any, message: string) => {
    console.log("Message from Renderer:", message);
  });

} catch (error) {
  console.warn("Main Caught", error);
}

// Definitions -----------------------------------------------------------------

function createWindow() {
  const args = process.argv.slice(1);
  const serve = args.some(val => val === '--serve');

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),    // <---------------- add preload script
      //nodeIntegration: true,
      //allowRunningInsecureContent: (serve),
      //contextIsolation: true,
    },
  });

  const myUrl = buildUrl();

  win.webContents.on('did-fail-load', () => win.loadURL(myUrl));

  //make this check seems to cause an error on BrowserWindow.loadURL
  //if(!fs.existsSync(myUrl)) { throw new Error("Index not found"); }

  win.loadURL(myUrl);
  console.log("URL loaded", myUrl);
}

function buildUrl(): string {
  return url.format({
    pathname: path.join(__dirname, "/index.html"),
    protocol: "file:",
    slashes: true
  });
}

async function onFailReload(err: any) {
  console.log("refresh fail");
  await app.loadURL(url);
}
/*
**Importan:** Confirm that:
  - `__dirname` will give the path of the bundle in my case `./dist/ng-desktop/browser/`.
  - it's at the level of the index.html
*/
