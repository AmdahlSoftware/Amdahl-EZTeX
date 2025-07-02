# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

EZTeX is a lightweight LaTeX editor derived from VS Code, specifically designed for easy editing, compilation, and preview of LaTeX documents. It has been rebranded from VS Code to EZTeX by Amdahl Software.

## EZTeX Development Commands

### Core Development Workflow
```bash
# Initial setup
npm install
npm run download-builtin-extensions

# Development mode with watch compilation
npm run watch

# Run EZTeX from source (in another terminal)
./scripts/code.sh

# Web version
./scripts/code-web.sh
```

### Testing
```bash
# Unit tests
./scripts/test.sh
npm run test-node           # Node.js unit tests
npm run test-browser        # Browser unit tests

# Integration tests
./scripts/test-integration.sh
./scripts/test-web-integration.sh
./scripts/test-remote-integration.sh

# Extension tests
npm run test-extension
```

### Build & Quality
```bash
# One-time compilation
npm run compile

# Code quality
npm run eslint
npm run hygiene
npm run precommit
```

## Architecture Overview

### Layer Structure
EZTeX follows a strict layered architecture in `src/vs/`:

```
base/           # Foundation utilities, platform abstractions
platform/       # Platform services (files, configuration, etc.)
editor/         # Monaco Editor engine
workbench/      # VS Code UI and application logic
code/           # Application entry points
server/         # Remote development support
```

**Key Rule**: Lower layers cannot depend on higher layers (base ← platform ← editor ← workbench).

### Main Entry Points
- `src/main.ts` - Electron main process entry
- `src/bootstrap-*.ts` - Bootstrap modules for different contexts
- `src/vs/code/electron-main/main.ts` - Core Electron application
- `src/vs/workbench/workbench.*.main.ts` - Workbench initialization

### Extension System
- Extensions run in isolated processes/workers
- Main thread ↔ Extension host communication via RPC
- API surface defined in `src/vscode-dts/vscode.d.ts`
- Extension lifecycle managed in `src/vs/workbench/services/extensions/`

### Platform Services Pattern
Services are structured as:
- Interface definition in `common/`
- Platform implementations in `browser/`, `node/`, `electron-main/`
- Registration through dependency injection

## Coding Guidelines

### Style (from .github/copilot-instructions.md)
- Use **tabs** for indentation
- PascalCase for types and enum values
- camelCase for functions, methods, properties, variables
- "double quotes" for user-facing strings (localized)
- 'single quotes' for internal strings
- Arrow functions preferred: `x => x + x`
- Always use curly braces for loops/conditionals
- JSDoc style comments for public APIs

### Architecture Patterns
- **Dependency Injection**: Services registered via `instantiation` service
- **Event-Driven**: Use events for decoupled communication
- **Service-Oriented**: Platform and workbench communicate via service interfaces
- **Multi-Process**: Main, renderer, and extension host processes

## Key Development Areas

### Adding Features
1. Determine appropriate layer (platform vs workbench)
2. Define service interfaces in `common/`
3. Implement platform-specific versions
4. Register services via dependency injection
5. Add contribution points if needed

### Extension Development
- Built-in extensions in `extensions/` directory
- Use `npm run watch-extensions` for development
- Test with `--extensionDevelopmentPath` flag

### Platform Integration
- File system operations via `platform/files/`
- Configuration via `platform/configuration/`
- Native integrations in `platform/` services

## Build System

### Structure
- Main build orchestrator: `build/gulpfile.js`
- TypeScript compilation with incremental builds
- Extension bundling and Monaco Editor packaging
- Multi-platform support (Windows, macOS, Linux)

### Development Scripts Location
- `scripts/code.sh` - Run desktop VS Code with dev environment
- `scripts/code-web.sh` - Run web version
- `scripts/test*.sh` - Various test suites

### Environment Variables
- `NODE_ENV=development` - Development mode
- `VSCODE_DEV=1` - VS Code development flag
- `VSCODE_CLI=1` - CLI mode flag

## Testing Strategy

### Test Organization
- Unit tests: `test/unit/`
- Integration: `test/integration/`
- Smoke tests: `test/smoke/`
- Extension tests: Built into extension development workflow

### Browser vs Node Tests
- Node tests for platform services and core logic
- Browser tests for workbench and UI components
- Web integration tests for browser-specific functionality

## Multi-Platform Considerations

EZTeX targets multiple deployment models:
- **Desktop (Electron)**: Full native application
- **Web**: Browser-based with limited capabilities
- **Server**: Headless for remote development
- **Utility Processes**: Sandboxed operations

Each has specific entry points and service implementations in corresponding directories.
