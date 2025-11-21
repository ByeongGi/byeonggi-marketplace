#!/usr/bin/env npx tsx

/**
 * 버전 동기화 도구
 * marketplace.json과 각 plugin.json의 버전을 동기화합니다.
 */

import fs from 'fs';
import path from 'path';

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

function isValidVersion(version: string): boolean {
  return /^\d+\.\d+\.\d+$/.test(version);
}

interface Version {
  major: number;
  minor: number;
  patch: number;
}

function parseVersion(version: string): Version {
  const [major, minor, patch] = version.split('.').map(Number);
  return { major, minor, patch };
}

type IncrementType = 'major' | 'minor' | 'patch';

function incrementVersion(version: string, type: IncrementType = 'patch'): string {
  const v = parseVersion(version);

  switch (type) {
    case 'major':
      v.major++;
      v.minor = 0;
      v.patch = 0;
      break;
    case 'minor':
      v.minor++;
      v.patch = 0;
      break;
    case 'patch':
    default:
      v.patch++;
      break;
  }

  return `${v.major}.${v.minor}.${v.patch}`;
}

function updateJsonFile(filePath: string, updates: Record<string, unknown>): void {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  Object.assign(data, updates);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 4) + '\n', 'utf8');
}

interface MarketplacePlugin {
  name: string;
  source: string;
  version?: string;
}

interface MarketplaceMetadata {
  version?: string;
  [key: string]: unknown;
}

interface MarketplaceData {
  plugins: MarketplacePlugin[];
  metadata?: MarketplaceMetadata;
}

interface UpdateItem {
  file: string;
  current: string;
  new: string;
  type: 'marketplace' | 'plugin';
  name?: string;
}

interface SyncOptions {
  newVersion?: string;
  incrementType?: IncrementType;
  dryRun?: boolean;
}

function syncVersions(rootPath: string, options: SyncOptions = {}): void {
  const { newVersion, incrementType, dryRun = false } = options;

  log('blue', '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('blue', '🔄 VERSION SYNCHRONIZATION');
  log('blue', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (dryRun) {
    log('yellow', '⚠️  DRY RUN MODE - No files will be modified\n');
  }

  // Load marketplace data
  const marketplacePath = path.join(rootPath, '.claude-plugin', 'marketplace.json');
  const marketplaceData: MarketplaceData = JSON.parse(fs.readFileSync(marketplacePath, 'utf8'));

  const currentVersion = marketplaceData.metadata?.version || '0.0.0';
  log('cyan', `Current marketplace version: ${currentVersion}`);

  // Determine new version
  let targetVersion: string;
  if (newVersion) {
    if (!isValidVersion(newVersion)) {
      log('red', `❌ Invalid version format: ${newVersion}`);
      log('yellow', 'Version must follow semantic versioning (e.g., 1.2.3)');
      process.exit(1);
    }
    targetVersion = newVersion;
  } else if (incrementType) {
    targetVersion = incrementVersion(currentVersion, incrementType);
  } else {
    log('yellow', '⚠️  No version change specified');
    return;
  }

  log('green', `New version: ${targetVersion}\n`);

  const updates: UpdateItem[] = [];

  // Update marketplace version
  updates.push({
    file: marketplacePath,
    current: currentVersion,
    new: targetVersion,
    type: 'marketplace',
  });

  // Update each plugin version
  marketplaceData.plugins.forEach(plugin => {
    if (typeof plugin.source === 'string' && plugin.source.startsWith('./')) {
      const pluginJsonPath = path.join(rootPath, plugin.source, '.claude-plugin', 'plugin.json');

      if (fs.existsSync(pluginJsonPath)) {
        const pluginData = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));
        updates.push({
          file: pluginJsonPath,
          current: pluginData.version || 'none',
          new: targetVersion,
          type: 'plugin',
          name: plugin.name,
        });
      }
    }
  });

  // Display update plan
  log('cyan', '📋 Update Plan:');
  updates.forEach(update => {
    const label = update.type === 'marketplace'
      ? 'Marketplace'
      : `Plugin: ${update.name}`;
    log('yellow', `   ${label}: ${update.current} → ${update.new}`);
  });

  // Apply updates
  if (!dryRun) {
    log('cyan', '\n🔧 Applying updates...');

    updates.forEach(update => {
      if (update.type === 'marketplace') {
        updateJsonFile(update.file, {
          metadata: {
            ...marketplaceData.metadata,
            version: update.new,
          },
        });
      } else {
        updateJsonFile(update.file, { version: update.new });
      }
      log('green', `   ✅ Updated: ${path.basename(path.dirname(path.dirname(update.file)))}`);
    });

    // Update plugins array in marketplace
    marketplaceData.plugins = marketplaceData.plugins.map(plugin => ({
      ...plugin,
      version: targetVersion,
    }));
    fs.writeFileSync(marketplacePath, JSON.stringify(marketplaceData, null, 4) + '\n', 'utf8');

    log('green', '\n✅ All versions synchronized successfully!');

    // Git tag suggestion
    log('blue', '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    log('yellow', '💡 Suggested next steps:');
    log('cyan', `   git add .`);
    log('cyan', `   git commit -m "chore: bump version to ${targetVersion}"`);
    log('cyan', `   git tag v${targetVersion}`);
    log('cyan', `   git push origin main --tags`);
  }

  log('blue', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

interface ParsedArgs {
  rootPath: string;
  dryRun: boolean;
  incrementType?: IncrementType;
  newVersion?: string;
}

// CLI argument parsing
function parseArgs(): ParsedArgs {
  const args = process.argv.slice(2);
  const options: ParsedArgs = {
    rootPath: process.cwd(),
    dryRun: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--dry-run' || arg === '-d') {
      options.dryRun = true;
    } else if (arg === '--major' || arg === '-M') {
      options.incrementType = 'major';
    } else if (arg === '--minor' || arg === '-m') {
      options.incrementType = 'minor';
    } else if (arg === '--patch' || arg === '-p') {
      options.incrementType = 'patch';
    } else if (arg === '--version' || arg === '-v') {
      options.newVersion = args[++i];
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
Usage: sync-versions.ts [options]

Options:
  -v, --version <version>   Set specific version (e.g., 1.2.3)
  -M, --major              Increment major version (X.0.0)
  -m, --minor              Increment minor version (0.X.0)
  -p, --patch              Increment patch version (0.0.X) [default]
  -d, --dry-run            Show what would be changed without modifying files
  -h, --help               Show this help message

Examples:
  sync-versions.ts --patch
  sync-versions.ts --version 2.0.0
  sync-versions.ts --major --dry-run
      `);
      process.exit(0);
    } else if (!arg.startsWith('-')) {
      options.rootPath = arg;
    }
  }

  return options;
}

// Main execution
try {
  const options = parseArgs();
  syncVersions(options.rootPath, options);
} catch (error) {
  log('red', `\n💥 Error: ${(error as Error).message}`);
  console.error(error);
  process.exit(1);
}
