const fs = require('fs');
const path = require('path');
const { logDeletion } = require('../logger');
const { removeDir } = require('./testUtils');

const LOG_DIR = path.join(__dirname, 'logs-test');

beforeEach(() => {
  removeDir(LOG_DIR);
});

afterAll(() => {
  removeDir(LOG_DIR);
});

test('logDeletion writes a log entry', async () => {
  const logPath = await logDeletion(
    { path: 'example.tmp', size: 123 },
    LOG_DIR,
  );
  expect(fs.existsSync(logPath)).toBe(true);
  const content = JSON.parse(fs.readFileSync(logPath, 'utf8'));
  expect(content.length).toBe(1);
  expect(content[0].path).toBe('example.tmp');
  expect(content[0].size).toBe(123);
});
