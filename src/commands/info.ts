import chalk from 'chalk';
import boxen from 'boxen';
import { MCPRegistry } from '../registry/registry.js';

export async function infoCommand(packageName: string) {
  const registry = new MCPRegistry();
  const pkg = registry.getPackage(packageName);

  if (!pkg) {
    console.log(chalk.red(`\n✗ Package "${packageName}" not found.\n`));
    return;
  }

  console.log('');
  console.log(
    boxen(
      chalk.white.bold(pkg.name) +
        '\n' +
        chalk.gray(pkg.version) +
        '\n\n' +
        chalk.white(pkg.description),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'cyan',
      }
    )
  );

  console.log(chalk.cyan('📦 Package Information\n'));
  console.log(chalk.gray('Name:        ') + chalk.white(pkg.name));
  console.log(chalk.gray('Version:     ') + chalk.white(pkg.version));
  console.log(chalk.gray('Category:    ') + chalk.yellow(pkg.category || 'N/A'));
  console.log(chalk.gray('Author:      ') + chalk.white(pkg.author || 'N/A'));
  console.log(chalk.gray('License:     ') + chalk.white(pkg.license || 'N/A'));
  console.log(chalk.gray('Stars:       ') + chalk.green(pkg.stars?.toString() || '0'));
  console.log(chalk.gray('Verified:    ') + (pkg.verified ? chalk.green('✓ Yes') : chalk.yellow('○ No')));

  if (pkg.tags && pkg.tags.length > 0) {
    console.log(chalk.gray('Tags:        ') + pkg.tags.map(t => chalk.blue(t)).join(', '));
  }

  console.log('');
  console.log(chalk.cyan('🔧 Installation\n'));
  console.log(chalk.gray('Type:        ') + chalk.white(pkg.installType));
  console.log(chalk.gray('Command:     ') + chalk.white(pkg.installCommand || 'N/A'));

  if (pkg.repository) {
    console.log('');
    console.log(chalk.cyan('🔗 Links\n'));
    console.log(chalk.gray('Repository:  ') + chalk.blue(pkg.repository));
    if (pkg.homepage) {
      console.log(chalk.gray('Homepage:    ') + chalk.blue(pkg.homepage));
    }
  }

  console.log('');
  console.log(chalk.gray(`Install with: ${chalk.white(`mcp install ${pkg.name}`)}`));
  console.log('');
}
