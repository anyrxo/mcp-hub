#!/usr/bin/env node

/**
 * Comprehensive Test Suite for MCP Hub
 * Tests all commands and validates functionality
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CLI_PATH = path.join(__dirname, 'dist', 'cli.js');
const TEST_CONFIG_DIR = path.join(__dirname, 'test-config');
const TEST_CONFIG_PATH = path.join(TEST_CONFIG_DIR, 'claude_desktop_config.json');

let testsPassed = 0;
let testsFailed = 0;

// Colors for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(name, passed, details = '') {
  if (passed) {
    log(`✓ ${name}`, 'green');
    if (details) log(`  ${details}`, 'gray');
    testsPassed++;
  } else {
    log(`✗ ${name}`, 'red');
    if (details) log(`  ${details}`, 'red');
    testsFailed++;
  }
}

async function setup() {
  log('\n🔧 Setting up test environment...', 'cyan');

  // Create test config directory
  try {
    await fs.mkdir(TEST_CONFIG_DIR, { recursive: true });

    // Create initial config file
    const initialConfig = {
      mcpServers: {}
    };
    await fs.writeFile(TEST_CONFIG_PATH, JSON.stringify(initialConfig, null, 2));

    log('✓ Test environment ready', 'green');
  } catch (error) {
    log(`✗ Setup failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

async function cleanup() {
  log('\n🧹 Cleaning up...', 'cyan');
  try {
    await fs.rm(TEST_CONFIG_DIR, { recursive: true, force: true });
    log('✓ Cleanup complete', 'green');
  } catch (error) {
    log(`⚠ Cleanup warning: ${error.message}`, 'yellow');
  }
}

async function runCommand(command, expectSuccess = true) {
  try {
    const { stdout, stderr } = await execAsync(`node ${CLI_PATH} ${command}`);
    return { success: true, stdout, stderr };
  } catch (error) {
    if (!expectSuccess) {
      return { success: false, stdout: error.stdout, stderr: error.stderr, error };
    }
    throw error;
  }
}

// Test 1: CLI loads without errors
async function testCLILoads() {
  log('\n📋 Test 1: CLI loads without errors', 'cyan');
  try {
    const { stdout } = await runCommand('--help');
    const passed = stdout.includes('MCP Hub') && stdout.includes('Commands:');
    logTest('CLI loads and shows help', passed,
      passed ? 'Help text displayed correctly' : 'Help text missing or incorrect');
  } catch (error) {
    logTest('CLI loads and shows help', false, error.message);
  }
}

// Test 2: Search command works
async function testSearch() {
  log('\n📋 Test 2: Search functionality', 'cyan');

  try {
    // Test basic search
    const { stdout } = await runCommand('search github');
    let passed = stdout.includes('github') && stdout.includes('GitHub MCP server');
    logTest('Search finds packages', passed,
      passed ? 'Found github package' : 'Package not found');

    // Test search with no results
    const { stdout: stdout2 } = await runCommand('search nonexistentpackage12345');
    passed = stdout2.includes('Found 0 package') || stdout2.includes('No packages found');
    logTest('Search handles no results', passed,
      passed ? 'Correctly shows no results' : 'Failed to handle no results');

  } catch (error) {
    logTest('Search functionality', false, error.message);
  }
}

// Test 3: Info command works
async function testInfo() {
  log('\n📋 Test 3: Package info display', 'cyan');

  try {
    const { stdout } = await runCommand('info github');
    const checks = [
      stdout.includes('github'),
      stdout.includes('GitHub MCP server'),
      stdout.includes('Version'),
      stdout.includes('Category'),
      stdout.includes('Repository')
    ];
    const passed = checks.every(c => c);
    logTest('Info displays package details', passed,
      passed ? 'All package fields present' : `Missing fields: ${checks.filter(c => !c).length}`);

    // Test non-existent package
    const { stdout: stdout2 } = await runCommand('info nonexistentpackage12345');
    const passed2 = stdout2.includes('not found');
    logTest('Info handles missing packages', passed2,
      passed2 ? 'Shows not found message' : 'Error handling failed');

  } catch (error) {
    logTest('Package info display', false, error.message);
  }
}

// Test 4: Categories command works
async function testCategories() {
  log('\n📋 Test 4: Categories listing', 'cyan');

  try {
    const { stdout } = await runCommand('categories');
    const categories = ['Development', 'Database', 'System', 'Communication'];
    const checks = categories.map(cat => stdout.includes(cat));
    const passed = checks.filter(c => c).length >= 3; // At least 3 categories
    logTest('Categories lists available categories', passed,
      passed ? `Found ${checks.filter(c => c).length} categories` : 'Categories missing');

  } catch (error) {
    logTest('Categories listing', false, error.message);
  }
}

// Test 5: List command works
async function testList() {
  log('\n📋 Test 5: Package listing', 'cyan');

  try {
    // Test list all
    const { stdout } = await runCommand('list --all');
    const packages = ['github', 'filesystem', 'postgres', 'puppeteer'];
    const checks = packages.map(pkg => stdout.includes(pkg));
    const passed = checks.filter(c => c).length >= 3; // At least 3 packages
    logTest('List shows all packages', passed,
      passed ? `Found ${checks.filter(c => c).length}/${packages.length} packages` : 'Packages missing');

  } catch (error) {
    logTest('Package listing', false, error.message);
  }
}

// Test 6: Config path detection
async function testConfig() {
  log('\n📋 Test 6: Configuration management', 'cyan');

  try {
    const { stdout } = await runCommand('config --path');
    const passed = stdout.length > 0;
    logTest('Config path detection', passed,
      passed ? 'Config path returned' : 'No config path');

  } catch (error) {
    logTest('Configuration management', false, error.message);
  }
}

// Test 7: Doctor command diagnostics
async function testDoctor() {
  log('\n📋 Test 7: System diagnostics', 'cyan');

  try {
    const { stdout, stderr } = await runCommand('doctor');
    const output = stdout + stderr; // Combine both stdout and stderr
    const checks = [
      output.includes('Node.js'),
      output.includes('npx'),
      output.includes('Summary') || output.includes('Passed')
    ];
    const passed = checks.every(c => c);
    logTest('Doctor runs diagnostics', passed,
      passed ? 'All diagnostic checks present' : 'Some diagnostics missing');

  } catch (error) {
    logTest('System diagnostics', false, error.message);
  }
}

// Test 8: Registry functionality
async function testRegistry() {
  log('\n📋 Test 8: Registry operations', 'cyan');

  try {
    // Import registry
    const { MCPRegistry } = await import('./dist/registry/registry.js');
    const registry = new MCPRegistry();

    // Test search
    const results = registry.search('github');
    logTest('Registry search works', results.packages.length > 0,
      `Found ${results.packages.length} package(s)`);

    // Test get package
    const pkg = registry.getPackage('github');
    logTest('Registry get package works', pkg !== null && pkg.name === 'github',
      pkg ? `Retrieved: ${pkg.name}` : 'Package not found');

    // Test categories
    const categories = registry.getCategories();
    logTest('Registry categories work', categories.length > 0,
      `Found ${categories.length} categories`);

    // Test list all
    const all = registry.listAll();
    logTest('Registry list all works', all.length >= 5,
      `Found ${all.length} total packages`);

  } catch (error) {
    logTest('Registry operations', false, error.message);
  }
}

// Test 9: Config Manager
async function testConfigManager() {
  log('\n📋 Test 9: Configuration Manager', 'cyan');

  try {
    // Import ConfigManager
    const { ConfigManager } = await import('./dist/utils/config-manager.js');

    // Create instance with test config path
    const configManager = new ConfigManager(TEST_CONFIG_PATH);

    // Test adding a server
    const serverConfig = {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-github'],
      env: { GITHUB_TOKEN: 'test-token' }
    };

    await configManager.addServer('test-github', serverConfig);
    logTest('Config manager adds server', true, 'Server added successfully');

    // Test reading config
    const config = await configManager.getConfig();
    const hasServer = config.mcpServers && config.mcpServers['test-github'];
    logTest('Config manager reads config', hasServer,
      hasServer ? 'Server found in config' : 'Server not in config');

    // Test listing servers
    const servers = await configManager.listServers();
    const hasTestServer = servers['test-github'] !== undefined;
    logTest('Config manager lists servers', hasTestServer,
      hasTestServer ? 'Server in list' : 'Server missing from list');

    // Test marking as installed
    await configManager.markInstalled('test-github', '1.0.0');
    const installed = await configManager.getInstalledPackages();
    const isMarked = installed['test-github'] !== undefined;
    logTest('Config manager tracks installations', isMarked,
      isMarked ? 'Installation tracked' : 'Installation not tracked');

    // Test removing server
    await configManager.removeServer('test-github');
    const configAfter = await configManager.getConfig();
    const removed = !configAfter.mcpServers || !configAfter.mcpServers['test-github'];
    logTest('Config manager removes server', removed,
      removed ? 'Server removed successfully' : 'Server still present');

  } catch (error) {
    logTest('Configuration Manager', false, error.message);
  }
}

// Test 10: TypeScript compilation
async function testBuild() {
  log('\n📋 Test 10: TypeScript compilation', 'cyan');

  try {
    const { stdout, stderr } = await execAsync('npm run build', { cwd: __dirname });
    const passed = !stderr.includes('error') || stdout.includes('Successfully compiled');
    logTest('TypeScript builds without errors', passed,
      passed ? 'Build successful' : 'Build has errors');

  } catch (error) {
    logTest('TypeScript compilation', false, error.message);
  }
}

// Test 11: Package.json validation
async function testPackageJson() {
  log('\n📋 Test 11: Package.json validation', 'cyan');

  try {
    const packageJson = JSON.parse(
      await fs.readFile(path.join(__dirname, 'package.json'), 'utf-8')
    );

    const checks = {
      'Has name': packageJson.name === 'mcp-hub',
      'Has version': packageJson.version === '1.0.0',
      'Has description': packageJson.description && packageJson.description.length > 0,
      'Has bin commands': packageJson.bin && packageJson.bin.mcp,
      'Has dependencies': packageJson.dependencies && Object.keys(packageJson.dependencies).length > 0,
      'Has scripts': packageJson.scripts && packageJson.scripts.build,
      'Has license': packageJson.license === 'MIT',
      'Has repository': packageJson.repository && packageJson.repository.type === 'git'
    };

    const passed = Object.values(checks).every(c => c);
    const passedCount = Object.values(checks).filter(c => c).length;

    logTest('Package.json is valid', passed,
      `${passedCount}/${Object.keys(checks).length} checks passed`);

    if (!passed) {
      Object.entries(checks).forEach(([check, result]) => {
        if (!result) log(`  ✗ ${check}`, 'red');
      });
    }

  } catch (error) {
    logTest('Package.json validation', false, error.message);
  }
}

// Test 12: Documentation exists
async function testDocumentation() {
  log('\n📋 Test 12: Documentation completeness', 'cyan');

  try {
    const requiredFiles = [
      'README.md',
      'LICENSE',
      'CONTRIBUTING.md',
      'CHANGELOG.md',
      'docs/index.html',
      'examples/getting-started.md',
      'examples/advanced-usage.md',
      'examples/use-cases.md'
    ];

    const checks = await Promise.all(
      requiredFiles.map(async (file) => {
        try {
          const stats = await fs.stat(path.join(__dirname, file));
          return { file, exists: stats.size > 0 };
        } catch {
          return { file, exists: false };
        }
      })
    );

    const allExist = checks.every(c => c.exists);
    const existCount = checks.filter(c => c.exists).length;

    logTest('All documentation files exist', allExist,
      `${existCount}/${requiredFiles.length} files present`);

    if (!allExist) {
      checks.forEach(({ file, exists }) => {
        if (!exists) log(`  ✗ Missing: ${file}`, 'red');
      });
    }

  } catch (error) {
    logTest('Documentation completeness', false, error.message);
  }
}

// Main test runner
async function runTests() {
  console.log('');
  log('╔════════════════════════════════════════════════════════╗', 'cyan');
  log('║     MCP Hub - Comprehensive Test Suite                 ║', 'cyan');
  log('╚════════════════════════════════════════════════════════╝', 'cyan');

  await setup();

  // Run all tests
  await testCLILoads();
  await testSearch();
  await testInfo();
  await testCategories();
  await testList();
  await testConfig();
  await testDoctor();
  await testRegistry();
  await testConfigManager();
  await testBuild();
  await testPackageJson();
  await testDocumentation();

  await cleanup();

  // Summary
  log('\n' + '═'.repeat(60), 'cyan');
  log('Test Summary', 'cyan');
  log('═'.repeat(60), 'cyan');

  const total = testsPassed + testsFailed;
  const percentage = total > 0 ? Math.round((testsPassed / total) * 100) : 0;

  log(`\nTotal Tests: ${total}`, 'cyan');
  log(`Passed: ${testsPassed}`, 'green');
  if (testsFailed > 0) {
    log(`Failed: ${testsFailed}`, 'red');
  }
  log(`Success Rate: ${percentage}%\n`, percentage === 100 ? 'green' : 'yellow');

  if (testsFailed === 0) {
    log('✓ All tests passed! MCP Hub is ready for production.', 'green');
  } else {
    log('✗ Some tests failed. Please review the errors above.', 'red');
  }

  console.log('');

  process.exit(testsFailed > 0 ? 1 : 0);
}

// Run tests
runTests().catch((error) => {
  log(`\n✗ Test suite failed: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
