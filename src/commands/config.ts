import chalk from 'chalk';
import { ConfigManager } from '../utils/config-manager.js';

export async function configCommand(options: {
  show?: boolean;
  path?: boolean;
  backup?: boolean;
}) {
  const configManager = new ConfigManager();

  if (options.path) {
    console.log(chalk.cyan('\n📁 Configuration File Path:\n'));
    console.log(chalk.white(configManager.getConfigPath()));
    console.log('');
    return;
  }

  if (options.backup) {
    console.log(chalk.cyan('\n💾 Creating backup...\n'));
    try {
      const backupPath = await configManager.backup();
      console.log(chalk.green('✓ Backup created successfully'));
      console.log(chalk.gray('Location: ') + chalk.white(backupPath));
      console.log('');
    } catch (error) {
      console.log(chalk.red('✗ Backup failed'));
      console.log(chalk.red((error as Error).message));
      console.log('');
    }
    return;
  }

  // Show config (default)
  console.log(chalk.cyan('\n⚙️  Current Configuration:\n'));

  const config = await configManager.readClaudeConfig();
  const servers = config.mcpServers || {};

  if (Object.keys(servers).length === 0) {
    console.log(chalk.yellow('No MCP servers configured.'));
    console.log('');
    return;
  }

  console.log(chalk.white(JSON.stringify(config, null, 2)));
  console.log('');
  console.log(chalk.gray('Config file: ') + chalk.white(configManager.getConfigPath()));
  console.log(chalk.gray('Total servers: ') + chalk.white(Object.keys(servers).length));
  console.log('');
}
