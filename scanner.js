const fs = require("fs/promises");
const path = require("path");

async function getFolderSize(dir) {
  let total = 0;
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      total += await getFolderSize(fullPath);
    } else {
      const { size } = await fs.stat(fullPath);
      total += size;
    }
  }
  return total;
}

async function scanDirectory(targetDir) {
  const entries = await fs.readdir(targetDir, { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    const fullPath = path.join(targetDir, entry.name);
    if (entry.isDirectory()) {
      const children = await scanDirectory(fullPath);
      const size = await getFolderSize(fullPath);
      result.push({
        path: fullPath,
        name: entry.name,
        isDirectory: true,
        size,
        children,
      });
    } else {
      const { size } = await fs.stat(fullPath);
      result.push({
        path: fullPath,
        name: entry.name,
        isDirectory: false,
        size,
      });
    }
  }
  return result;
}

module.exports = { scanDirectory, getFolderSize };
