import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import routes from './api/routes.js';
import pkg from 'electron-updater';
import log from 'electron-log';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { autoUpdater } = pkg;
let updateAvailable = false;
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

const startUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, 'dist', 'index.html')}`;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1337,
    height: 768,
    minWidth: 800,
    minHeight: 600,
    frame: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true,
    },
  });

  win.loadURL(startUrl);
};

routes.forEach(({ channel, handler }) => {
  ipcMain.handle(channel, handler);
});

// Auto update function
autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
  log.info('Update available.');
  updateAvailable = true;
});

autoUpdater.on('update-not-available', (info) => {
  log.info('Update not available');
});

autoUpdater.on('error', (err) => {
  log.error('Error in auto updater.' + err);
});

autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded.');
  autoUpdater.quitAndInstall();
});

app
  .whenReady()
  .then(() => {
    createWindow();
  })
  .then(() => {
    autoUpdater.checkForUpdatesAndNotify();
  })
  .then(() => {
    console.log('Loading URL:', startUrl);
  });
