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

# JSON schema validation + SKILL.md frontmatter validation
npm run validate

# Directory structure validation
npm run validate:structure

# Run tests
npm test
```

**What gets validated:**
- Marketplace JSON schema
- Plugin JSON schema
- Referenced file existence (commands, agents, skills, hooks)
- SKILL.md YAML frontmatter:
  - `name` field (required, kebab-case, max 64 chars)
  - `description` field (required, max 1024 chars)
  - `allowed-tools` field (optional)

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

## 🎯 Skills Development Guide

Skills are reusable prompt components that Claude can automatically discover and apply. This section covers how to create effective skills for your plugins.

> 📚 **Reference**: [Official Skills Documentation](https://code.claude.com/docs/en/skills)

### SKILL.md File Structure

Every skill requires a `SKILL.md` file with YAML frontmatter:

```yaml
---
name: skill-name
description: Describe what the skill does and when to use it
allowed-tools: Read, Grep, Glob  # Optional: restrict available tools
---

# Skill Name

## Instructions
Step-by-step instructions for Claude to follow.

## Examples
Concrete usage examples.
```

### Required Fields

| Field | Description | Constraints |
|-------|-------------|-------------|
| `name` | Skill identifier | Lowercase, numbers, hyphens only. Max 64 chars |
| `description` | What the skill does and when to use it | Max 1024 chars. Critical for auto-discovery |

### Optional Fields

| Field | Description | Example |
|-------|-------------|---------|
| `allowed-tools` | Restrict tools available to the skill | `Read, Grep, Glob` |

### Writing Effective Descriptions

The `description` field is crucial for Claude to automatically discover and use your skill.

**❌ Too vague:**
```yaml
description: Helps with data
```

**✅ Specific and actionable:**
```yaml
description: |
  Extract text and tables from PDF files, fill forms, merge documents.
  Use when working with PDF files or when the user mentions PDFs,
  forms, or document extraction.
```

**Best practices:**
- Include what the skill does
- Include when to use it (trigger conditions)
- Include keywords users might mention

### Directory Structure

Skills must be placed in a directory containing `SKILL.md`:

```
plugins/my-plugin/
└── skills/
    └── my-skill/
        ├── SKILL.md           # Required
        ├── reference.md       # Optional: additional context
        ├── examples.md        # Optional: more examples
        ├── scripts/           # Optional: helper scripts
        │   └── helper.py
        └── templates/         # Optional: template files
            └── template.txt
```

### Plugin.json Configuration

Reference skills by their directory path (not the SKILL.md file):

```json
{
  "name": "my-plugin",
  "skills": [
    "./skills/my-skill",
    "./skills/another-skill"
  ]
}
```

### Using allowed-tools for Security

Restrict tool access for read-only or security-sensitive skills:

```yaml
---
name: code-analyzer
description: Analyze code quality and patterns. Use when reviewing code.
allowed-tools: Read, Grep, Glob
---
```

When `allowed-tools` is specified:
- Claude can only use the listed tools
- No additional permission prompts for those tools
- Useful for read-only analysis skills

### Skill Design Best Practices

1. **One skill = One focused purpose**
   - ✅ "PDF form filling"
   - ✅ "Excel data analysis"
   - ❌ "Document processing" (too broad)

2. **Include concrete examples**
   ```markdown
   ## Examples

   ### Example 1: Extract text from PDF
   Input: "Extract all text from report.pdf"
   Action: Use Read tool to process the PDF...
   ```

3. **Use clear, actionable instructions**
   ```markdown
   ## Instructions
   1. First, identify the target file
   2. Read the file contents using Read tool
   3. Parse the structure...
   ```

4. **Version your skills** (optional but recommended)
   ```markdown
   ## Version History
   - v2.0.0 (2025-10-01): Breaking changes
   - v1.1.0 (2025-09-15): Added new features
   - v1.0.0 (2025-09-01): Initial release
   ```

### Skills Troubleshooting

| Problem | Solution |
|---------|----------|
| Claude doesn't use the skill | Make `description` more specific with trigger keywords |
| Skill doesn't load | Validate YAML syntax, check file path |
| Script errors | Check execute permissions, use `/` in paths |
| Multiple skills conflict | Add unique trigger terms to each skill's description |

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
- [Skills Documentation](https://code.claude.com/docs/en/skills)
