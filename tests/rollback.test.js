const fs = require('fs');
const path = require('path');
const { restoreFromLogs } = require('../scripts/rollback');
const { removeDir } = require('./testUtils');

const LOG_DIR = path.join(__dirname, 'rollback-logs');
const TRASH_DIR = path.join(__dirname, 'fake-trash');
const ORIGINAL_DIR = path.join(__dirname, 'orig');

beforeEach(() => {
  removeDir(LOG_DIR);
  removeDir(TRASH_DIR);
  removeDir(ORIGINAL_DIR);
  fs.mkdirSync(path.join(TRASH_DIR, 'files'), { recursive: true });
  fs.mkdirSync(LOG_DIR, { recursive: true });
  fs.mkdirSync(ORIGINAL_DIR, { recursive: true });
});

afterAll(() => {
  removeDir(LOG_DIR);
  removeDir(TRASH_DIR);
  removeDir(ORIGINAL_DIR);
});

test('restoreFromLogs restores files from trash', async () => {
  const original = path.join(ORIGINAL_DIR, 'file.txt');
  const trashed = path.join(TRASH_DIR, 'files', 'file.txt');
  fs.writeFileSync(trashed, 'data');

  const missing = path.join(ORIGINAL_DIR, 'missing.txt');

  const logData = [
    { path: original, size: 4, deletedAt: new Date().toISOString() },
    { path: missing, size: 0, deletedAt: new Date().toISOString() },
  ];
  fs.writeFileSync(
    path.join(LOG_DIR, 'deletions.json'),
    JSON.stringify(logData, null, 2),
  );

  process.env.TRASH_DIR = TRASH_DIR;
  const messages = [];
  const spy = jest.spyOn(console, 'log').mockImplementation((msg) => {
    messages.push(msg);
  });

  await restoreFromLogs(LOG_DIR);

  spy.mockRestore();
  delete process.env.TRASH_DIR;

  expect(fs.existsSync(original)).toBe(true);
  expect(fs.existsSync(trashed)).toBe(false);
  expect(messages.some((m) => m.includes('Restored'))).toBe(true);
  expect(messages.some((m) => m.includes('Missing'))).toBe(true);
});
