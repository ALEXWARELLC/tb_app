const { app, BrowserWindow, Menu, protocol } = require('electron');
const path = require('path');

if (require('electron-squirrel-startup')) {
  app.quit();
}

// -----------------------------------------
const isMac = process.platform === 'darwin';
let MainWindow;
let SplashScreenWindow;
const MenuTemplate = [
  {
    label: 'Terabit Desktop',
    submenu: [
        // { label: 'About Terabit Desktop', click: () => { app.exit() }},
        { label: 'Settings', accelerator: "CmdOrCtrl+S", click: () => {  }},
        { type: 'separator' },
        { label: 'Quit', accelerator: "CmdOrCtrl+Q", click: () => { app.exit() }}
    ]
  },
  {
    label: 'Navigation',
    submenu: [
        { label: 'Dashboard', click: () => { MainWindow.loadURL("https://gaming.terabit.io/"); }},
        { label: 'Client Area', click: () => { MainWindow.loadURL("https://my.terabit.io/"); }},
        { label: 'Admin Area', click: () => { MainWindow.loadURL("https://gaming.terabit.io/admin"); }},
        { type: 'separator', label: 'Other Services' },
        { label: 'Tenantos', click: () => { MainWindow.loadURL("https://dcs.terabit.io/")}},
        { label: 'VirtFusion', click: () => { MainWindow.loadURL("https://vps.terabit.io/")}}
    ]
  }
]

const ShowSplashScreen = () => {
  SplashScreenWindow = new BrowserWindow({width: 620, height: 300, transparent: true, frame: false, alwaysOnTop: true, resizable: false});
  SplashScreenWindow.loadURL(`file://${__dirname}/splash.html`);
};

const CreateWindow = () => {
  ShowSplashScreen();
  MainWindow = new BrowserWindow({
    minWidth: 1280,
    minHeight: 720,
    icon: "img/terabit.png",
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: process.argv.includes("--enable-devtools"),
      webgl: !process.argv.includes("--disable-webgl"),
    },
  });
  Menu.setApplicationMenu(Menu.buildFromTemplate(MenuTemplate));
  MainWindow.loadURL(DetermineSourceURL());

  MainWindow.once('ready-to-show', () => {
    SplashScreenWindow.destroy();
    MainWindow.show();
  });
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

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'terabit',
    privileges: {
      secure: true,
      standard: true,
      supportFetchAPI: false,
    },
  },
]);

app.whenReady().then(() => {
  protocol.handle('terabit', (request) => console.log(request.url.slice('terabit://'.length))).catch(() => { return; })
});

// -----------------------------------------

const domains = [
  'terabit://'
];

function DetermineSourceURL() {
  const args = process.argv;
  const url = args.find(arg => domains.some(domain => arg.startsWith(domain))) || 'https://gaming.terabit.io/';
  if (url.startsWith('terabit://my')) {
      return 'https://my.terabit.io/';
  }
  if (url.startsWith('terabit://dcs')) {
      const path = url.replace("terabit://dcs", '');
      return `https://dcs.terabit.io/${path}`;
  }
  if (url.startsWith('terabit://vps')) {
      const path = url.replace('terabit://vps', '');
      return `https://vps.terabit.io/${path}`;
  }
  if (url.startsWith('terabit://')) {
      const path = url.replace('terabit://', '');
      return `https://gaming.terabit.io/${path}`;
  }

  console.log(`returning ${url}`);
  return url;
}