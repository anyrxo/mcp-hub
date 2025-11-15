# Advanced Usage

This guide covers advanced features and workflows with MCP Hub.

## Advanced Search

### Search with Filters

```bash
# Search verified packages only
mcp search api --verified

# Search by category
mcp search database --category data

# Combine filters
mcp search web --category web --verified

# Limit results
mcp search server --limit 10
```

### Finding Packages by Use Case

**For API Development:**
```bash
mcp search "api" --category development
```

**For Data Analysis:**
```bash
mcp search "database" --category data
mcp search "sql"
```

**For Web Automation:**
```bash
mcp search "browser" --category web
mcp search "puppeteer"
```

**For Communication:**
```bash
mcp search "slack" --category communication
mcp search "discord"
```

## Managing Multiple Packages

### Bulk Installation

While MCP Hub doesn't have a bulk install command yet, you can chain installations:

```bash
mcp install github && \
mcp install filesystem && \
mcp install puppeteer
```

### Creating Installation Scripts

Save your favorite packages to a script:

```bash
#!/bin/bash
# install-dev-tools.sh

echo "Installing development MCP servers..."

mcp install github
mcp install gitlab
mcp install filesystem
mcp install git

echo "Installation complete! Restart Claude Code."
```

Make it executable:
```bash
chmod +x install-dev-tools.sh
./install-dev-tools.sh
```

## Custom Configuration

### Viewing Raw Configuration

```bash
# View JSON configuration
mcp config --json

# Get config file path
mcp config --path
```

### Manual Configuration

While MCP Hub handles configuration automatically, you can manually edit the Claude Code config:

**Location:**
- macOS/Linux: `~/.config/claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

**Example advanced configuration:**

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}",
        "GITHUB_API_URL": "https://api.github.com"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://user:pass@localhost:5432/db"
      }
    },
    "custom-server": {
      "command": "node",
      "args": ["/path/to/custom/server.js"],
      "env": {
        "CUSTOM_VAR": "value"
      }
    }
  }
}
```

## Environment Variables Best Practices

### Using .env Files

Create a `.env` file for your MCP server environment variables:

```bash
# .mcp.env
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
SLACK_TOKEN=xoxb-xxxxxxxxxxxx
POSTGRES_URL=postgresql://localhost/mydb
BRAVE_API_KEY=xxxxxxxxxxxxx
```

### Loading Environment Variables

Add to your shell profile (`~/.bashrc`, `~/.zshrc`):

```bash
# Load MCP environment variables
if [ -f ~/.mcp.env ]; then
  export $(cat ~/.mcp.env | xargs)
fi
```

### Secure Token Management

**Option 1: Use OS Keychain**

```bash
# Store token in macOS keychain
security add-generic-password -a ${USER} -s github_mcp_token -w

# Retrieve in Claude Code config
# Use a wrapper script that reads from keychain
```

**Option 2: Use Environment Variables Manager**

```bash
# Install direnv
brew install direnv

# Create .envrc in project
echo 'export GITHUB_TOKEN=ghp_xxx' > .envrc
direnv allow
```

## Package Management Workflows

### Auditing Installed Packages

```bash
# List installed packages
mcp list

# Get details about each
mcp info github
mcp info filesystem
```

### Upgrading Packages

While MCP Hub doesn't have auto-update yet, you can manually upgrade:

```bash
# Uninstall old version
mcp uninstall github

# Install latest version
mcp install github
```

### Rolling Back Changes

MCP Hub creates backups before modifying config:

```bash
# Backups are stored at:
# ~/.mcp-hub/backups/claude_desktop_config.json.<timestamp>

# To restore, copy a backup:
cp ~/.mcp-hub/backups/claude_desktop_config.json.1234567890 \
   ~/.config/claude/claude_desktop_config.json
```

## Troubleshooting Advanced Issues

### Debugging Package Installation

```bash
# Run with verbose output
DEBUG=* mcp install package-name

# Check npm/npx directly
npx -y @modelcontextprotocol/server-github --help
```

### Fixing Configuration Issues

