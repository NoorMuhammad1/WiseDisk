const fs = require('fs');
const path = require('path');

function removeDir(target) {
  if (fs.rmSync) {
    fs.rmSync(target, { recursive: true, force: true });
    return;
  }
  if (!fs.existsSync(target)) return;
  const stats = fs.lstatSync(target);
  if (stats.isDirectory()) {
    for (const item of fs.readdirSync(target)) {
      removeDir(path.join(target, item));
    }
    fs.rmdirSync(target);
  } else {
    try {
      fs.unlinkSync(target);
    } catch (err) {
      // ignore errors when force deleting
    }
  }
}

module.exports = { removeDir };
