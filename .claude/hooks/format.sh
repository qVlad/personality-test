#!/bin/bash

# Claude Code Format Hook
# Automatically formats TypeScript files after Write/Edit operations
# This hook is triggered by Claude Code after file modifications

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to log with timestamp
log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')] Claude Format Hook:${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%H:%M:%S')] Claude Format Hook ERROR:${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] Claude Format Hook:${NC} $1"
}

warn() {
    echo -e "${YELLOW}[$(date +'%H:%M:%S')] Claude Format Hook:${NC} $1"
}

# Check if we're in the project root
if [[ ! -f "package.json" ]]; then
    error "package.json not found. Hook must run from project root."
    exit 1
fi

# Check if file path was provided as argument
if [[ $# -eq 0 ]]; then
    log "No file specified, formatting all TypeScript files..."
    TARGET="src/**/*.{ts,tsx}"
else
    TARGET="$1"
    log "Formatting file: $TARGET"
fi

# Check if the file exists and is a TypeScript file
if [[ -n "$1" && -f "$1" ]]; then
    if [[ "$1" =~ \.(ts|tsx)$ ]]; then
        log "Processing TypeScript file: $1"
    elif [[ "$1" =~ \.(js|jsx|json|md)$ ]]; then
        log "Processing supported file: $1"
    else
        log "File type not supported for formatting: $1"
        exit 0
    fi
elif [[ -n "$1" ]]; then
    warn "File not found: $1"
    exit 0
fi

# Skip formatting for certain directories
SKIP_DIRS=("node_modules" ".git" ".claude" ".specify" ".husky" "dist" "coverage")
for dir in "${SKIP_DIRS[@]}"; do
    if [[ "$TARGET" == *"$dir"* ]]; then
        log "Skipping formatting for $dir directory"
        exit 0
    fi
done

# Check if required tools are available
if ! command -v npx &> /dev/null; then
    error "npx not found. Please install Node.js."
    exit 1
fi

# Check if Prettier is available
if ! npx prettier --version &> /dev/null; then
    warn "Prettier not available. Run 'npm install' to install dependencies."
    exit 0
fi

# Format with Prettier
log "Running Prettier on $TARGET..."
if npx prettier --write "$TARGET" 2>/dev/null; then
    success "✓ Prettier formatting completed"
else
    error "✗ Prettier formatting failed"
fi

# Run ESLint fix if it's a TypeScript file
if [[ -n "$1" && "$1" =~ \.(ts|tsx)$ ]] || [[ -z "$1" ]]; then
    if npx eslint --version &> /dev/null; then
        log "Running ESLint fix..."
        if npx eslint --fix "$TARGET" 2>/dev/null; then
            success "✓ ESLint fix completed"
        else
            warn "⚠ ESLint fix had issues (this is often normal)"
        fi
    else
        warn "ESLint not available. Run 'npm install' to install dependencies."
    fi
fi

# Check TypeScript compilation if tsconfig.json exists
if [[ -f "tsconfig.json" ]] && command -v npx &> /dev/null; then
    if npx tsc --version &> /dev/null; then
        log "Checking TypeScript compilation..."
        if npx tsc --noEmit --skipLibCheck 2>/dev/null; then
            success "✓ TypeScript compilation check passed"
        else
            warn "⚠ TypeScript compilation has issues"
        fi
    fi
fi

# Run shellcheck if it's a shell file
if [[ -n "$1" && "$1" =~ \.(sh|bash)$ ]]; then
    if command -v shellcheck &> /dev/null; then
        log "Running shellcheck on shell script..."
        if shellcheck "$TARGET" 2>/dev/null; then
            success "✓ Shellcheck passed"
        else
            warn "⚠ Shellcheck found issues"
        fi
    else
        warn "Shellcheck not available. Run 'npm install' to install dependencies."
    fi
fi

log "Format hook completed"