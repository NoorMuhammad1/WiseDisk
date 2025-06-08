const fs = require('fs/promises');
const path = require('path');

/**
 * Append a deletion log entry to a JSON file within the logs directory.
 * Returns the path to the log file written.
 */
async function logDeletion(entry, logDir = path.join(__dirname, 'logs')) {
  await fs.mkdir(logDir, { recursive: true });
  const logPath = path.join(
    logDir,
    `deletions-${new Date().toISOString().slice(0, 10)}.json`,
  );
  let data = [];
  try {
    const fileData = await fs.readFile(logPath, 'utf-8');
    data = JSON.parse(fileData);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
  data.push({
    path: entry.path,
    size: entry.size,
    deletedAt: new Date().toISOString(),
  });
  await fs.writeFile(logPath, JSON.stringify(data, null, 2));
  return logPath;
}

module.exports = { logDeletion };