```bash
# Validate JSON syntax
mcp config --json | jq .

# Reset configuration (careful!)
# Backup first
cp ~/.config/claude/claude_desktop_config.json \
   ~/.config/claude/claude_desktop_config.json.backup

# Then manually edit or remove servers
```

### Permission Issues

```bash
# If npm global install fails, use npx:
npx mcp-hub install github

# Or fix npm permissions:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

## Integration with CI/CD

### Automating MCP Setup

```yaml
# .github/workflows/setup-mcp.yml
name: Setup MCP Servers

on:
  push:
    branches: [main]

jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - name: Install MCP Hub
        run: npm install -g mcp-hub

      - name: Install MCP Servers
        run: |
          mcp install github
          mcp install filesystem
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Verify Installation
        run: mcp list
```

### Docker Integration

```dockerfile
FROM node:18

# Install MCP Hub
RUN npm install -g mcp-hub

# Install MCP servers
RUN mcp install github && \
    mcp install filesystem

# Configure environment
ENV GITHUB_TOKEN=${GITHUB_TOKEN}

CMD ["claude-code"]
```

## Custom Registry Development

Want to host your own MCP registry? Here's the structure:

```json
{
  "packages": [
    {
      "name": "my-custom-mcp",
      "description": "Custom MCP server",
      "version": "1.0.0",
      "category": "Custom",
      "installType": "npm",
      "installCommand": "@company/mcp-server",
      "repository": "https://github.com/company/mcp-server",
      "verified": true,
      "stars": 0,
      "tags": ["custom", "internal"]
    }
  ]
}
```

Point MCP Hub to your registry:

```bash
# Future feature
mcp registry add https://mcp.company.com/registry.json
```

## Performance Optimization

### Reducing Claude Code Startup Time

If you have many MCP servers installed, consider:

1. **Use only needed servers**: Uninstall unused servers
2. **Lazy loading**: Configure servers to start only when needed
3. **Local caching**: Keep frequently used servers cached

### Monitoring MCP Server Health

```bash
# Check which servers are running
ps aux | grep mcp

# Monitor resource usage
top -p $(pgrep -f mcp)
```

## Security Best Practices

### Reviewing Package Security

```bash
# Check package details
mcp info <package-name>

# Review repository
# Click the repository link and inspect code

# Check npm package
npm info <package-name>
```

### Sandboxing MCP Servers

Configure servers with minimal permissions:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/safe/directory"],
      "env": {
        "READ_ONLY": "true"
      }
    }
  }
}
```

### Audit Logging

Enable logging for MCP servers:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "MCP_LOG_LEVEL": "debug",
        "MCP_LOG_FILE": "/var/log/mcp/github.log"
      }
    }
  }
}
```

## Advanced Scripting

### Programmatic Package Management

```javascript
#!/usr/bin/env node

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function setupDevEnvironment() {
  const packages = [
    'github',
    'gitlab',
    'filesystem',
    'git'
  ];

  for (const pkg of packages) {
    console.log(`Installing ${pkg}...`);
    try {
      await execAsync(`mcp install ${pkg}`);
      console.log(`✓ ${pkg} installed`);
    } catch (error) {
      console.error(`✗ Failed to install ${pkg}:`, error.message);
    }
  }

  console.log('Development environment setup complete!');
}

setupDevEnvironment();
```

### Custom Health Checks

```bash
#!/bin/bash
# mcp-health-check.sh

echo "Running MCP health checks..."

# Check MCP Hub
if ! command -v mcp &> /dev/null; then
  echo "✗ MCP Hub not installed"
  exit 1
fi
echo "✓ MCP Hub installed"

# Check Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "✗ Node.js version too old: $NODE_VERSION"
  exit 1
fi
echo "✓ Node.js version OK"

# Check installed packages
INSTALLED=$(mcp list | grep -c "│")
echo "✓ $INSTALLED package(s) installed"

# Run official doctor
mcp doctor

echo "Health check complete!"
```

## Learn More

- [MCP Protocol Specification](https://modelcontextprotocol.io/spec)
- [Building Custom MCP Servers](https://modelcontextprotocol.io/docs/building)
- [Claude Code API](https://claude.ai/docs/api)
