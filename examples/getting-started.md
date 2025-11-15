# Getting Started with MCP Hub

This guide will walk you through your first steps with MCP Hub.

## Installation

First, install MCP Hub globally:

```bash
npm install -g mcp-hub
```

Or use it without installation via npx:

```bash
npx mcp-hub
```

## Your First Package

Let's install the GitHub MCP server to demonstrate the workflow.

### Step 1: Search for Packages

```bash
mcp search github
```

This will show you all packages related to GitHub:

```
┌──────────┬─────────────────────────────────────┬─────────────┬───────┬──────────┐
│ Name     │ Description                         │ Category    │ Stars │ Verified │
├──────────┼─────────────────────────────────────┼─────────────┼───────┼──────────┤
│ github   │ GitHub MCP server - manage issues...│ Development │ 1234  │ ✓        │
└──────────┴─────────────────────────────────────┴─────────────┴───────┴──────────┘
```

### Step 2: Get Package Information

Before installing, view detailed package information:

```bash
mcp info github
```

This shows:
- Full package description
- Version and author
- Installation requirements
- Repository link
- Stars and verification status

### Step 3: Install the Package

```bash
mcp install github
```

MCP Hub will:
1. Download the package via npm/npx
2. Configure Claude Code automatically
3. Save installation metadata
4. Show you next steps

Example output:
```
📥 Installing: github

Package:     github
Description: GitHub MCP server - manage issues, PRs, repos
Version:     1.0.0
Category:    Development
Verified:    ✓ Yes

Press Ctrl+C to cancel, or Enter to continue...

✓ Package installed successfully
✓ Added to Claude Code configuration
⚠️  Restart Claude Code for changes to take effect
```

### Step 4: Configure Environment Variables

Some packages require environment variables. For GitHub:

```bash
export GITHUB_TOKEN="your_github_token_here"
```

Or add to your Claude Code config at `~/.config/claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "your_github_token_here"
      }
    }
  }
}
```

### Step 5: Restart Claude Code

Restart Claude Code to load the new MCP server.

### Step 6: Verify Installation

```bash
mcp list
```

You should see your installed packages:

```
Installed MCP Servers:
┌──────────┬─────────────────────────────────────┬──────────┐
│ Name     │ Description                         │ Version  │
├──────────┼─────────────────────────────────────┼──────────┤
│ github   │ GitHub MCP server - manage issues...│ 1.0.0    │
└──────────┴─────────────────────────────────────┴──────────┘
```

## Running Diagnostics

If something isn't working, run the doctor command:

```bash
mcp doctor
```

This checks:
- Node.js version
- Claude Code config file
- Installed packages
- npx availability

Example output:
```
🩺 Running MCP Hub Diagnostics...

✔ Node.js version v18.17.0 ✓
✔ Claude config file exists ✓
✔ 1 package(s) installed ✓
✔ npx is available ✓

📊 Summary

✓ Passed: 4

✓ MCP Hub is ready to use!
```

## Next Steps

- Explore more packages: `mcp list --all`
- View categories: `mcp categories`
- Search by category: `mcp search database --category data`
- Get help: `mcp --help`

## Troubleshooting

### Package not showing in Claude Code

1. Verify installation: `mcp list`
2. Check config: `mcp config`
3. Restart Claude Code completely
4. Run diagnostics: `mcp doctor`

### Permission errors

Some packages require specific permissions. Check the package documentation:

```bash
mcp info <package-name>
```

### Environment variables not working

Make sure environment variables are set in your Claude Code config, not just your shell.

## Common Workflows

### Development Setup

```bash
# Install common development tools
mcp install github
mcp install filesystem
mcp install git

# Verify
mcp list
```

### Data Analysis Setup

```bash
# Install database and search tools
mcp install postgres
mcp install brave-search

# Verify
mcp list
```

### Web Automation Setup

```bash
# Install web tools
mcp install puppeteer
mcp install playwright

# Verify
mcp list
```

## Learn More

- [MCP Protocol Documentation](https://modelcontextprotocol.io)
- [Claude Code Documentation](https://claude.ai/docs)
- [MCP Hub GitHub](https://github.com/yourusername/mcp-hub)
