const fs = require("fs");
const path = require("path");
const { generateFakeClutter } = require("../scripts/fakeClutterGenerator");

const TEST_DIR = path.join(__dirname, "tmp-disk");

afterAll(() => {
  fs.rmSync(TEST_DIR, { recursive: true, force: true });
});

test("generateFakeClutter creates files", async () => {
  const files = await generateFakeClutter(TEST_DIR);
  for (const file of files) {
    expect(fs.existsSync(file)).toBe(true);
  }
});
