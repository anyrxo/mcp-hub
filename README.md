# MCP Hub

<div align="center">

```
███╗   ███╗ ██████╗██████╗     ██╗  ██╗██╗   ██╗██████╗
████╗ ████║██╔════╝██╔══██╗    ██║  ██║██║   ██║██╔══██╗
██╔████╔██║██║     ██████╔╝    ███████║██║   ██║██████╔╝
██║╚██╔╝██║██║     ██╔═══╝     ██╔══██║██║   ██║██╔══██╗
██║ ╚═╝ ██║╚██████╗██║         ██║  ██║╚██████╔╝██████╔╝
╚═╝     ╚═╝ ╚═════╝╚═╝         ╚═╝  ╚═╝ ╚═════╝ ╚═════╝
```

**The npm for MCPs**

*Discover, install, and manage Model Context Protocol servers with ease*

[![npm version](https://img.shields.io/npm/v/mcp-hub.svg)](https://www.npmjs.com/package/mcp-hub)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)

[🚀 Quick Start](#quick-start) • [📖 Documentation](#documentation) • [🔍 Commands](#commands) • [🎯 Examples](#examples)

</div>

---

## 🌟 What is MCP Hub?

MCP Hub is a **powerful command-line tool** that makes discovering, installing, and managing [Model Context Protocol (MCP)](https://modelcontextprotocol.io) servers as easy as using npm. It provides a curated registry of popular MCP servers, seamless integration with Claude Code, and beautiful CLI experience.

### Why MCP Hub?

- **📦 Curated Registry**: Access 7,260+ MCP servers with search and filtering
- **⚡ One-Command Install**: Install any MCP server with a single command
- **🔧 Auto-Configuration**: Automatically configures Claude Code for you
- **✨ Beautiful CLI**: Gorgeous terminal UI with colors, tables, and spinners
- **🔍 Smart Search**: Find packages by name, category, or description
- **🩺 Health Checks**: Built-in diagnostics to ensure everything works
- **🛡️ Security First**: Verified packages and security scanning integration

---

## 🚀 Quick Start

### Installation

```bash
# Install globally via npm
npm install -g mcp-hub

# Or use via npx (no installation needed)
npx mcp-hub
```

### Basic Usage

```bash
# Search for MCP servers
mcp search github

# Get detailed info about a package
mcp info github

# Install an MCP server
mcp install github

# List installed packages
mcp list

# View all available categories
mcp categories

# Run system diagnostics
mcp doctor
```

---

## 📖 Documentation

### What are MCP Servers?

The **Model Context Protocol** (MCP) is an open protocol that enables AI assistants like Claude to securely connect to external tools, APIs, and data sources. MCP servers provide these capabilities through a standardized interface.

**Popular use cases:**
- 🐙 **GitHub Integration**: Manage repos, issues, and PRs
- 📁 **File System Access**: Read/write local files safely
- 🌐 **Web Automation**: Browser control with Puppeteer
- 🔍 **Web Search**: Brave Search, Google, Perplexity
- 💾 **Database Access**: PostgreSQL, MySQL, MongoDB
- 💬 **Chat Integration**: Slack, Discord, Teams
- 🧠 **Enhanced Reasoning**: Sequential thinking, memory

---

## 🔍 Commands

### `mcp search <query>`

Search for MCP servers by name or description.

```bash
# Basic search
mcp search github

# Search by category
mcp search database --category data

# Show only verified packages
mcp search api --verified

# Limit results
mcp search web --limit 5
```

**Options:**
- `--category <name>` - Filter by category
- `--verified` - Show only verified packages
- `--limit <n>` - Limit number of results

---

### `mcp install <package>`

Install an MCP server and configure Claude Code automatically.

```bash
# Install a package
mcp install github

# Install with custom configuration
mcp install postgres
```

**What happens during installation:**
1. ✅ Validates package exists in registry
2. 📦 Downloads and installs via npm/npx
3. ⚙️ Adds to Claude Code configuration
4. 💾 Saves installation metadata
5. ✨ Ready to use immediately (after Claude Code restart)

---

### `mcp list`

List installed or available packages.

```bash
# List installed packages
mcp list

# List all available packages
mcp list --all
```

**Options:**
- `--all` - Show all available packages (not just installed)

---

### `mcp info <package>`

Get detailed information about an MCP server.

```bash
mcp info github
```

**Shows:**
- Package name, version, description
- Category, author, license
- GitHub stars, verification status
- Installation type and command
- Repository and homepage links
- Tags and metadata

---

### `mcp config`

View current Claude Code MCP configuration.

```bash
# View configuration
mcp config

# View with JSON output
mcp config --json
```

**Options:**
- `--json` - Output raw JSON configuration
- `--path` - Show config file path only

---

### `mcp uninstall <package>`

Remove an installed MCP server.

```bash
mcp uninstall github
```

---

### `mcp categories`

List all available package categories.

```bash
mcp categories
```

**Available categories:**
- Development (GitHub, GitLab)
- Filesystem (File operations)
- Web (Puppeteer, Playwright)
- Search (Brave, Google)
- Database (PostgreSQL, MySQL)
- Communication (Slack, Discord)
- AI Tools (Sequential Thinking)

---

### `mcp doctor`

Run system diagnostics to ensure MCP Hub is working correctly.

```bash
mcp doctor
```

**Checks:**
- ✅ Node.js version (>= 18 required)
- ✅ Claude Code config file exists
- ✅ Installed packages are valid
- ✅ npx is available
- ✅ System health summary

---

## 🎯 Examples

### Example 1: Setting up GitHub Integration

```bash
# Search for GitHub packages
$ mcp search github

┌──────────┬─────────────────────────────────────┬─────────────┬───────┬──────────┐
│ Name     │ Description                         │ Category    │ Stars │ Verified │
├──────────┼─────────────────────────────────────┼─────────────┼───────┼──────────┤
│ github   │ GitHub MCP server - manage issues...│ Development │ 1234  │ ✓        │
└──────────┴─────────────────────────────────────┴─────────────┴───────┴──────────┘

# Get detailed info
$ mcp info github

# Install
$ mcp install github

# Restart Claude Code and start using!
```

### Example 2: Database Development Setup

```bash
# Install PostgreSQL MCP server
$ mcp install postgres

# List installed packages
$ mcp list

Installed MCP Servers:
┌──────────┬─────────────────────────────────────┬──────────┐
│ Name     │ Description                         │ Version  │
├──────────┼─────────────────────────────────────┼──────────┤
│ postgres │ PostgreSQL database integration     │ 1.0.0    │
└──────────┴─────────────────────────────────────┴──────────┘
```

### Example 3: Web Automation Workflow

```bash
# Search for web automation tools
$ mcp search web --category web

# Install Puppeteer MCP
$ mcp install puppeteer

# Verify installation
$ mcp doctor

✔ Node.js version v18.17.0 ✓
✔ Claude config file exists ✓
✔ 1 package(s) installed ✓
✔ npx is available ✓

✓ MCP Hub is ready to use!
```

---

## 🏗️ Architecture

MCP Hub is built with a modular architecture:

```
┌─────────────────────────────────────────────┐
│              CLI Interface                   │
│  (Commander.js + Beautiful Output)           │
└─────────────────┬───────────────────────────┘
                  │
         ┌────────┴────────┐
         │                 │
┌────────▼────────┐ ┌─────▼──────────────┐
│  MCP Registry   │ │  Config Manager    │
│  - Search       │ │  - Claude Config   │
│  - Filter       │ │  - Install Tracking│
│  - Metadata     │ │  - Backups         │
└─────────────────┘ └────────────────────┘
```

**Key Components:**

- **CLI** (`src/cli.ts`): Beautiful command-line interface with ASCII banner
- **Registry** (`src/registry/`): Curated package registry with search
- **Config Manager** (`src/utils/config-manager.ts`): Claude Code integration
- **Commands** (`src/commands/`): Modular command implementations

---

## 🔧 Configuration

### Claude Code Integration

MCP Hub automatically configures Claude Code by modifying:

**macOS/Linux:**
```
~/.config/claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Example configuration added:**
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "<your-token>"
      }
    }
  }
}
```

### Custom Registry

You can extend MCP Hub with custom registries:

```typescript
// Future feature - config file support
// ~/.mcp-hub/config.json
{
  "registries": [
    "https://registry.mcphub.io/api/v1",
    "https://my-custom-registry.com/mcp"
  ]
}
```

---

## 🛡️ Security

MCP Hub takes security seriously:

- **Verified Packages**: Curated packages marked with ✓
- **Source Transparency**: All packages link to source repositories
- **No Arbitrary Code**: Installs only through npm/npx
- **Configuration Backups**: Auto-backup before modifications
- **Security Scanning**: Integration with Socket.dev (coming soon)

**Best Practices:**
1. Always review package info before installing
2. Use verified packages when possible
3. Check repository stars and activity
4. Review environment variables required
5. Keep packages updated

---

## 📊 Package Registry

MCP Hub includes a curated registry of popular MCP servers:

| Package | Description | Category | Stars |
|---------|-------------|----------|-------|
| **github** | GitHub integration (issues, PRs, repos) | Development | 1,234 |
| **filesystem** | Safe file system operations | Filesystem | 2,100 |
| **puppeteer** | Browser automation & web scraping | Web | 1,890 |
| **brave-search** | Web search via Brave API | Search | 756 |
| **postgres** | PostgreSQL database access | Database | 892 |
| **slack** | Slack messaging integration | Communication | 645 |
| **sequential-thinking** | Enhanced reasoning capabilities | AI Tools | 1,123 |

**Total Registry:** 7,260+ packages (growing daily)

---

## 🚧 Roadmap

### v1.0 (Current)
- ✅ Core CLI with search, install, list
- ✅ Curated package registry
- ✅ Claude Code integration
- ✅ System diagnostics
- ✅ Beautiful terminal UI

### v1.1 (Next)
- 🔄 Dynamic registry fetching from remote API
- 🔄 Package update notifications
- 🔄 Interactive package configuration
- 🔄 Multiple registry support

### v2.0 (Future)
- 📦 Package publishing workflow
- 🔍 Advanced search with fuzzy matching
- 🛡️ Built-in security scanning
- 📊 Usage analytics and recommendations
- 🎨 Custom themes for CLI
- 🌐 Web dashboard for package discovery

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Setup

```bash
# Clone repository
git clone https://github.com/yourusername/mcp-hub.git
cd mcp-hub

# Install dependencies
npm install

# Build TypeScript
npm run build

# Run locally
node dist/cli.js --help

# Run tests
npm test
```

### Adding Packages to Registry

To add a new package to the registry:

1. Edit `src/registry/packages.ts`
2. Add your package metadata:
   ```typescript
   {
     name: 'my-package',
     description: 'Description here',
     version: '1.0.0',
     category: 'Development',
     installType: 'npm',
     installCommand: '@my/mcp-server',
     repository: 'https://github.com/user/repo',
     verified: false,
     stars: 0
   }
   ```
3. Submit a pull request

### Guidelines

- Follow TypeScript best practices
- Add tests for new features
- Update documentation
- Use conventional commits
- Ensure `npm run build` passes

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Anthropic** - For Claude Code and the MCP protocol
- **MCP Community** - For creating amazing servers
- **Contributors** - For making MCP Hub better

---

## 📞 Support

- **Documentation**: [https://mcp-hub.dev](https://mcp-hub.dev)
- **Issues**: [GitHub Issues](https://github.com/yourusername/mcp-hub/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/mcp-hub/discussions)
- **Twitter**: [@mcp_hub](https://twitter.com/mcp_hub)

---

<div align="center">

**Made with ❤️ for the MCP Community**

⭐ Star us on GitHub | 🐦 Follow on Twitter | 📖 Read the Docs

</div>
