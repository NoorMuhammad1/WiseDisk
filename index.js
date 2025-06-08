const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const trash = require("trash");
const { scanDirectory } = require("./scanner");
const { logDeletion } = require("./logger");

const TEST_DISK = path.join(__dirname, "test-disk");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  win.loadFile("index.html");
}

app.whenReady().then(createWindow);

ipcMain.handle("scan", async () => {
  try {
    return await scanDirectory(TEST_DISK);
  } catch (err) {
    return [];
  }
});

ipcMain.handle("delete", async (event, paths) => {
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

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
