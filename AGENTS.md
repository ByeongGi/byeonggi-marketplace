# Claude Code Marketplace Guide

## Overview
Byeonggi's custom plugin marketplace for Claude Code. Follow the official docs and keep `README.md`, `DEVELOPMENT.md`, and `CLAUDE.md` as the primary references for workflows and schemas.

## Repository Structure
```
byeonggi-marketplace/
├── .claude-plugin/marketplace.json
├── plugins/                    # Each plugin lives here
├── scripts/                    # Validation + version tools (tsx)
└── DEVELOPMENT.md              # Complete development guide
```
- Each plugin folder contains `.claude-plugin/plugin.json`, `commands/`, `agents/`, `skills/`, and optional `hooks/`.
- Keep assets beside the plugin they document; `.claude-plugin/` holds only `plugin.json`.

## Conventions
- Use kebab-case for plugins, files, commands, agents, and skill directories (`skills/skill-name/SKILL.md`).
- Skill frontmatter requires `name` and `description`; include `allowed-tools` to restrict capabilities.
- TypeScript utilities stay in ES module style with clear identifiers.
- Manage versions via `npm run version:*`; never edit marketplace or plugin versions manually.

## Core Workflows
**Add plugin**
1. Create `plugins/new-plugin-name/`.
2. Add `.claude-plugin/plugin.json` plus `commands/`, `agents/`, `skills/`, and optional `hooks/`.
3. Update `.claude-plugin/marketplace.json` plugins array.
4. Run `npm run validate:all`.

**Update plugin**
1. Modify plugin files; update `plugin.json` if components change.
2. Run `npm run validate:all`.
3. For releases, bump with `npm run version:patch|minor|major`.

**Add skill**
1. Create `plugins/<plugin>/skills/<skill>/SKILL.md` with YAML frontmatter:
   ```yaml
   ---
   name: skill-name
   description: What it does and when to use it
   ---
   ```
2. Reference it in `plugin.json`: `"skills": ["./skills/skill-name"]`.
3. Run `npm run validate:all`.

## Validation & Commands
- Install deps: `pnpm install` (Node ≥24, pnpm ≥10). Scripts run via `npm run ...`.
- Validation/test:
  ```bash
  npm run validate:structure
  npm run validate
  npm run validate:all   # main pre-release check
  npm test               # alias for validate:all
  ```
- Formatting and versioning:
  ```bash
  npm run format:json
  npm run version:dry-run
  npm run version:patch|minor|major
  ```
- Manual check: `cat .claude-plugin/marketplace.json | jq .`
- Local install reminder: `/plugin marketplace add .` then `/plugin install <plugin>@byeonggi-marketplace`

## JSON Specs
**marketplace.json**
```json
{
  "name": "marketplace-name",
  "owner": {"name": "Your Name"},
  "metadata": {"version": "1.0.0"},
  "plugins": [{
    "name": "plugin-name",
    "source": "./plugins/plugin-name",
    "version": "1.0.0"
  }]
}
```
**plugin.json**
```json
{
  "name": "plugin-name",
  "version": "1.0.0",
  "commands": ["./commands/cmd.md"],
  "agents": ["./agents/agent.md"],
  "skills": ["./skills/skill-name"]
}
```

## Key Rules
- Always run `npm run validate:all` before release or version bumps.
- Use only the version scripts for bumps; never edit versions manually.
- Keep everything kebab-case and ensure directory references are relative.
- `.claude-plugin/` is sacred: only `plugin.json` lives there.
- For new commands/hooks/skills, ensure matching files exist and README snippets use relative paths.
