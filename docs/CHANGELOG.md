# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-07-24

### Added
- **Initial Mermaid CLI Node Implementation**: Created complete MermaidCLI node with comprehensive operations including diagram generation, validation, conversion, and batch processing
- **Comprehensive Documentation**: Added collaboration guide, architecture designs, and use case documentation in `docs/` folder
- **Docker Test Environment**: Set up containerized n8n test environment with PostgreSQL database and custom node deployment
- **Build and Deployment Automation**: Created automated build and deploy script for testing in Docker environment
- **Project Configuration**: Configured TypeScript, ESLint, Prettier, and Gulp for consistent development workflow

### Changed
- **Package Metadata**: Updated package.json with correct project name, description, repository URL, and author information
- **Node Dependencies**: Added Mermaid and Mermaid CLI dependencies with proper version constraints
- **Build Process**: Modified gulpfile.js to handle only node icons (removed credentials icons handling)
- **Git Configuration**: Updated .gitignore to exclude n8n_test_env directory

### Removed
- **Example Nodes**: Removed template ExampleNode and HttpBin node implementations
- **Example Credentials**: Removed ExampleCredentialsApi and HttpBinApi credential definitions
- **Unused Assets**: Removed httpbin.svg and related example node assets

### Technical Details
- **Node Operations**: Implemented generate, validate, convert, and batch operations for Mermaid diagrams
- **Output Formats**: Support for SVG, PNG, PDF output formats with configurable options
- **Error Handling**: Comprehensive error handling with detailed validation and user feedback
- **Type Safety**: Full TypeScript implementation with proper n8n workflow types
- **Test Infrastructure**: Complete Docker-based testing environment with persistence and logging
