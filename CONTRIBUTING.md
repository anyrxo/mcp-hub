# Contributing to MCP Hub

Thank you for your interest in contributing to MCP Hub! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:

1. **Clear title** describing the problem
2. **Steps to reproduce** the issue
3. **Expected behavior** vs actual behavior
4. **Environment details** (OS, Node.js version, MCP Hub version)
5. **Error messages** or screenshots if applicable

**Example:**
```
Title: "mcp install fails with npm error on Windows"

Steps to reproduce:
1. Run `mcp install github` on Windows 11
2. See error message

Expected: Package installs successfully
Actual: npm error EACCES permission denied

Environment:
- OS: Windows 11
- Node.js: v18.17.0
- MCP Hub: v1.0.0

Error:
npm error code EACCES
npm error syscall mkdir
...
```

### Suggesting Features

We welcome feature suggestions! Please create an issue with:

1. **Clear description** of the feature
2. **Use case** explaining why it's needed
3. **Proposed implementation** (optional)
4. **Alternatives considered** (optional)

**Example:**
```
Title: "Add command to update all installed packages"

Description:
Add a new command `mcp update --all` that updates all installed MCP servers to their latest versions.

Use case:
Users want to keep their MCP servers up to date without manually updating each one.

Proposed implementation:
- Iterate through installed packages
- Check npm registry for latest versions
- Update packages that have newer versions available
- Display update summary

Alternatives:
- `mcp update <package>` for single package updates (already in roadmap)
- Automatic update notifications
```

### Adding Packages to Registry

Want to add a new package to the MCP Hub registry?

1. **Fork the repository**
2. **Edit** `src/registry/packages.ts`
3. **Add your package** with complete metadata:

```typescript
{
  name: 'your-package-name',
  description: 'Clear, concise description (max 80 chars)',
  version: '1.0.0',
  category: 'Development', // See available categories
  installType: 'npm', // or 'npx', 'git', 'local'
  installCommand: '@your/mcp-server', // npm package name
  repository: 'https://github.com/your/repo',
  homepage: 'https://your-docs.com', // optional
  author: 'Your Name', // optional
  license: 'MIT', // optional
  stars: 0, // GitHub stars (we'll update)
  verified: false, // we'll verify
  tags: ['tag1', 'tag2'] // optional, relevant tags
}
```

4. **Test your addition:**
   ```bash
   npm run build
   node dist/cli.js search your-package-name
   node dist/cli.js info your-package-name
   ```

5. **Submit a pull request** with:
   - Clear title: "Add [package-name] to registry"
   - Description of what the package does
   - Link to package repository
   - Confirmation that you've tested it

### Code Contributions

#### Setting Up Development Environment

```bash
# Fork and clone the repository
git clone https://github.com/YOUR-USERNAME/mcp-hub.git
cd mcp-hub

# Install dependencies
npm install

# Build TypeScript
npm run build

# Run locally
node dist/cli.js --help

# Run tests
npm test

# Run linter
npm run lint
```

#### Development Workflow

1. **Create a branch** for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Test your changes:**
   ```bash
   npm run build
   npm test
   node dist/cli.js <your-command>
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

   Use [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting)
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

5. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

## Coding Standards

### TypeScript Style

- Use **TypeScript strict mode**
- Prefer **interfaces** over types for objects
- Use **async/await** instead of callbacks
- Add **JSDoc comments** for public APIs
- Use **descriptive variable names**

**Example:**
```typescript
/**
 * Searches for MCP packages in the registry
 * @param query - Search query string
 * @param options - Search options including filters
 * @returns Array of matching packages
 */
export function searchPackages(
  query: string,
  options?: SearchOptions
): Package[] {
  // Implementation
}
```

### File Organization

```
src/
├── cli.ts              # Main CLI entry point
├── commands/           # Command implementations
│   ├── search.ts
│   ├── install.ts
│   └── ...
├── registry/           # Package registry
│   ├── registry.ts
│   └── packages.ts
└── utils/              # Utility functions
    ├── config-manager.ts
    └── ...
```

### Error Handling

Always handle errors gracefully:

```typescript
try {
  await riskyOperation();
} catch (error) {
  console.log(chalk.red(`Error: ${(error as Error).message}`));
  process.exit(1);
}
```

### Testing

Add tests for new features:

```typescript
import { describe, it, expect } from '@jest/globals';
import { searchPackages } from '../src/registry/registry';

describe('searchPackages', () => {
  it('should find packages by name', () => {
    const results = searchPackages('github');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name).toBe('github');
  });
});
```

### Documentation

- Update **README.md** for new features
- Add **examples/** for complex features
- Update **docs/index.html** if needed
- Add **JSDoc comments** for public APIs

## Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Ensure all tests pass**: `npm test`
4. **Ensure build succeeds**: `npm run build`
5. **Update CHANGELOG.md** with your changes
6. **Request review** from maintainers

### PR Title Format

Use conventional commits format:

```
feat: add search filtering by verified status
fix: resolve config path issue on Windows
docs: update installation instructions
```

### PR Description Template

```markdown
## Description
Clear description of what this PR does.

## Motivation
Why is this change needed?

## Changes
- Bullet point list of changes
- Be specific

## Testing
How was this tested?
- [ ] Unit tests added
- [ ] Manual testing performed
- [ ] Documentation updated

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
```

## Review Process

### What We Look For

- **Functionality**: Does it work as intended?
- **Code Quality**: Is it clean, readable, maintainable?
- **Tests**: Are there adequate tests?
- **Documentation**: Is it well documented?
- **Performance**: Does it impact performance?
- **Security**: Are there security implications?

### Timeline

- Initial review: Within 3 days
- Follow-up reviews: Within 2 days
- Merge: After approval from 2 maintainers

## Development Tips

### Debugging

Use DEBUG environment variable:

```bash
DEBUG=* node dist/cli.js install github
```

### Testing Specific Commands

```bash
# Test search
node dist/cli.js search github

# Test install (without actually installing)
node dist/cli.js install --dry-run github

# Test with different config paths
MCP_CONFIG_PATH=/tmp/test-config node dist/cli.js config
```

### Working with Registry

Edit `src/registry/packages.ts` to modify packages:

```typescript
export const BUILTIN_PACKAGES: Package[] = [
  {
    name: 'test-package',
    description: 'Test package for development',
    // ... other fields
  }
];
```

Then rebuild and test:

```bash
npm run build
node dist/cli.js search test
```

## Community

### Getting Help

- **GitHub Discussions**: Ask questions, share ideas
- **GitHub Issues**: Report bugs, request features
- **Discord**: Real-time chat with the community (coming soon)

### Recognition

Contributors are recognized in:
- **README.md** Contributors section
- **GitHub Contributors** page
- **CHANGELOG.md** for significant contributions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Don't hesitate to ask questions:
- Open a [GitHub Discussion](https://github.com/yourusername/mcp-hub/discussions)
- Comment on relevant issues
- Reach out to maintainers

Thank you for contributing to MCP Hub! 🚀
