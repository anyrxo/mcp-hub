import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { MCPConfig, MCPServerConfig, HubConfig, InstalledPackage } from '../types/index.js';

/**
 * Configuration Manager for MCP Hub and Claude Code
 */
export class ConfigManager {
  private claudeConfigPath: string;
  private hubConfigPath: string;

  constructor(customConfigPath?: string) {
    if (customConfigPath) {
      // Use custom path (for testing)
      this.claudeConfigPath = customConfigPath;
    } else {
      // Claude Code config location
      const home = os.homedir();
      if (process.platform === 'darwin') {
        this.claudeConfigPath = path.join(home, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
      } else if (process.platform === 'win32') {
        this.claudeConfigPath = path.join(process.env.APPDATA || '', 'Claude', 'claude_desktop_config.json');
      } else {
        // Linux
        this.claudeConfigPath = path.join(home, '.config', 'Claude', 'claude_desktop_config.json');
      }
    }

    // MCP Hub config
    const home = os.homedir();
    this.hubConfigPath = path.join(home, '.mcp-hub', 'config.json');
  }

  /**
   * Read Claude Code configuration
   */
  async readClaudeConfig(): Promise<MCPConfig> {
    try {
      const content = await fs.readFile(this.claudeConfigPath, 'utf-8');
      return JSON.parse(content) as MCPConfig;
    } catch (error) {
      // If file doesn't exist, return empty config
      return { mcpServers: {} };
    }
  }

  /**
   * Alias for readClaudeConfig (for convenience)
   */
  async getConfig(): Promise<MCPConfig> {
    return this.readClaudeConfig();
  }

  /**
   * Write Claude Code configuration
   */
  async writeClaudeConfig(config: MCPConfig): Promise<void> {
    const dir = path.dirname(this.claudeConfigPath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(this.claudeConfigPath, JSON.stringify(config, null, 2), 'utf-8');
  }

  /**
   * Add MCP server to Claude config
   */
  async addServer(name: string, serverConfig: MCPServerConfig): Promise<void> {
    const config = await this.readClaudeConfig();
    config.mcpServers[name] = serverConfig;
    await this.writeClaudeConfig(config);
  }

  /**
   * Remove MCP server from Claude config
   */
  async removeServer(name: string): Promise<void> {
    const config = await this.readClaudeConfig();
    delete config.mcpServers[name];
    await this.writeClaudeConfig(config);
  }

  /**
   * List all configured MCP servers
   */
  async listServers(): Promise<Record<string, MCPServerConfig>> {
    const config = await this.readClaudeConfig();
    return config.mcpServers || {};
  }

  /**
   * Read MCP Hub configuration
   */
  async readHubConfig(): Promise<HubConfig> {
    try {
      const content = await fs.readFile(this.hubConfigPath, 'utf-8');
      return JSON.parse(content) as HubConfig;
    } catch (error) {
      return {
        installedPackages: {},
        registries: [],
        settings: {
          autoUpdate: false,
          verifiedOnly: true,
          maxConcurrentInstalls: 3,
        },
      };
    }
  }

  /**
   * Write MCP Hub configuration
   */
  async writeHubConfig(config: HubConfig): Promise<void> {
    const dir = path.dirname(this.hubConfigPath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(this.hubConfigPath, JSON.stringify(config, null, 2), 'utf-8');
  }

  /**
   * Mark package as installed
   */
  async markInstalled(packageDataOrName: InstalledPackage | string, version?: string): Promise<void> {
    const config = await this.readHubConfig();

    if (typeof packageDataOrName === 'string') {
      // Called with (name, version)
      config.installedPackages[packageDataOrName] = {
        name: packageDataOrName,
        version: version || '1.0.0',
        installedAt: new Date().toISOString(),
        enabled: true
      };
    } else {
      // Called with InstalledPackage object
      config.installedPackages[packageDataOrName.name] = packageDataOrName;
    }

    await this.writeHubConfig(config);
  }

  /**
   * Mark package as uninstalled
   */
  async markUninstalled(name: string): Promise<void> {
    const config = await this.readHubConfig();
    delete config.installedPackages[name];
    await this.writeHubConfig(config);
  }

  /**
   * Get installed packages
   */
  async getInstalledPackages(): Promise<Record<string, InstalledPackage>> {
    const config = await this.readHubConfig();
    return config.installedPackages;
  }

  /**
   * Backup configuration
   */
  async backup(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const backupPath = path.join(os.homedir(), '.mcp-hub', 'backups', `config-${timestamp}.json`);

    const config = await this.readClaudeConfig();
    const dir = path.dirname(backupPath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(backupPath, JSON.stringify(config, null, 2), 'utf-8');

    return backupPath;
  }

  /**
   * Get config file path
   */
  getConfigPath(): string {
    return this.claudeConfigPath;
  }
}
