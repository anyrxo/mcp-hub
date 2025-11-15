import chalk from 'chalk';
import { MCPRegistry } from '../registry/registry.js';

export async function categoriesCommand() {
  console.log(chalk.cyan('\n📂 Available Categories\n'));

  const registry = new MCPRegistry();
  const categories = registry.getCategories();

  for (const category of categories) {
    const packages = registry.listAll({ category });
    console.log(
      chalk.yellow(`${category.padEnd(20)} `) +
        chalk.gray(`(${packages.length} package${packages.length === 1 ? '' : 's'})`)
    );
  }

  console.log('');
  console.log(chalk.gray(`Use ${chalk.white('mcp search <query> --category <name>')} to filter by category.`));
  console.log('');
}
