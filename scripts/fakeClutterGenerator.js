const fs = require('fs/promises');
const path = require('path');

/**
 * Generate a small amount of fake clutter in the target directory.
 * Returns an array of created file paths.
 */
async function generateFakeClutter(targetDir) {
  await fs.mkdir(targetDir, { recursive: true });
  const filePath = path.join(targetDir, 'dummy.tmp');
  await fs.writeFile(filePath, 'dummy data');
  return [filePath];
}

if (require.main === module) {
  generateFakeClutter(path.join(__dirname, '..', 'test-disk')).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { generateFakeClutter };
