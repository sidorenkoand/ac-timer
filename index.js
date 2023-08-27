const { app, BrowserWindow, ipcMain, Tray, Menu, shell } = require('electron');
let path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let tray;

function createWindow () {
  // Create the browser window.
  let iconPath = path.join(__dirname, 'assets/icons/timer.png');

  win = new BrowserWindow({
    width: 478,
    height: 600,
    title: "Timer",
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // and load the index.html of the app.
  win.loadFile('index.html');

  // Open the DevTools.
  // win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
  //
  // tray = new Tray(iconPath);
  //
  //
  // let contextMenu = Menu.buildFromTemplate([
  //   { label: 'Show App', click:  function(){
  //       win.show();
  //     } },
  //   { label: 'Quit', click:  function(){
  //       win.isQuiting = true;
  //       win.quit();
  //     } }
  // ]);
  //
  // tray.setContextMenu(contextMenu);

  win.on('minimize', function (event) {
    event.preventDefault();
    win.hide();
  });
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

ipcMain.handle('initTray', async (event) => {
  initTray();
});

ipcMain.handle('setAppActive', async (event, isActive) => {
  setAppActive(isActive);
})

ipcMain.handle('openExtLink', async (event, link) => {
  openExtLink(link);
})

/**
 * Change App view if timer is turned on/off
 *
 * @param {Boolean} isActive
 */
function setAppActive (isActive) {
  let icon = isActive ? 'assets/icons/timer-active.png' : 'assets/icons/timer.png',
      icon_path = path.join(__dirname, icon);

  tray.setImage(icon_path);
  win.setIcon(icon_path);
}

/**
 * Init tray icon
 *
 * @private
 */
function initTray () {
  let iconPath = path.join(__dirname, 'assets/icons/timer.png');

  tray = new Tray(iconPath);

  let contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App', click: function () {
        win.show();
      }
    },
    {
      label: 'Quit', click: function () {
        win.isQuiting = true;
        win.close();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);
}

/**
 *
 * @param {String} link
 */
function openExtLink (link) {
  shell.openExternal(link);
}