const fs = require('fs');
const path = require('path');
const { scanDirectory, getFolderSize } = require('../scanner');
const { generateFakeClutter } = require('../scripts/fakeClutterGenerator');
const { removeDir } = require('./testUtils');

const TEST_DIR = path.join(__dirname, 'tmp-scan');

afterAll(() => {
  removeDir(TEST_DIR);
});

function sumFileSizes(paths) {
  let total = 0;
  for (const p of paths) {
    if (fs.existsSync(p) && fs.statSync(p).isFile()) {
      total += fs.statSync(p).size;
    }
  }
  return total;
}

test('scanDirectory lists items with correct flags and sizes', async () => {
  const created = await generateFakeClutter(TEST_DIR);
  const expectedTotal = sumFileSizes(created);

  const totalSize = await getFolderSize(TEST_DIR);
  expect(totalSize).toBe(expectedTotal);

  const entries = await scanDirectory(TEST_DIR);

  async function verify(list) {
    for (const item of list) {
      const stats = fs.statSync(item.path);
      expect(stats.isDirectory()).toBe(item.isDirectory);
      if (item.isDirectory) {
        expect(item.size).toBe(await getFolderSize(item.path));
        await verify(item.children);
      } else {
        expect(item.size).toBe(stats.size);
      }
    }
  }

  await verify(entries);
});
