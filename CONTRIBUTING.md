# Contributing Guide

Thank you for contributing to Byeonggi's Plugin Marketplace! This guide explains how to add new plugins or improve existing ones.

## Plugin Development Process

1. **Create Plugin**: Create a new folder under the `plugins/` directory.
2. **Write Metadata**: Create a `.claude-plugin/plugin.json` file and fill in the required information.
3. **Implement Features**: Implement features in directories like `commands/`, `agents/`, `skills/`, etc.
4. **Register in Marketplace**: Add the new plugin to the `plugins` array in `.claude-plugin/marketplace.json`.

For detailed information, see [CLAUDE.md](CLAUDE.md) and [DEVELOPMENT.md](DEVELOPMENT.md).

## Submitting Pull Requests

Commit your changes and submit a PR. The PR description should include details about the added plugin or modified features.
