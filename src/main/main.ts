/* eslint-disable no-new */
/* eslint global-require: off, no-console: off, promise/always-return: off */
import Store from 'electron-store';
import { execFile } from 'node:child_process';
import path from 'path';
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  utilityProcess,
  Tray,
  nativeImage,
} from 'electron';
import chalk from 'chalk';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

const store = new Store();

ipcMain.on('electron-store-get', async (event, val) => {
  event.returnValue = store.get(val);
});
ipcMain.on('electron-store-set', async (event, key, val) => {
  store.set(key, val);
});

const isDev = process.env.NODE_ENV === 'development';

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

function getSettings() {
  if (!store.get('settings')) {
    store.set('settings', { serverHost: 'localhost', serverPort: '3025' });
  }
  return store.get('settings');
}

ipcMain.handle('get-settings', getSettings);

function startMySql() {
  const childMySql = execFile(getAssetPath('/mysql/bin/mysqld.exe'), [
    '--standalone',
    '--explicit_defaults_for_timestamp',
    '--console',
  ]);
  return new Promise((resolve, reject) => {
    childMySql.on('spawn', () => {
      console.log(chalk.bgBlueBright('sql start'));
      resolve('start');
    });

    childMySql.on('error', (error: any) => {
      reject(error);
    });
    childMySql.stdout?.on('data', console.log);
  });
}

function startServer() {
  const serverProsess = utilityProcess.fork(
    path.join(__dirname, '../server/main.js')
  );
  serverProsess.on('spawn', () => {
    console.log(chalk.bgCyanBright('server start'));
  });
}
let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

// const installExtensions = async () => {
//   const installer = require('electron-devtools-installer');
//   const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
//   const extensions = ['REACT_DEVELOPER_TOOLS'];

//   return installer
//     .default(
//       extensions.map((name) => installer[name]),
//       forceDownload
//     )
//     .catch(console.log);
// };

const createWindow = async () => {
  // if (isDebug) {
  //   await installExtensions();
  // }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  ipcMain.on('update_progress', (_event, args) => {
    mainWindow?.setProgressBar(Number(args) / 100);
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
};

const createTray = () => {
  const icon = nativeImage.createFromPath(getAssetPath('icon.png'));
  new Tray(icon);
};
/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(async () => {
    createTray();
    if (process.argv.indexOf('--systray') === -1) createWindow();
    await startMySql();
    if (!isDev) {
      try {
        await startServer();
      } catch (error) {
        console.log(error);
        app.quit();
      }
    }
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
