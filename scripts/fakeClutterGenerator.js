const fs = require("fs/promises");
const path = require("path");

const MIN_SIZE = 100 * 1024; // 100 KB
const MAX_SIZE = 2 * 1024 * 1024 * 1024; // 2 GB
const MIN_DAYS = 30;
const MAX_DAYS = 900;
const EXTENSIONS = [".tmp", ".log", ".zip", ".bak", ".txt"];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomExt() {
  return EXTENSIONS[randInt(0, EXTENSIONS.length - 1)];
}

function randomPastDate() {
  const daysAgo = randInt(MIN_DAYS, MAX_DAYS);
  return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
}

async function createRandomFile(dir, index) {
  const name = `file-${index}-${Date.now()}${randomExt()}`;
  const filePath = path.join(dir, name);
  await fs.writeFile(filePath, Buffer.alloc(1));
  const size = randInt(MIN_SIZE, MAX_SIZE);
  await fs.truncate(filePath, size);
  const mtime = randomPastDate();
  await fs.utimes(filePath, mtime, mtime);
  return filePath;
}

async function populateDir(dir, depth, createdPaths) {
  await fs.mkdir(dir, { recursive: true });
  for (let i = 0; i < 3; i++) {
    const p = await createRandomFile(dir, i);
    createdPaths.push(p);
  }
  if (depth > 0) {
    for (let i = 0; i < 2; i++) {
      const sub = path.join(dir, `sub-${depth}-${i}`);
      await populateDir(sub, depth - 1, createdPaths);
    }
  }
}

/**
 * Generate nested fake clutter in the target directory.
 * Returns an array of created file paths.
 */
async function generateFakeClutter(targetDir) {
  const created = [];
  await populateDir(targetDir, 2, created);
  return created;
}

if (require.main === module) {
  generateFakeClutter(path.join(__dirname, "..", "test-disk")).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { generateFakeClutter };
