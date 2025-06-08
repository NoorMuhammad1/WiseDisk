# 🧠 WiseDisk – Smart Windows Disk Cleanup Assistant

**WiseDisk** is a Windows desktop application that analyzes disk usage, identifies clutter, and recommends safe deletions with context-aware guidance. Built with **Electron.js**, WiseDisk helps users understand and optimize their system's disk space intelligently and safely.

---

## 🚀 Vision

The goal of WiseDisk is to move beyond simple file size analysis and build an intelligent cleanup assistant that:

- Understands the role and risk of each file/folder
- Suggests safe deletion candidates
- Logs every operation for transparency and rollback
- Eventually integrates LLMs for smarter reasoning and assistant-style interaction

---

## 🧩 Architecture Overview

- **Framework**: Electron.js with Node.js backend
- **Testing Ground**: Simulated directory (`./test-disk`) used for safe, repeatable cleanup testing
- **Deletion Handling**: Uses the [`trash`](https://www.npmjs.com/package/trash) package to safely move files to the Recycle Bin
- **Planned Additions**:
  - File/folder scoring (based on size, age, type, importance)
  - Categorization (temp files, dev folders, media, etc.)
  - LLM-based recommendation engine (future)
  - Script generation (PowerShell, Bash) (future)

---

## 📅 Milestone Roadmap

### ✅ MVP v0.1 – Basic Functionality

- [x] Simulate fake disk clutter for testing
- [x] Scan and display a tree of folders/files with sizes
- [x] Allow checkbox-based deletion through Recycle Bin
- [x] Log each action to a local `.log` file
- [x] Support rollback through logs or file restoration
      To restore deleted files using the logs, run:

```bash
node scripts/rollback.js [logDir]
```

The `logDir` defaults to `logs/`.

### 🔜 v0.2 – Categorization and Scoring

- [ ] Tag files/folders (system, user, temp, dev, etc.)
- [ ] Assign deletability score
- [ ] Filter or sort by score

### 🔮 v0.3+ – LLM and Intelligent Suggestions

- [ ] Chat assistant to explain folders or suggest deletions
- [ ] Natural language command interface
- [ ] Custom script generator (e.g., delete all unused `.log` files > 100MB)

---

## 🧪 Testing Approach

We use a **fake clutter generator script** to simulate disk usage and test logic safely before scanning real disk partitions. This ensures a safe, iterative development process without risking system files.

---

## 🛠 Getting Started (Dev)

```bash
npm install
npm test
npm start
npm run format
```

Run `npm run format` to apply Prettier formatting to the project files.

To generate fake clutter for testing, run:

```bash
node scripts/fakeClutterGenerator.js
```

This command creates a `test-disk` folder populated with random files and
directories. The automated tests rely on this folder when running in the
simulated environment only.
