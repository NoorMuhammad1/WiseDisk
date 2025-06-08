
---

## 📁 `AGENTS.md`

```markdown
# 🤖 AGENTS.md – Instructions for Coding Agents

Welcome, Codex or AI coding agent. This document provides context, conventions, and instructions for working on the **WiseDisk** codebase.

---

## 🎯 Project Goal

WiseDisk is an Electron.js-based Windows application that helps users clean their disk intelligently and safely.

---

## 📌 Current Milestone: v0.1 MVP

You are currently contributing to **v0.1**, which is the first working prototype.

### Your immediate task:
✅ Build the initial project structure with the following components:

- A script: `scripts/fakeClutterGenerator.js`
  - Simulates file clutter in `./test-disk` folder
  - Creates nested folders and various file types (`.tmp`, `.log`, `.zip`, etc.)
  - Random file sizes (100KB–2GB)
  - Old modified times (30–900 days ago)

- Electron UI:
  - Tree view of the `./test-disk` folder
  - Show folder/file sizes
  - Checkbox to mark items for deletion
  - Delete button → moves selected files to Recycle Bin via `trash` package

- Logging:
  - Each deletion should be logged to `logs/deletions-<timestamp>.json`
  - Format: `{path, size, deletedAt}`

---

## 🧪 Testing Expectations

- Create a separate `tests/` folder
- Use Jest or Node's assert module for testing `logger.js` and clutter generator
- Do not access actual system folders (`C:/`) yet

---

## 📐 Code Conventions

- Use ES6+ syntax
- Use Prettier for code formatting
- Keep function names descriptive (`scanDirectory`, `getFolderSize`, etc.)

---

## 📝 Commit Format

Use the following format for commits:

```text
✨ feature: added fake clutter generator script
🧪 test: added logger tests
🐛 fix: corrected file path logic in scanner

Each commit should also include a short section:
### Testing Done
- Ran `node scripts/fakeClutterGenerator.js`
- Confirmed files were created as expected
