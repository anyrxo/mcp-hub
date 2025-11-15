import chalk from 'chalk';
import Table from 'cli-table3';
import { MCPRegistry } from '../registry/registry.js';

export async function searchCommand(
  query: string,
  options: {
    category?: string;
    verified?: boolean;
    limit?: string;
  }
) {
  console.log(chalk.cyan(`\n🔍 Searching for: "${query}"\n`));

  const registry = new MCPRegistry();
  const results = registry.search(query, {
    category: options.category,
    verified: options.verified,
    limit: parseInt(options.limit || '20'),
  });

  if (results.packages.length === 0) {
    console.log(chalk.yellow('No packages found matching your query.'));
    console.log(chalk.gray('\nTry:'));
    console.log(chalk.gray('  - Different search terms'));
    console.log(chalk.gray('  - Removing filters'));
    console.log(chalk.gray('  - Using `mcp list --all` to see all packages'));
    return;
  }

  const table = new Table({
    head: [
      chalk.cyan.bold('Name'),
      chalk.cyan.bold('Description'),
      chalk.cyan.bold('Category'),
      chalk.cyan.bold('Stars'),
      chalk.cyan.bold('Verified'),
    ],
    colWidths: [20, 50, 15, 8, 10],
    wordWrap: true,
  });

  for (const pkg of results.packages) {
    table.push([
      chalk.white.bold(pkg.name),
      chalk.gray(pkg.description.substring(0, 100)),
      chalk.yellow(pkg.category || 'N/A'),
      chalk.green(pkg.stars?.toString() || '0'),
      pkg.verified ? chalk.green('✓') : chalk.gray('-'),
    ]);
  }

  console.log(table.toString());
  console.log(
    chalk.gray(`\nFound ${results.total} package(s). Use ${chalk.white('mcp info <name>')} for details.`)
  );
  console.log(
    chalk.gray(`Install with: ${chalk.white('mcp install <name>')}\n`)
  );
}
