import { MCPPackage, SearchResult } from '../types/index.js';

/**
 * MCP Registry - discovers and manages MCP packages
 */
export class MCPRegistry {
  private packages: Map<string, MCPPackage> = new Map();
  private registryUrls: string[] = [
    'https://raw.githubusercontent.com/punkpeye/awesome-mcp-servers/main/README.md',
    'https://raw.githubusercontent.com/wong2/awesome-mcp-servers/main/README.md',
  ];

  constructor() {
    this.initializeBuiltinPackages();
  }

  /**
   * Initialize with popular built-in packages
   */
  private initializeBuiltinPackages() {
    const builtinPackages: MCPPackage[] = [
      {
        name: 'github',
        description: 'GitHub MCP server - manage issues, PRs, repos',
        version: '1.0.0',
        author: 'GitHub',
        repository: 'https://github.com/modelcontextprotocol/servers',
        category: 'Development',
        tags: ['github', 'git', 'version-control'],
        installType: 'npm',
        installCommand: 'npx -y @modelcontextprotocol/server-github',
        runCommand: '@modelcontextprotocol/server-github',
        verified: true,
        stars: 5000,
      },
      {
        name: 'filesystem',
        description: 'File system operations - read, write, search files',
        version: '1.0.0',
        author: 'Anthropic',
        repository: 'https://github.com/modelcontextprotocol/servers',
        category: 'System',
        tags: ['filesystem', 'files', 'system'],
        installType: 'npm',
        installCommand: 'npx -y @modelcontextprotocol/server-filesystem',
        runCommand: '@modelcontextprotocol/server-filesystem',
        verified: true,
        stars: 4500,
      },
      {
        name: 'brave-search',
        description: 'Web search using Brave Search API',
        version: '1.0.0',
        author: 'ModelContextProtocol',
        repository: 'https://github.com/modelcontextprotocol/servers',
        category: 'Search',
        tags: ['search', 'web', 'brave'],
        installType: 'npm',
        installCommand: 'npx -y @modelcontextprotocol/server-brave-search',
        runCommand: '@modelcontextprotocol/server-brave-search',
        verified: true,
        stars: 3800,
      },
      {
        name: 'postgres',
        description: 'PostgreSQL database operations',
        version: '1.0.0',
        author: 'ModelContextProtocol',
        repository: 'https://github.com/modelcontextprotocol/servers',
        category: 'Database',
        tags: ['postgresql', 'database', 'sql'],
        installType: 'npm',
        installCommand: 'npx -y @modelcontextprotocol/server-postgres',
        runCommand: '@modelcontextprotocol/server-postgres',
        verified: true,
        stars: 3500,
      },
      {
        name: 'puppeteer',
        description: 'Browser automation with Puppeteer',
        version: '1.0.0',
        author: 'ModelContextProtocol',
        repository: 'https://github.com/modelcontextprotocol/servers',
        category: 'Automation',
        tags: ['browser', 'automation', 'puppeteer'],
        installType: 'npm',
        installCommand: 'npx -y @modelcontextprotocol/server-puppeteer',
        runCommand: '@modelcontextprotocol/server-puppeteer',
        verified: true,
        stars: 4200,
      },
      {
        name: 'slack',
        description: 'Slack integration - messages, channels, users',
        version: '1.0.0',
        author: 'ModelContextProtocol',
        repository: 'https://github.com/modelcontextprotocol/servers',
        category: 'Communication',
        tags: ['slack', 'messaging', 'communication'],
        installType: 'npm',
        installCommand: 'npx -y @modelcontextprotocol/server-slack',
        runCommand: '@modelcontextprotocol/server-slack',
        verified: true,
        stars: 3200,
      },
      {
        name: 'sequential-thinking',
        description: 'Step-by-step reasoning and problem solving',
        version: '1.0.0',
        author: 'Community',
        repository: 'https://github.com/sequentialread/sequential-thinking-mcp',
        category: 'Productivity',
        tags: ['thinking', 'reasoning', 'productivity'],
        installType: 'npm',
        installCommand: 'npx -y sequential-thinking-mcp',
        runCommand: 'sequential-thinking-mcp',
        verified: true,
        stars: 2800,
      },
      {
        name: 'mcp-api-toolkit',
        description: 'Comprehensive API development and testing (OpenAPI, SDK gen, testing)',
        version: '0.1.0',
        author: 'Community',
        repository: 'https://github.com/yourusername/mcp-api-toolkit',
        category: 'Development',
        tags: ['api', 'openapi', 'testing', 'sdk'],
        installType: 'npm',
        installCommand: 'npm install -g mcp-api-toolkit',
        runCommand: 'mcp-api-toolkit',
        verified: true,
        stars: 0, // New!
      },
    ];

    for (const pkg of builtinPackages) {
      this.packages.set(pkg.name, pkg);
    }
  }

  /**
   * Search for packages
   */
  search(query: string, options?: {
    category?: string;
    verified?: boolean;
    limit?: number;
  }): SearchResult {
    const lowerQuery = query.toLowerCase();
    let results: MCPPackage[] = Array.from(this.packages.values());

    // Filter by query
    if (query) {
      results = results.filter(pkg =>
        pkg.name.toLowerCase().includes(lowerQuery) ||
        pkg.description.toLowerCase().includes(lowerQuery) ||
        pkg.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        pkg.category?.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by category
    if (options?.category) {
      results = results.filter(pkg => pkg.category === options.category);
    }

    // Filter by verified
    if (options?.verified) {
      results = results.filter(pkg => pkg.verified);
    }

    // Sort by stars (popularity)
    results.sort((a, b) => (b.stars || 0) - (a.stars || 0));

    // Limit results
    if (options?.limit) {
      results = results.slice(0, options.limit);
    }

    return {
      packages: results,
      total: results.length,
      query,
    };
  }

  /**
   * Get package by name
   */
  getPackage(name: string): MCPPackage | undefined {
    return this.packages.get(name);
  }

  /**
   * List all packages
   */
  listAll(options?: {
    category?: string;
    sortBy?: 'name' | 'stars' | 'updated';
  }): MCPPackage[] {
    let packages = Array.from(this.packages.values());

    if (options?.category) {
      packages = packages.filter(pkg => pkg.category === options.category);
    }

    // Sort
    const sortBy = options?.sortBy || 'stars';
    switch (sortBy) {
      case 'name':
        packages.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'stars':
        packages.sort((a, b) => (b.stars || 0) - (a.stars || 0));
        break;
      case 'updated':
        packages.sort((a, b) =>
          new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
        );
        break;
    }

    return packages;
  }

  /**
   * Get categories
   */
  getCategories(): string[] {
    const categories = new Set<string>();
    for (const pkg of this.packages.values()) {
      if (pkg.category) {
        categories.add(pkg.category);
      }
    }
    return Array.from(categories).sort();
  }

  /**
   * Get package count
   */
  getPackageCount(): number {
    return this.packages.size;
  }
}
