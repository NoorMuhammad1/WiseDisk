const fs = require('fs/promises');
const path = require('path');
const xdgTrashdir = require('xdg-trashdir');

async function getTrashDir() {
  if (process.env.TRASH_DIR) {
    return process.env.TRASH_DIR;
  }
  try {
    const dirs = await xdgTrashdir();
    if (Array.isArray(dirs) && dirs.length > 0) {
      return dirs[0];
    }
  } catch {
    // ignore
  }
  const home = process.env.HOME || process.env.USERPROFILE || __dirname;
  return path.join(home, '.Trash');
}

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * Restore files based on deletion log entries.
 * @param {string} logDir directory containing deletion JSON logs
 */
async function restoreFromLogs(target = path.join(__dirname, '..', 'logs')) {
  const trashDir = await getTrashDir();
  const trashFiles = path.join(trashDir, 'files');
  let files = [];
  try {
    const stats = await fs.stat(target);
    if (stats.isDirectory()) {
      const dirFiles = await fs.readdir(target);
      files = dirFiles
        .filter((f) => f.endsWith('.json'))
        .map((f) => path.join(target, f));
    } else {
      files = [target];
    }
  } catch {
    console.error(`Log path not found: ${target}`);
    return;
  }
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const data = JSON.parse(await fs.readFile(file, 'utf8'));
    for (const entry of data) {
      const original = path.resolve(entry.path);
      const trashed = path.join(trashFiles, path.basename(original));
      if (await fileExists(trashed)) {
        await fs.mkdir(path.dirname(original), { recursive: true });
        await fs.rename(trashed, original);
        console.log(`Restored ${original}`);
      } else {
        console.log(`Missing ${original} in trash`);
      }
    }
  }
}

if (require.main === module) {
  const dir = process.argv[2] || path.join(__dirname, '..', 'logs');
  restoreFromLogs(dir).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { restoreFromLogs };
