# CLAUDE.md

## Overview
Byeonggi's custom plugin marketplace for Claude Code, providing developer productivity tools and project templates. All development follows official Claude Code documentation standards.

## Repository Structure
```
byeonggi-marketplace/
├── .claude-plugin/marketplace.json
├── plugins/
│   ├── developer-tools/        # Code formatting, review agents
│   └── project-templates/      # Project scaffolding
├── scripts/                    # Validation and version sync tools
└── DEVELOPMENT.md              # Complete development guide
```

## Reference Documentation

**Project:**
- [README.md](./README.md) - User guide
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Complete dev guide, JSON schemas, troubleshooting

**Official:**
- [Plugin Marketplaces](https://code.claude.com/docs/en/plugin-marketplaces.md)
- [Plugins Reference](https://code.claude.com/docs/en/plugins-reference.md)

## Core Conventions

**Naming (kebab-case):**
- Plugin names: `developer-tools`
- Files: `format.md`, `code-reviewer.md`
- Commands: `commands/command-name.md`
- Agents: `agents/agent-name.md`
- Skills: `skills/skill-name/SKILL.md`

**Version Management:**
- Semantic Versioning (MAJOR.MINOR.PATCH)
- Use `npm run version:*` scripts (never edit manually)
- Versions synchronized across marketplace and all plugins

**Directory Rules:**
- `.claude-plugin/` contains ONLY `plugin.json`
- All components at plugin root

[See DEVELOPMENT.md for complete conventions](./DEVELOPMENT.md)

## Key Tasks & Workflows

### Adding New Plugin
1. Create `plugins/new-plugin-name/`
2. Create `.claude-plugin/plugin.json` (required)
3. Add components: `commands/`, `agents/`, `skills/`, `hooks/`
4. Update `.claude-plugin/marketplace.json` plugins array
5. `npm run validate:all`

[Detailed checklist](./DEVELOPMENT.md#새-플러그인-추가-시)

### Updating Plugin
1. Modify plugin files
2. Update `plugin.json` if adding/removing components
3. `npm run validate:all`
4. If releasing: `npm run version:patch`

### Version Release
1. `npm run validate:all`
2. `npm run version:patch` (or minor/major)
3. `git tag v1.0.1 && git push origin main --tags`

[Full process](./DEVELOPMENT.md#버전-업데이트-워크플로우)

## JSON Specifications

**marketplace.json:**
```json
{
  "name": "marketplace-name",           // Required, kebab-case
  "owner": {"name": "Your Name"},       // Required
  "metadata": {"version": "1.0.0"},     // Semantic versioning
  "plugins": [{                         // Required array
    "name": "plugin-name",              // Required, kebab-case
    "source": "./plugins/plugin-name",  // Required
    "version": "1.0.0"
  }]
}
```

**plugin.json:**
```json
{
  "name": "plugin-name",                // Required, kebab-case
  "version": "1.0.0",
  "commands": ["./commands/cmd.md"],    // Relative paths
  "agents": ["./agents/agent.md"],
  "skills": ["./skills/skill-name"]     // Directory with SKILL.md
}
```

[Full schemas](./DEVELOPMENT.md#📐-json-스키마)

## Testing & Validation

**Validation:**
```bash
npm run validate:all          # Full validation (required before release)
npm run validate              # JSON schema only
npm run validate:structure    # Directory structure only
```

**Manual checks:**
```bash
cat .claude-plugin/marketplace.json | jq .
```

**Local testing:**
```bash
/plugin marketplace add .
/plugin install developer-tools@byeonggi-marketplace
```

## Essential Commands

```bash
npm install                   # Install dependencies
npm run validate:all          # Validate everything
npm run version:patch         # Bump version (1.0.0 → 1.0.1)
npm run version:dry-run       # Preview version changes
npm test                      # Run tests
```

[All commands](./DEVELOPMENT.md#🛠-개발-도구)

## Key Rules

1. **Always validate before release**: `npm run validate:all`
2. **Never edit versions manually**: Use `npm run version:*`
3. **Use kebab-case everywhere**: Plugin names, file names
4. **`.claude-plugin/` is sacred**: Only `plugin.json` allowed

[Troubleshooting](./DEVELOPMENT.md#🔍-문제-해결)
