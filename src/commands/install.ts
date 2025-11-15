import chalk from 'chalk';
import ora from 'ora';
import { MCPRegistry } from '../registry/registry.js';
import { ConfigManager } from '../utils/config-manager.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function installCommand(
  packageName: string,
  options: {
    global?: boolean;
    yes?: boolean;
  }
) {
  const registry = new MCPRegistry();
  const configManager = new ConfigManager();

  console.log(chalk.cyan(`\n📥 Installing: ${chalk.white.bold(packageName)}\n`));

  // Find package
  const pkg = registry.getPackage(packageName);
  if (!pkg) {
    console.log(chalk.red(`✗ Package "${packageName}" not found in registry.`));
    console.log(chalk.gray('\nTry:'));
    console.log(chalk.white(`  mcp search ${packageName}`) + chalk.gray('  - Search for similar packages'));
    console.log(chalk.white(`  mcp list --all`) + chalk.gray('             - See all available packages\n'));
    return;
  }

  // Show package info
  console.log(chalk.gray('Package:     ') + chalk.white(pkg.name));
  console.log(chalk.gray('Description: ') + chalk.white(pkg.description));
  console.log(chalk.gray('Version:     ') + chalk.white(pkg.version));
  console.log(chalk.gray('Category:    ') + chalk.yellow(pkg.category || 'N/A'));
  console.log(chalk.gray('Verified:    ') + (pkg.verified ? chalk.green('✓ Yes') : chalk.yellow('○ No')));
  console.log('');

  // Confirm installation
  if (!options.yes) {
    console.log(chalk.yellow('Press Ctrl+C to cancel, or Enter to continue...'));
    await new Promise(resolve => {
      process.stdin.once('data', resolve);
    });
  }

  // Install based on type
  const spinner = ora('Installing package...').start();

  try {
    if (pkg.installType === 'npm') {
      // For npx packages, we just need to add the config
      spinner.text = 'Adding to Claude Code configuration...';

      // Determine command
      const command = pkg.runCommand || pkg.installCommand || `npx -y ${packageName}`;

      // Add to Claude config
      await configManager.addServer(pkg.name, {
        command: command.split(' ')[0],
        args: command.split(' ').slice(1),
      });

      // Mark as installed
      await configManager.markInstalled({
        name: pkg.name,
        version: pkg.version,
        installedAt: new Date().toISOString(),
        enabled: true,
        config: {
          command: command.split(' ')[0],
          args: command.split(' ').slice(1),
        },
      });

      spinner.succeed(chalk.green(`✓ Successfully installed ${chalk.white.bold(pkg.name)}`));

      console.log('');
      console.log(chalk.cyan('📝 Configuration updated:'));
      console.log(chalk.gray('   Config file: ') + chalk.white(configManager.getConfigPath()));
      console.log(chalk.gray('   Server name: ') + chalk.white(pkg.name));
      console.log(chalk.gray('   Command:     ') + chalk.white(command));
      console.log('');
      console.log(chalk.yellow('⚠️  Restart Claude Code for changes to take effect.'));
      console.log('');
    } else {
      spinner.fail(chalk.red(`Installation type "${pkg.installType}" not yet supported.`));
      console.log(chalk.gray('\nCurrently supported: npm (npx)\n'));
    }
  } catch (error) {
    spinner.fail(chalk.red('Installation failed'));
    console.log(chalk.red((error as Error).message));
    console.log('');
  }
}
