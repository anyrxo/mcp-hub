import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs/promises';
import { ConfigManager } from '../utils/config-manager.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function doctorCommand() {
  console.log(chalk.cyan('\n🩺 Running MCP Hub Diagnostics...\n'));

  const configManager = new ConfigManager();
  const checks: Array<{ name: string; status: 'pass' | 'fail' | 'warn'; message?: string }> = [];

  // Check 1: Node.js version
  let spinner = ora('Checking Node.js version...').start();
  try {
    const nodeVersion = process.version;
    const major = parseInt(nodeVersion.split('.')[0].substring(1));
    if (major >= 18) {
      checks.push({ name: 'Node.js version', status: 'pass', message: nodeVersion });
      spinner.succeed(chalk.green(`Node.js version ${nodeVersion} ✓`));
    } else {
      checks.push({ name: 'Node.js version', status: 'fail', message: `${nodeVersion} (requires >= 18)` });
      spinner.fail(chalk.red(`Node.js version ${nodeVersion} (requires >= 18)`));
    }
  } catch (error) {
    checks.push({ name: 'Node.js version', status: 'fail' });
    spinner.fail(chalk.red('Failed to check Node.js version'));
  }

  // Check 2: Claude Code config file
  spinner = ora('Checking Claude Code configuration...').start();
  try {
    const configPath = configManager.getConfigPath();
    try {
      await fs.access(configPath);
      checks.push({ name: 'Claude config file', status: 'pass', message: configPath });
      spinner.succeed(chalk.green('Claude config file exists ✓'));
    } catch {
      checks.push({ name: 'Claude config file', status: 'warn', message: 'File will be created on first install' });
      spinner.warn(chalk.yellow('Claude config file not found (will be created)'));
    }
  } catch (error) {
    checks.push({ name: 'Claude config file', status: 'fail' });
    spinner.fail(chalk.red('Failed to check Claude config'));
  }

  // Check 3: Installed packages
  spinner = ora('Checking installed packages...').start();
  try {
    const installed = await configManager.getInstalledPackages();
    const count = Object.keys(installed).length;
    checks.push({ name: 'Installed packages', status: 'pass', message: count.toString() });
    spinner.succeed(chalk.green(`${count} package(s) installed ✓`));
  } catch (error) {
    checks.push({ name: 'Installed packages', status: 'fail' });
    spinner.fail(chalk.red('Failed to check installed packages'));
  }

  // Check 4: npx availability
  spinner = ora('Checking npx availability...').start();
  try {
    await execAsync('npx --version');
    checks.push({ name: 'npx', status: 'pass' });
    spinner.succeed(chalk.green('npx is available ✓'));
  } catch (error) {
    checks.push({ name: 'npx', status: 'fail', message: 'npx not found' });
    spinner.fail(chalk.red('npx not found (required for package installation)'));
  }

  // Summary
  console.log('');
  console.log(chalk.cyan('📊 Summary\n'));

  const passed = checks.filter(c => c.status === 'pass').length;
  const failed = checks.filter(c => c.status === 'fail').length;
  const warned = checks.filter(c => c.status === 'warn').length;

  console.log(chalk.green(`✓ Passed: ${passed}`));
  if (warned > 0) console.log(chalk.yellow(`⚠ Warnings: ${warned}`));
  if (failed > 0) console.log(chalk.red(`✗ Failed: ${failed}`));

  console.log('');

  if (failed === 0) {
    console.log(chalk.green('✓ MCP Hub is ready to use!'));
  } else {
    console.log(chalk.red('✗ Please fix the issues above before using MCP Hub.'));
  }

  console.log('');
}
