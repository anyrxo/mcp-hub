import chalk from 'chalk';
import ora from 'ora';
import { ConfigManager } from '../utils/config-manager.js';

export async function uninstallCommand(packageName: string) {
  const configManager = new ConfigManager();

  console.log(chalk.cyan(`\n🗑️  Uninstalling: ${chalk.white.bold(packageName)}\n`));

  const installed = await configManager.getInstalledPackages();

  if (!installed[packageName]) {
    console.log(chalk.red(`✗ Package "${packageName}" is not installed.`));
    console.log('');
    return;
  }

  const spinner = ora('Removing package...').start();

  try {
    // Remove from Claude config
    await configManager.removeServer(packageName);

    // Mark as uninstalled
    await configManager.markUninstalled(packageName);

    spinner.succeed(chalk.green(`✓ Successfully uninstalled ${chalk.white.bold(packageName)}`));
    console.log('');
    console.log(chalk.yellow('⚠️  Restart Claude Code for changes to take effect.'));
    console.log('');
  } catch (error) {
    spinner.fail(chalk.red('Uninstallation failed'));
    console.log(chalk.red((error as Error).message));
    console.log('');
  }
}
