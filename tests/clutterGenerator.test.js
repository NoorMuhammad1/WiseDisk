const fs = require("fs");
const path = require("path");
const { generateFakeClutter } = require("../scripts/fakeClutterGenerator");
const { removeDir } = require("./testUtils");

const TEST_DIR = path.join(__dirname, "tmp-disk");

afterAll(() => {
  removeDir(TEST_DIR);
});

test("generateFakeClutter creates nested files with metadata", async () => {
  const files = await generateFakeClutter(TEST_DIR);
  expect(files.length).toBeGreaterThan(0);
  let hasNested = false;
  for (const file of files) {
    expect(fs.existsSync(file)).toBe(true);
    const stats = fs.statSync(file);
    // size between 100KB and 2GB
    expect(stats.size).toBeGreaterThanOrEqual(100 * 1024);
    expect(stats.size).toBeLessThanOrEqual(2 * 1024 * 1024 * 1024);
    // modified time between 30 and 900 days ago
    const ageDays = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60 * 24);
    expect(ageDays).toBeGreaterThanOrEqual(30);
    expect(ageDays).toBeLessThan(901);
    if (path.dirname(file) !== TEST_DIR) {
      hasNested = true;
    }
  }
  expect(hasNested).toBe(true);
});
