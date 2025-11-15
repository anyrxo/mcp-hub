#!/bin/bash

# MCP Hub - GitHub Push Script
# This script helps you push MCP Hub to a new GitHub repository

set -e

echo "🚀 MCP Hub - GitHub Push Setup"
echo "================================"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
  echo "❌ Git repository not initialized. Run 'git init' first."
  exit 1
fi

# Get GitHub username
echo "Enter your GitHub username:"
read -r GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
  echo "❌ GitHub username is required"
  exit 1
fi

# Repository name
REPO_NAME="mcp-hub"

echo ""
echo "📦 Repository details:"
echo "   Username: $GITHUB_USERNAME"
echo "   Repository: $REPO_NAME"
echo "   URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""

# Create repository on GitHub
echo "Creating GitHub repository..."
echo ""
echo "Option 1: Using GitHub CLI (gh)"
echo "--------------------------------"
echo "gh repo create $REPO_NAME --public --source=. --description=\"The npm for MCPs - Discover, install, and manage Model Context Protocol servers\" --push"
echo ""
echo "Option 2: Manually on GitHub.com"
echo "--------------------------------"
echo "1. Go to: https://github.com/new"
echo "2. Repository name: $REPO_NAME"
echo "3. Description: The npm for MCPs - Discover, install, and manage Model Context Protocol servers"
echo "4. Public repository"
echo "5. Do NOT initialize with README, .gitignore, or license (we already have them)"
echo "6. Click 'Create repository'"
echo ""

read -p "Have you created the repository? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Please create the repository first, then run this script again."
  exit 1
fi

# Add remote
echo ""
echo "Adding GitHub remote..."
git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git" 2>/dev/null || git remote set-url origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

# Rename branch to main if needed
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "Renaming branch to 'main'..."
  git branch -M main
fi

# Push to GitHub
echo ""
echo "Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Success! MCP Hub has been pushed to GitHub!"
echo ""
echo "🔗 Your repository: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""
echo "Next steps:"
echo "1. Visit your repository on GitHub"
echo "2. Enable GitHub Pages (Settings > Pages > Source: docs folder)"
echo "3. Add topics: mcp, model-context-protocol, cli, npm, package-manager"
echo "4. Add repository description and website URL"
echo "5. Consider publishing to npm: npm publish"
echo ""
echo "📖 Documentation will be available at:"
echo "   https://$GITHUB_USERNAME.github.io/$REPO_NAME/"
echo ""
