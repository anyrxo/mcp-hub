#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import boxen from 'boxen';
import { searchCommand } from './commands/search.js';
import { installCommand } from './commands/install.js';
import { listCommand } from './commands/list.js';
import { configCommand } from './commands/config.js';
import { updateCommand } from './commands/update.js';

const program = new Command();

// ASCII Art Banner
const banner = `
███╗   ███╗ ██████╗██████╗     ██╗  ██╗██╗   ██╗██████╗
████╗ ████║██╔════╝██╔══██╗    ██║  ██║██║   ██║██╔══██╗
██╔████╔██║██║     ██████╔╝    ███████║██║   ██║██████╔╝
██║╚██╔╝██║██║     ██╔═══╝     ██╔══██║██║   ██║██╔══██╗
██║ ╚═╝ ██║╚██████╗██║         ██║  ██║╚██████╔╝██████╔╝
╚═╝     ╚═╝ ╚═════╝╚═╝         ╚═╝  ╚═╝ ╚═════╝ ╚═════╝
`;

console.log(chalk.cyan(banner));
console.log(
  boxen(
    chalk.white.bold('The npm for MCPs') +
      '\n' +
      chalk.gray('Discover, install, and manage Model Context Protocol servers'),
    {
      padding: 1,
      margin: { top: 0, bottom: 1, left: 2, right: 2 },
      borderStyle: 'round',
      borderColor: 'cyan',
    }
  )
);

program
  .name('mcp')
  .description('MCP Hub - The package manager for Model Context Protocol servers')
  .version('0.1.0');

// Search command
program
  .command('search <query>')
  .description('Search for MCP servers')
  .option('-c, --category <category>', 'Filter by category')
  .option('-v, --verified', 'Show only verified packages')
  .option('-l, --limit <number>', 'Limit results', '20')
  .action(searchCommand);

// Install command
program
  .command('install <package>')
  .alias('i')
  .description('Install an MCP server')
  .option('-g, --global', 'Install globally (default)')
  .option('-y, --yes', 'Skip confirmations')
  .action(installCommand);

// List command
program
  .command('list')
  .alias('ls')
  .description('List installed MCP servers')
  .option('-a, --all', 'Show all available packages')
  .option('-c, --category <category>', 'Filter by category')
  .action(listCommand);

// Config command
program
  .command('config')
  .description('Manage MCP configuration')
  .option('-s, --show', 'Show current configuration')
  .option('-p, --path', 'Show config file path')
  .option('-b, --backup', 'Backup configuration')
  .action(configCommand);

// Update command
program
  .command('update [package]')
  .description('Update MCP server(s)')
  .option('-a, --all', 'Update all installed packages')
  .action(updateCommand);

// Uninstall command
program
  .command('uninstall <package>')
  .alias('remove')
  .description('Uninstall an MCP server')
  .action(async (packageName: string) => {
    const { uninstallCommand } = await import('./commands/uninstall.js');
    await uninstallCommand(packageName);
  });

// Info command
program
  .command('info <package>')
  .description('Show package information')
  .action(async (packageName: string) => {
    const { infoCommand } = await import('./commands/info.js');
    await infoCommand(packageName);
  });

// Categories command
program
  .command('categories')
  .description('List all package categories')
  .action(async () => {
    const { categoriesCommand } = await import('./commands/categories.js');
    await categoriesCommand();
  });

// Doctor command (verify setup)
program
  .command('doctor')
  .description('Verify MCP Hub setup and diagnose issues')
  .action(async () => {
    const { doctorCommand } = await import('./commands/doctor.js');
    await doctorCommand();
  });

// Parse arguments
program.parse();
