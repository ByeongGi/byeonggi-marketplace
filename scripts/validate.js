#!/usr/bin/env node

/**
 * 마켓플레이스 및 플러그인 검증 도구
 * 공식 문서 기준에 따라 JSON 구조 및 파일 존재 여부를 검증합니다.
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, message) {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function loadSchema(schemaPath) {
  try {
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    return ajv.compile(schema);
  } catch (error) {
    log('red', `❌ Failed to load schema: ${schemaPath}`);
    throw error;
  }
}

function validateJson(filePath, validate, label) {
  log('cyan', `\n🔍 Validating ${label}: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    log('red', `❌ File not found: ${filePath}`);
    return false;
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    log('red', `❌ Invalid JSON syntax: ${error.message}`);
    return false;
  }

  const valid = validate(data);

  if (!valid) {
    log('red', '❌ Validation failed:');
    validate.errors.forEach(error => {
      log('red', `   - ${error.instancePath || '/'} ${error.message}`);
    });
    return false;
  }

  log('green', '✅ Valid');
  return true;
}

function validateMarketplace(rootPath) {
  const marketplacePath = path.join(rootPath, '.claude-plugin', 'marketplace.json');
  const schemaPath = path.join(__dirname, 'schemas', 'marketplace-schema.json');

  log('blue', '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('blue', '📦 MARKETPLACE VALIDATION');
  log('blue', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const validate = loadSchema(schemaPath);
  return validateJson(marketplacePath, validate, 'Marketplace');
}

function validatePluginFiles(pluginPath, pluginData) {
  let hasErrors = false;

  // Validate command files
  if (pluginData.commands) {
    const commands = Array.isArray(pluginData.commands) ? pluginData.commands : [pluginData.commands];
    commands.forEach(cmdPath => {
      const fullPath = path.join(pluginPath, cmdPath);
      if (!fs.existsSync(fullPath)) {
        log('red', `   ❌ Command file not found: ${cmdPath}`);
        hasErrors = true;
      } else if (!cmdPath.endsWith('.md')) {
        log('yellow', `   ⚠️  Command file should be .md: ${cmdPath}`);
      } else {
        log('green', `   ✅ Command file exists: ${cmdPath}`);
      }
    });
  }

  // Validate agent files
  if (pluginData.agents) {
    const agents = Array.isArray(pluginData.agents) ? pluginData.agents : [pluginData.agents];
    agents.forEach(agentPath => {
      const fullPath = path.join(pluginPath, agentPath);
      if (!fs.existsSync(fullPath)) {
        log('red', `   ❌ Agent file not found: ${agentPath}`);
        hasErrors = true;
      } else if (!agentPath.endsWith('.md')) {
        log('yellow', `   ⚠️  Agent file should be .md: ${agentPath}`);
      } else {
        log('green', `   ✅ Agent file exists: ${agentPath}`);
      }
    });
  }

  // Validate skill directories
  if (pluginData.skills) {
    const skills = Array.isArray(pluginData.skills) ? pluginData.skills : [pluginData.skills];
    skills.forEach(skillPath => {
      const fullPath = path.join(pluginPath, skillPath, 'SKILL.md');
      if (!fs.existsSync(fullPath)) {
        log('red', `   ❌ SKILL.md not found in: ${skillPath}`);
        hasErrors = true;
      } else {
        log('green', `   ✅ Skill file exists: ${skillPath}/SKILL.md`);
      }
    });
  }

  // Validate hooks
  if (pluginData.hooks) {
    const hooksPath = path.join(pluginPath, pluginData.hooks);
    if (!fs.existsSync(hooksPath)) {
      log('red', `   ❌ Hooks file not found: ${pluginData.hooks}`);
      hasErrors = true;
    } else {
      log('green', `   ✅ Hooks file exists: ${pluginData.hooks}`);
    }
  }

  // Validate MCP servers
  if (pluginData.mcpServers) {
    const mcpPath = path.join(pluginPath, pluginData.mcpServers);
    if (!fs.existsSync(mcpPath)) {
      log('red', `   ❌ MCP servers file not found: ${pluginData.mcpServers}`);
      hasErrors = true;
    } else {
      log('green', `   ✅ MCP servers file exists: ${pluginData.mcpServers}`);
    }
  }

  return !hasErrors;
}

function validatePlugin(pluginPath, pluginName) {
  const pluginJsonPath = path.join(pluginPath, '.claude-plugin', 'plugin.json');
  const schemaPath = path.join(__dirname, 'schemas', 'plugin-schema.json');

  log('blue', `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  log('blue', `🔌 PLUGIN VALIDATION: ${pluginName}`);
  log('blue', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const validate = loadSchema(schemaPath);
  const isValid = validateJson(pluginJsonPath, validate, 'Plugin Manifest');

  if (!isValid) return false;

  // Load plugin data and validate referenced files
  const pluginData = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));

  log('cyan', '\n🔍 Checking referenced files...');
  return validatePluginFiles(pluginPath, pluginData);
}

function validateAll(rootPath) {
  let allValid = true;

  // Validate marketplace
  if (!validateMarketplace(rootPath)) {
    allValid = false;
  }

  // Load marketplace data to get plugin list
  const marketplacePath = path.join(rootPath, '.claude-plugin', 'marketplace.json');
  const marketplaceData = JSON.parse(fs.readFileSync(marketplacePath, 'utf8'));

  // Validate each plugin
  marketplaceData.plugins.forEach(plugin => {
    if (typeof plugin.source === 'string' && plugin.source.startsWith('./')) {
      const pluginPath = path.join(rootPath, plugin.source);
      if (!validatePlugin(pluginPath, plugin.name)) {
        allValid = false;
      }
    } else {
      log('yellow', `\n⚠️  Skipping non-local plugin: ${plugin.name}`);
    }
  });

  // Final summary
  log('blue', '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  if (allValid) {
    log('green', '✅ ALL VALIDATIONS PASSED');
  } else {
    log('red', '❌ VALIDATION FAILED - Please fix the errors above');
  }
  log('blue', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  return allValid;
}

// Main execution
const rootPath = process.argv[2] || process.cwd();

try {
  const success = validateAll(rootPath);
  process.exit(success ? 0 : 1);
} catch (error) {
  log('red', `\n💥 Fatal error: ${error.message}`);
  console.error(error);
  process.exit(1);
}
