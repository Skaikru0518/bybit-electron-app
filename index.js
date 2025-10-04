import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import routes from './api/routes.js';
import pkg from 'electron-updater';
import log from 'electron-log';
import { initializeEncryptionKey } from './api/utils/encrypt.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { autoUpdater } = pkg;
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

const startUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, 'dist', 'index.html')}`;

let win;
const createWindow = () => {
  win = new BrowserWindow({
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
  if (win) win.webContents.send('update-status', { status: 'checking' });
});

autoUpdater.on('update-available', (info) => {
  log.info('Update available.');
  if (win)
    win.webContents.send('update-status', {
      status: 'available',
      info,
      version: info.version,
    });
});

autoUpdater.on('update-not-available', (info) => {
  log.info('Update not available');
  if (win)
    win.webContents.send('update-status', { status: 'not-available', info });
});

autoUpdater.on('error', (err) => {
  log.error('Error in auto updater.' + err);
  if (win)
    win.webContents.send('update-status', {
      status: 'error',
      error: err.message,
    });
});

autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded.');
  if (win)
    win.webContents.send('update-status', { status: 'downloaded', info });
  autoUpdater.quitAndInstall();
});

ipcMain.handle('check-for-update', async () => {
  try {
    const result = await autoUpdater.checkForUpdates();
    return result;
  } catch (error) {
    log.error('Error checking for updates:', error);
    throw error;
  }
});

ipcMain.handle('download-update', async () => {
  try {
    log.info('Starting update download...');
    const result = await autoUpdater.downloadUpdate();
    return result;
  } catch (error) {
    log.error('Error downloading update:', error);
    throw error;
  }
});

app
  .whenReady()
  .then(async () => {
    // Initialize encryption key cache
    try {
      await initializeEncryptionKey();
      log.info('Encryption key initialized successfully');
    } catch (error) {
      log.error('Failed to initialize encryption key:', error);
      // Continue anyway - encryption will handle missing key gracefully
    }
    createWindow();
  })
  .then(() => {
    autoUpdater.checkForUpdatesAndNotify();
  })
  .then(() => {
    console.log('Loading URL:', startUrl);
  });
