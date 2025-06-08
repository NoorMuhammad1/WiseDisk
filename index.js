const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');
const { default: trash } = require('trash');
const { scanDirectory } = require('./scanner');
const { logDeletion } = require('./logger');

const TEST_DISK = path.join(__dirname, 'test-disk');
const LOG_DIR = path.join(__dirname, 'logs');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

ipcMain.handle('scan', async () => {
  try {
    return await scanDirectory(TEST_DISK);
  } catch (err) {
    return [];
  }
});

ipcMain.handle('delete', async (event, paths) => {
  for (const filePath of paths) {
    try {
      const stats = await fs.promises.stat(filePath);
      await trash([filePath]);
      await logDeletion({ path: filePath, size: stats.size });
    } catch (err) {
      console.error(err);
    }
  }
});

ipcMain.handle('listLogs', async () => {
  try {
    await fs.promises.mkdir(LOG_DIR, { recursive: true });
    const files = await fs.promises.readdir(LOG_DIR);
    return files.filter((f) => f.endsWith('.json'));
  } catch {
    return [];
  }
});

ipcMain.handle('rollback', async (event, file) => {
  return new Promise((resolve) => {
    const logPath = path.join(LOG_DIR, file);
    const child = spawn(process.execPath, [
      path.join(__dirname, 'scripts', 'rollback.js'),
      logPath,
    ]);
    child.on('close', (code) => resolve(code === 0));
    child.on('error', () => resolve(false));
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
