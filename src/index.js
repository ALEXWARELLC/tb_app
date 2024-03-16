const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

if (require('electron-squirrel-startup')) {
  app.quit();
}

// -----------------------------------------
const isMac = process.platform === 'darwin';
let MainWindow;

const MenuTemplate = [
  {
    label: 'Terabit Desktop',
    submenu: [
        { label: 'Quit', click: () => { app.exit() }}
    ]
  },
  {
    label: 'Navigation',
    submenu: [
        { label: 'Dashboard', click: () => { MainWindow.loadURL("https://gaming.terabit.io/"); }},
        { label: 'Client Area', click: () => { MainWindow.loadURL("https://my.terabit.io/"); }},
        { label: 'Admin Area', click: () => { MainWindow.loadURL("https://gaming.terabit.io/admin"); }},
        { label: 'Tenantos', click: () => { MainWindow.loadURL("https://dcs.terabit.io/")}},
        { label: 'VirtFusion', click: () => { MainWindow.loadURL("https://vps.terabit.io/")}}
    ]
  }
]

const CreateWindow = () => {
  MainWindow = new BrowserWindow({
    minWidth: 1366,
    minHeight: 720,
    icon: "img/terabit.png",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: process.argv.includes("--enable-devtools"),
      webgl: !process.argv.includes("--disable-webgl"),
    },
  });
  Menu.setApplicationMenu(Menu.buildFromTemplate(MenuTemplate));
  MainWindow.loadURL("https://gaming.terabit.io/");
};

app.on('ready', CreateWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    CreateWindow();
  }
});
// -----------------------------------------