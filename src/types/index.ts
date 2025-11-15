/**
 * MCP Package metadata
 */
export interface MCPPackage {
  name: string;
  description: string;
  version: string;
  author?: string;
  repository?: string;
  homepage?: string;
  license?: string;
  tags?: string[];
  category?: string;
  stars?: number;
  downloads?: number;

  // Installation
  installType: 'npm' | 'docker' | 'binary' | 'git';
  installCommand?: string;
  runCommand?: string;

  // Configuration
  configSchema?: Record<string, unknown>;
  env?: Record<string, string>;

  // Dependencies
  dependencies?: string[];
  peerDependencies?: string[];

  // Metadata
  createdAt?: string;
  updatedAt?: string;
  verified?: boolean;
}

/**
 * MCP Configuration for Claude Code
 */
export interface MCPConfig {
  mcpServers: Record<string, MCPServerConfig>;
}

export interface MCPServerConfig {
  command: string;
  args?: string[];
  env?: Record<string, string>;
  disabled?: boolean;
}

/**
 * MCP Hub configuration
 */
export interface HubConfig {
  installedPackages: Record<string, InstalledPackage>;
  registries: string[];
  settings: {
    autoUpdate?: boolean;
    verifiedOnly?: boolean;
    maxConcurrentInstalls?: number;
  };
}

export interface InstalledPackage {
  name: string;
  version: string;
  installedAt: string;
  enabled: boolean;
  config?: MCPServerConfig;
}

/**
 * Search results
 */
export interface SearchResult {
  packages: MCPPackage[];
  total: number;
  query: string;
}

/**
 * Installation result
 */
export interface InstallResult {
  success: boolean;
  package: MCPPackage;
  errors?: string[];
  warnings?: string[];
}
