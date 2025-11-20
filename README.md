# Byeonggi's Claude Code Plugin Marketplace

A custom plugin marketplace for Claude Code, adhering to official Claude Code documentation standards.

## 📦 Installation

### Add Marketplace from GitHub

```bash
/plugin marketplace add ByeongGi/byeonggi-marketplace
```

This will add the marketplace to your Claude Code installation and make all plugins available.

### Local Installation (for development)

If you've cloned the repository locally:

```bash
cd /path/to/byeonggi-marketplace
/plugin marketplace add .
```

## 🔌 Available Plugins

### youtube-summarizer

Extract and summarize YouTube video transcripts with timestamp support.

**Installation:**
```bash
/plugin install youtube-summarizer@byeonggi-marketplace
```

**Features:**
- Extract YouTube video captions and transcripts
- Support for multiple languages (Korean, English, and more)
- Timestamped transcript data
- AI-powered intelligent summaries

[View Plugin Details →](./plugins/youtube-summarizer/README.md)

## 🛠 Developer Guide

> **For complete development information, see [DEVELOPMENT.md](./DEVELOPMENT.md).**

**Local Development Setup:**
```bash
git clone https://github.com/ByeongGi/byeonggi-marketplace.git
cd byeonggi-marketplace
npm install                 # Install dependencies
/plugin marketplace add .   # Add local marketplace
npm run validate:all        # Run validation
```

**Quick Reference:** [CLAUDE.md](./CLAUDE.md) - Command cheatsheet

## 🚀 Quick Start

### 1. Add Marketplace

```bash
/plugin marketplace add ByeongGi/byeonggi-marketplace
```

### 2. Install a Plugin

```bash
/plugin install youtube-summarizer@byeonggi-marketplace
```

### 3. Use the Plugin

Simply interact with Claude Code:

```
Summarize this YouTube video: https://www.youtube.com/watch?v=VIDEO_ID
```

### For Plugin Development

See [DEVELOPMENT.md](./DEVELOPMENT.md#-development-checklist) for how to add your own plugins.

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
1. Fork the repository on GitHub
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/byeonggi-marketplace.git`
3. Create a new branch: `git checkout -b feature/my-new-plugin`
4. Add new plugin or modify existing plugin
5. Run `npm run validate:all` to ensure everything is valid
6. Commit your changes and push to your fork
7. Create a Pull Request on GitHub

## ⚙️ Tech Stack

- **Validation**: Ajv (JSON Schema validator)
- **Version Management**: Semantic Versioning
- **Automation**: Node.js scripts

**For more details, see [DEVELOPMENT.md](./DEVELOPMENT.md).**

## 📄 License

MIT
