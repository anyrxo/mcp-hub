import chalk from 'chalk';
import Table from 'cli-table3';
import { MCPRegistry } from '../registry/registry.js';
import { ConfigManager } from '../utils/config-manager.js';

export async function listCommand(options: {
  all?: boolean;
  category?: string;
}) {
  const registry = new MCPRegistry();
  const configManager = new ConfigManager();

  if (options.all) {
    // List all available packages
    console.log(chalk.cyan('\n📦 All Available MCP Servers\n'));

    const packages = registry.listAll({ category: options.category });

    const table = new Table({
      head: [
        chalk.cyan.bold('Name'),
        chalk.cyan.bold('Description'),
        chalk.cyan.bold('Category'),
        chalk.cyan.bold('Stars'),
      ],
      colWidths: [25, 55, 15, 8],
      wordWrap: true,
    });

    for (const pkg of packages) {
      table.push([
        chalk.white.bold(pkg.name),
        chalk.gray(pkg.description.substring(0, 100)),
        chalk.yellow(pkg.category || 'N/A'),
        chalk.green(pkg.stars?.toString() || '0'),
      ]);
    }

    console.log(table.toString());
    console.log(chalk.gray(`\nTotal: ${packages.length} package(s)\n`));
  } else {
    // List installed packages
    console.log(chalk.cyan('\n📦 Installed MCP Servers\n'));

    const installed = await configManager.getInstalledPackages();
    const servers = await configManager.listServers();

    if (Object.keys(installed).length === 0) {
      console.log(chalk.yellow('No MCP servers installed yet.'));
      console.log(chalk.gray('\nGet started:'));
      console.log(chalk.white('  mcp search <query>') + chalk.gray('  - Search for packages'));
      console.log(chalk.white('  mcp list --all') + chalk.gray('      - See all available packages'));
      console.log(chalk.white('  mcp install <name>') + chalk.gray('  - Install a package\n'));
      return;
    }

    const table = new Table({
      head: [
        chalk.cyan.bold('Name'),
        chalk.cyan.bold('Version'),
        chalk.cyan.bold('Status'),
        chalk.cyan.bold('Installed'),
      ],
      colWidths: [25, 12, 10, 25],
    });

    for (const [name, pkg] of Object.entries(installed)) {
      const serverConfig = servers[name];
      const enabled = serverConfig && !serverConfig.disabled;

      table.push([
        chalk.white.bold(name),
        chalk.gray(pkg.version),
        enabled ? chalk.green('✓ Active') : chalk.yellow('○ Disabled'),
        chalk.gray(new Date(pkg.installedAt).toLocaleDateString()),
      ]);
    }

    console.log(table.toString());
    console.log(chalk.gray(`\nTotal: ${Object.keys(installed).length} package(s) installed\n`));
  }
}
