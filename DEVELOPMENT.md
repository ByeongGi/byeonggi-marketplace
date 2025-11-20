# Development Guide

> 💡 **For quick reference, see [CLAUDE.md](./CLAUDE.md).**

This document is the complete guide for plugin marketplace development.

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Add Local Marketplace

```bash
/plugin marketplace add .
```

## 🛠 Development Tools

### Validation Tools

Validates marketplace and plugins according to official documentation standards.

```bash
# Full validation (recommended)
npm run validate:all

# JSON schema validation
npm run validate

# Directory structure validation
npm run validate:structure

# Run tests
npm test
```

### Version Management

Follows Semantic Versioning and automatically synchronizes versions across marketplace.json and all plugin.json files.

```bash
# Bump patch version (1.0.0 → 1.0.1)
npm run version:patch

# Bump minor version (1.0.0 → 1.1.0)
npm run version:minor

# Bump major version (1.0.0 → 2.0.0)
npm run version:major

# Preview changes (no file modifications)
npm run version:dry-run

# Set specific version
node scripts/sync-versions.js --version 2.0.0
```

#### Version Update Workflow

1. **Bump version and validate**
   ```bash
   npm run version:patch
   npm run validate:all
   ```

2. **Git commit and tag**
   ```bash
   git add .
   git commit -m "chore: bump version to 1.0.1"
   git tag v1.0.1
   git push origin main --tags
   ```

### Utilities

```bash
# Format JSON files
npm run format:json

# Show available commands
npm run help
```

## 📋 Development Checklist

### When Adding New Plugin

- [ ] Create plugin directory under `plugins/`
- [ ] Use kebab-case for plugin name
- [ ] Create `.claude-plugin/plugin.json` (required)
- [ ] Create necessary directory structure:
  - [ ] `commands/` - Command files (.md)
  - [ ] `agents/` - Agent files (.md)
  - [ ] `skills/` - Skill directories (containing SKILL.md)
  - [ ] `hooks/` - hooks.json
- [ ] Add to `plugins` array in `marketplace.json`
- [ ] Run `npm run validate:all` to verify
- [ ] Write README.md

### Plugin Structure Rules

**✅ Correct Structure:**
```
plugins/my-plugin/
├── .claude-plugin/
│   └── plugin.json          # ✅ Only plugin.json here
├── commands/
│   └── my-command.md        # ✅ kebab-case
├── agents/
│   └── my-agent.md
└── skills/
    └── my-skill/
        └── SKILL.md
```

**❌ Incorrect Structure:**
```
plugins/my-plugin/
├── .claude-plugin/
│   ├── plugin.json
│   └── commands/            # ❌ No other files/directories allowed
└── MyCommand.md             # ❌ No PascalCase
```

## 📐 JSON Schemas

### marketplace.json

```json
{
  "name": "marketplace-name",           // Required, kebab-case
  "owner": {                            // Required
    "name": "Your Name",                // Required
    "email": "email@example.com",       // Optional
    "url": "https://example.com"        // Optional
  },
  "metadata": {                         // Optional
    "description": "Description",
    "version": "1.0.0",                 // Semantic Versioning
    "pluginRoot": "./plugins"
  },
  "plugins": [                          // Required
    {
      "name": "plugin-name",            // Required, kebab-case
      "source": "./plugins/plugin-name", // Required
      "description": "Description",     // Recommended
      "version": "1.0.0",               // Recommended
      "category": "productivity",       // Optional
      "tags": ["tag1", "tag2"]          // Optional
    }
  ]
}
```

### plugin.json

```json
{
  "name": "plugin-name",                // Required, kebab-case
  "version": "1.0.0",                   // Recommended
  "description": "Description",         // Recommended
  "author": {                           // Optional
    "name": "Your Name",
    "email": "email@example.com",
    "url": "https://example.com"
  },
  "commands": [                         // Optional
    "./commands/command.md"
  ],
  "agents": [                           // Optional
    "./agents/agent.md"
  ],
  "skills": [                           // Optional
    "./skills/skill-name"               // Directory containing SKILL.md
  ],
  "hooks": "./hooks/hooks.json",        // Optional
  "mcpServers": "./.mcp.json"           // Optional
}
```

## 🔍 Troubleshooting

### When Validation Fails

1. **JSON Syntax Error**
   ```bash
   cat .claude-plugin/marketplace.json | jq .
   ```

2. **Schema Validation Failure**
   - Check error messages
   - Verify kebab-case naming convention
   - Check for missing required fields

3. **File Path Errors**
   - Verify files referenced in plugin.json actually exist
   - Ensure relative paths start with `./`

### Version Sync Issues

All plugin versions are automatically synchronized. Never edit versions manually - always use `npm run version:*` scripts.

## 📚 Additional Resources

- [Claude Code Plugin Official Documentation](https://code.claude.com/docs/en/plugins)
- [Plugin Marketplaces Documentation](https://code.claude.com/docs/en/plugin-marketplaces.md)
- [Plugins Reference](https://code.claude.com/docs/en/plugins-reference.md)
