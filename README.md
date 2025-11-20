# Byeonggi's Claude Code Plugin Marketplace

A custom plugin marketplace for Claude Code, adhering to official Claude Code documentation standards.

## 📦 Installation

### Add Local Marketplace

```bash
/plugin marketplace add .
```

Or install directly from GitHub:

```bash
/plugin marketplace add byeonggi/claude-marketplace
```

## 🔌 Available Plugins

### Developer Tools

Essential tools for developer productivity

```bash
/plugin install developer-tools@byeonggi-marketplace
```

**Features:**
- `/format` - Code formatting
- `code-reviewer` - Code review agent

### Project Templates

Project initialization templates

```bash
/plugin install project-templates@byeonggi-marketplace
```

**Features:**
- `/init-project` - Project scaffolding

## 🛠 Developer Guide

> **For complete development information, see [DEVELOPMENT.md](./DEVELOPMENT.md).**

**Quick Start:**
```bash
npm install                 # Install dependencies
npm run validate:all        # Run validation
npm run version:patch       # Bump version
```

**Quick Reference:** [CLAUDE.md](./CLAUDE.md) - Command cheatsheet

## 🚀 Quick Start

### 1. Add Marketplace

```bash
cd /path/to/byeonggi-marketplace
/plugin marketplace add .
```

### 2. Install Plugins

```bash
/plugin install developer-tools@byeonggi-marketplace
/plugin install project-templates@byeonggi-marketplace
```

### 3. Use Plugins

```bash
# Code formatting
/format

# Create new project
/init-project
```

## 📖 Essential Commands

**For all commands, see [CLAUDE.md](./CLAUDE.md) or [DEVELOPMENT.md](./DEVELOPMENT.md).**

```bash
# Development essentials
npm run validate:all      # Full validation
npm run version:patch     # Bump version
npm test                  # Run tests
```

## 📚 Documentation

| Document | Audience | Content |
|----------|----------|---------|
| **[README.md](./README.md)** | Users/Visitors | Project introduction and quick start (this document) |
| **[CLAUDE.md](./CLAUDE.md)** | Developers | Quick reference cheatsheet |
| **[DEVELOPMENT.md](./DEVELOPMENT.md)** | Developers | Complete development guide and rules |

**Official Documentation:**
- [Claude Code Plugin Guide](https://code.claude.com/docs/en/plugins)
- [Plugin Marketplaces](https://code.claude.com/docs/en/plugin-marketplaces.md)
- [Plugins Reference](https://code.claude.com/docs/en/plugins-reference.md)

## 🔧 Contributing

**For detailed contribution guide, see [DEVELOPMENT.md](./DEVELOPMENT.md#-development-checklist).**

Basic steps:
1. Fork and Clone
2. Add new plugin or modify existing plugin
3. Run `npm run validate:all`
4. Create Pull Request

## ⚙️ Tech Stack

- **Validation**: Ajv (JSON Schema validator)
- **Version Management**: Semantic Versioning
- **Automation**: Node.js scripts

**For more details, see [DEVELOPMENT.md](./DEVELOPMENT.md).**

## 📄 License

MIT
