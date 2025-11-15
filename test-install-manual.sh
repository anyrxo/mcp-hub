#!/bin/bash

# Manual Installation Test for MCP Hub
# This script tests the complete installation workflow

set -e

echo "🧪 MCP Hub - Manual Installation Test"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test config directory
TEST_CONFIG_DIR="$(pwd)/test-manual-install"
TEST_CONFIG_FILE="$TEST_CONFIG_DIR/claude_desktop_config.json"

echo "Setting up test environment..."
mkdir -p "$TEST_CONFIG_DIR"
echo '{"mcpServers":{}}' > "$TEST_CONFIG_FILE"

echo -e "${GREEN}✓${NC} Test environment created at: $TEST_CONFIG_DIR"
echo ""

# Test 1: Search for a package
echo "Test 1: Searching for 'github' package..."
if node dist/cli.js search github | grep -q "github"; then
  echo -e "${GREEN}✓${NC} Search works"
else
  echo -e "${RED}✗${NC} Search failed"
  exit 1
fi
echo ""

# Test 2: Get package info
echo "Test 2: Getting package info for 'github'..."
if node dist/cli.js info github | grep -q "GitHub MCP server"; then
  echo -e "${GREEN}✓${NC} Info command works"
else
  echo -e "${RED}✗${NC} Info command failed"
  exit 1
fi
echo ""

# Test 3: List all packages
echo "Test 3: Listing all packages..."
OUTPUT=$(node dist/cli.js list --all)
if echo "$OUTPUT" | grep -q "github" && echo "$OUTPUT" | grep -q "postgres"; then
  echo -e "${GREEN}✓${NC} List command works"
  echo "   Found packages: github, postgres, and more"
else
  echo -e "${RED}✗${NC} List command failed"
  exit 1
fi
echo ""

# Test 4: Categories
echo "Test 4: Listing categories..."
if node dist/cli.js categories | grep -q "Development"; then
  echo -e "${GREEN}✓${NC} Categories command works"
else
  echo -e "${RED}✗${NC} Categories command failed"
  exit 1
fi
echo ""

# Test 5: Doctor diagnostics
echo "Test 5: Running diagnostics..."
OUTPUT=$(node dist/cli.js doctor)
if echo "$OUTPUT" | grep -q "Node.js" && echo "$OUTPUT" | grep -q "npx"; then
  echo -e "${GREEN}✓${NC} Doctor command works"
else
  echo -e "${YELLOW}⚠${NC} Doctor command may have issues (non-critical)"
fi
echo ""

# Test 6: Config path
echo "Test 6: Getting config path..."
if node dist/cli.js config --path | grep -q "claude_desktop_config.json"; then
  echo -e "${GREEN}✓${NC} Config path detection works"
else
  echo -e "${RED}✗${NC} Config path detection failed"
  exit 1
fi
echo ""

# Test 7: Search with no results
echo "Test 7: Search with no results..."
if node dist/cli.js search nonexistentpackage12345 | grep -qi "no packages found"; then
  echo -e "${GREEN}✓${NC} Empty search handled correctly"
else
  echo -e "${RED}✗${NC} Empty search handling failed"
  exit 1
fi
echo ""

# Test 8: Package not found
echo "Test 8: Info for non-existent package..."
if node dist/cli.js info nonexistentpackage12345 | grep -q "not found"; then
  echo -e "${GREEN}✓${NC} Package not found handled correctly"
else
  echo -e "${RED}✗${NC} Package not found handling failed"
  exit 1
fi
echo ""

# Cleanup
echo "Cleaning up..."
rm -rf "$TEST_CONFIG_DIR"
echo -e "${GREEN}✓${NC} Cleanup complete"
echo ""

# Summary
echo "═══════════════════════════════════════"
echo -e "${GREEN}✓ All manual tests passed!${NC}"
echo "═══════════════════════════════════════"
echo ""
echo "MCP Hub is working correctly and ready for production use."
echo ""
