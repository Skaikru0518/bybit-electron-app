import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import routes from './api/routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

app
  .whenReady()
  .then(() => {})
  .then(() => {
    createWindow();
  })
  .then(() => {
    console.log('Loading URL:', startUrl);
  });
