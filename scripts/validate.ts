#!/usr/bin/env npx tsx

/**
 * 마켓플레이스 및 플러그인 검증 도구
 * 공식 문서 기준에 따라 JSON 구조 및 파일 존재 여부를 검증합니다.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Ajv, { ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

type ColorKey = 'reset' | 'red' | 'green' | 'yellow' | 'blue' | 'cyan';

const COLORS: Record<ColorKey, string> = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color: ColorKey, message: string): void {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function loadSchema(schemaPath: string): ValidateFunction {
  try {
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    return ajv.compile(schema);
  } catch (error) {
    log('red', `❌ Failed to load schema: ${schemaPath}`);
    throw error;
  }
}

function validateJson(filePath: string, validate: ValidateFunction, label: string): boolean {
  log('cyan', `\n🔍 Validating ${label}: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    log('red', `❌ File not found: ${filePath}`);
    return false;
  }

  let data: unknown;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    log('red', `❌ Invalid JSON syntax: ${(error as Error).message}`);
    return false;
  }

  const valid = validate(data);

  if (!valid) {
    log('red', '❌ Validation failed:');
    validate.errors?.forEach(error => {
      log('red', `   - ${error.instancePath || '/'} ${error.message}`);
    });
    return false;
  }

  log('green', '✅ Valid');
  return true;
}

interface SkillFrontmatter {
  name?: string;
  description?: string;
  'allowed-tools'?: string;
}

/**
 * SKILL.md 파일의 YAML frontmatter를 검증합니다.
 * 필수 필드: name, description
 * 선택 필드: allowed-tools
 */
function validateSkillFrontmatter(filePath: string, skillPath: string): boolean {
  let hasErrors = false;

  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Extract YAML frontmatter (between --- markers)
    const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);

    if (!frontmatterMatch) {
      log('red', `   ❌ SKILL.md missing YAML frontmatter: ${skillPath}`);
      log('yellow', `      💡 Add frontmatter with --- markers at the top of the file`);
      return false;
    }

    const frontmatterContent = frontmatterMatch[1];
    let frontmatter: SkillFrontmatter;

    try {
      frontmatter = yaml.load(frontmatterContent) as SkillFrontmatter;
    } catch (yamlError) {
      log('red', `   ❌ Invalid YAML syntax in frontmatter: ${skillPath}`);
      log('red', `      ${(yamlError as Error).message}`);
      return false;
    }

    if (!frontmatter || typeof frontmatter !== 'object') {
      log('red', `   ❌ SKILL.md frontmatter is empty or invalid: ${skillPath}`);
      return false;
    }

    // Validate required field: name
    if (!frontmatter.name) {
      log('red', `   ❌ SKILL.md missing required field 'name': ${skillPath}`);
      hasErrors = true;
    } else {
      // Validate name format: lowercase, numbers, hyphens only, max 64 chars
      const nameRegex = /^[a-z0-9-]+$/;
      if (!nameRegex.test(frontmatter.name)) {
        log('red', `   ❌ SKILL.md 'name' must be lowercase, numbers, hyphens only: ${frontmatter.name}`);
        hasErrors = true;
      } else if (frontmatter.name.length > 64) {
        log('red', `   ❌ SKILL.md 'name' exceeds 64 characters: ${frontmatter.name}`);
        hasErrors = true;
      } else {
        log('green', `   ✅ Skill name valid: ${frontmatter.name}`);
      }
    }

    // Validate required field: description
    if (!frontmatter.description) {
      log('red', `   ❌ SKILL.md missing required field 'description': ${skillPath}`);
      hasErrors = true;
    } else {
      const descLength = frontmatter.description.length;
      if (descLength > 1024) {
        log('red', `   ❌ SKILL.md 'description' exceeds 1024 characters (${descLength}): ${skillPath}`);
        hasErrors = true;
      } else {
        log('green', `   ✅ Skill description valid (${descLength} chars)`);
      }
    }

    // Validate optional field: allowed-tools
    if (frontmatter['allowed-tools']) {
      log('green', `   ✅ Skill allowed-tools: ${frontmatter['allowed-tools']}`);
    }

    return !hasErrors;
  } catch (error) {
    log('red', `   ❌ Error reading SKILL.md: ${(error as Error).message}`);
    return false;
  }
}

function validateMarketplace(rootPath: string): boolean {
  const marketplacePath = path.join(rootPath, '.claude-plugin', 'marketplace.json');
  const schemaPath = path.join(__dirname, 'schemas', 'marketplace-schema.json');

  log('blue', '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('blue', '📦 MARKETPLACE VALIDATION');
  log('blue', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const validate = loadSchema(schemaPath);
  return validateJson(marketplacePath, validate, 'Marketplace');
}

interface PluginData {
  commands?: string | string[];
  agents?: string | string[];
  skills?: string | string[];
  hooks?: string;
  mcpServers?: string;
}

function validatePluginFiles(pluginPath: string, pluginData: PluginData): boolean {
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

  // Validate skill directories and SKILL.md frontmatter
  if (pluginData.skills) {
    const skills = Array.isArray(pluginData.skills) ? pluginData.skills : [pluginData.skills];
    skills.forEach(skillPath => {
      const fullPath = path.join(pluginPath, skillPath, 'SKILL.md');
      if (!fs.existsSync(fullPath)) {
        log('red', `   ❌ SKILL.md not found in: ${skillPath}`);
        hasErrors = true;
      } else {
        log('green', `   ✅ Skill file exists: ${skillPath}/SKILL.md`);
        // Validate SKILL.md frontmatter
        const skillValidation = validateSkillFrontmatter(fullPath, skillPath);
        if (!skillValidation) {
          hasErrors = true;
        }
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

function validatePlugin(pluginPath: string, pluginName: string): boolean {
  const pluginJsonPath = path.join(pluginPath, '.claude-plugin', 'plugin.json');
  const schemaPath = path.join(__dirname, 'schemas', 'plugin-schema.json');

  log('blue', `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  log('blue', `🔌 PLUGIN VALIDATION: ${pluginName}`);
  log('blue', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const validate = loadSchema(schemaPath);
  const isValid = validateJson(pluginJsonPath, validate, 'Plugin Manifest');

  if (!isValid) return false;

  // Load plugin data and validate referenced files
  const pluginData: PluginData = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));

  log('cyan', '\n🔍 Checking referenced files...');
  return validatePluginFiles(pluginPath, pluginData);
}

interface MarketplacePlugin {
  name: string;
  source: string;
}

interface MarketplaceData {
  plugins: MarketplacePlugin[];
}

function validateAll(rootPath: string): boolean {
  let allValid = true;

  // Validate marketplace
  if (!validateMarketplace(rootPath)) {
    allValid = false;
  }

  // Load marketplace data to get plugin list
  const marketplacePath = path.join(rootPath, '.claude-plugin', 'marketplace.json');
  const marketplaceData: MarketplaceData = JSON.parse(fs.readFileSync(marketplacePath, 'utf8'));

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
  log('red', `\n💥 Fatal error: ${(error as Error).message}`);
  console.error(error);
  process.exit(1);
}
