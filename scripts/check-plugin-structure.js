#!/usr/bin/env node

/**
 * 플러그인 디렉토리 구조 검증 도구
 * 공식 문서의 디렉토리 구조 규칙을 검증합니다.
 */

const fs = require('fs');
const path = require('path');

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(color, message) {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function checkPluginStructure(pluginPath, pluginName) {
  log('blue', `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  log('blue', `🏗️  STRUCTURE CHECK: ${pluginName}`);
  log('blue', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  let hasErrors = false;
  let hasWarnings = false;

  // Check required: .claude-plugin/plugin.json
  const pluginJsonPath = path.join(pluginPath, '.claude-plugin', 'plugin.json');
  if (!fs.existsSync(pluginJsonPath)) {
    log('red', '❌ REQUIRED: .claude-plugin/plugin.json not found');
    hasErrors = true;
  } else {
    log('green', '✅ .claude-plugin/plugin.json exists');
  }

  // Check standard directories
  const standardDirs = {
    commands: 'commands/',
    agents: 'agents/',
    skills: 'skills/',
    hooks: 'hooks/',
  };

  log('cyan', '\n📁 Checking standard directories:');
  Object.entries(standardDirs).forEach(([name, dir]) => {
    const dirPath = path.join(pluginPath, dir);
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      if (files.length > 0) {
        log('green', `   ✅ ${dir} (${files.length} files)`);
      } else {
        log('yellow', `   ⚠️  ${dir} (empty)`);
        hasWarnings = true;
      }
    } else {
      log('yellow', `   ℹ️  ${dir} (not present)`);
    }
  });

  // Check for files in wrong locations
  log('cyan', '\n🚫 Checking for misplaced files:');
  const claudePluginDir = path.join(pluginPath, '.claude-plugin');
  if (fs.existsSync(claudePluginDir)) {
    const files = fs.readdirSync(claudePluginDir).filter(f => f !== 'plugin.json');
    if (files.length > 0) {
      log('red', '   ❌ Unexpected files in .claude-plugin/:');
      files.forEach(f => log('red', `      - ${f}`));
      log('yellow', '      ⚠️  Only plugin.json should be in .claude-plugin/');
      hasErrors = true;
    } else {
      log('green', '   ✅ .claude-plugin/ contains only plugin.json');
    }
  }

  // Check naming conventions
  log('cyan', '\n🔤 Checking naming conventions:');
  const kebabCasePattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  if (!kebabCasePattern.test(pluginName)) {
    log('red', `   ❌ Plugin name "${pluginName}" is not in kebab-case`);
    hasErrors = true;
  } else {
    log('green', `   ✅ Plugin name follows kebab-case: ${pluginName}`);
  }

  // Check command file naming
  const commandsDir = path.join(pluginPath, 'commands');
  if (fs.existsSync(commandsDir)) {
    const commandFiles = fs.readdirSync(commandsDir);
    commandFiles.forEach(file => {
      const name = path.parse(file).name;
      if (!kebabCasePattern.test(name)) {
        log('yellow', `   ⚠️  Command file not kebab-case: ${file}`);
        hasWarnings = true;
      }
      if (!file.endsWith('.md')) {
        log('yellow', `   ⚠️  Command file should be .md: ${file}`);
        hasWarnings = true;
      }
    });
  }

  // Summary
  log('blue', '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  if (hasErrors) {
    log('red', '❌ STRUCTURE CHECK FAILED');
  } else if (hasWarnings) {
    log('yellow', '⚠️  STRUCTURE CHECK PASSED WITH WARNINGS');
  } else {
    log('green', '✅ STRUCTURE CHECK PASSED');
  }
  log('blue', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  return !hasErrors;
}

function checkAllPlugins(rootPath) {
  const marketplacePath = path.join(rootPath, '.claude-plugin', 'marketplace.json');

  if (!fs.existsSync(marketplacePath)) {
    log('red', '❌ marketplace.json not found');
    process.exit(1);
  }

  const marketplaceData = JSON.parse(fs.readFileSync(marketplacePath, 'utf8'));
  let allValid = true;

  marketplaceData.plugins.forEach(plugin => {
    if (typeof plugin.source === 'string' && plugin.source.startsWith('./')) {
      const pluginPath = path.join(rootPath, plugin.source);
      if (!checkPluginStructure(pluginPath, plugin.name)) {
        allValid = false;
      }
    }
  });

  return allValid;
}

// Main execution
const rootPath = process.argv[2] || process.cwd();

try {
  const success = checkAllPlugins(rootPath);
  process.exit(success ? 0 : 1);
} catch (error) {
  log('red', `\n💥 Error: ${error.message}`);
  console.error(error);
  process.exit(1);
}
