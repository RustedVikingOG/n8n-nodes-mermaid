# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.4] - 2025-07-25

### Added
- **Comprehensive README**: Complete rewrite of README.md with professional documentation
- **Installation Guides**: Multiple installation methods (n8n interface, npm, Docker)
- **Detailed Examples**: Real-world examples for all diagram types and operations
- **Feature Highlights**: Professional feature list with emoji icons and clear descriptions
- **Configuration Options**: Detailed documentation of output formats, rendering options, and CLI environment
- **Troubleshooting Guide**: Common issues and solutions with debug instructions
- **Resource Links**: Comprehensive links to documentation, examples, and support

### Updated
- **Package Version**: Bumped from 0.1.3 to 0.1.4
- **Documentation Structure**: Professional README structure following n8n community standards
- **Version History**: Added changelog entries in README for better visibility
- **Project Branding**: Added npm and license badges for professional presentation

### Removed
- **Template Files**: Removed README_TEMPLATE.md and intermediate README_FINAL.md files
- **Starter Content**: Replaced n8n-nodes-starter template content with project-specific documentation

### Technical Details
- **README Overhaul**: Replaced entire README content with comprehensive project documentation
- **Documentation Standards**: Follows n8n community node documentation best practices
- **User Experience**: Improved installation and setup instructions for better onboarding
- **Developer Experience**: Enhanced development section with testing environment details

## [0.1.3] - 2025-07-25

### Updated
- **Architecture Documentation**: Completely updated `docs/designs/architecture.md` to accurately reflect MermaidCli single-node implementation with CLI subprocess execution
- **Use Cases Documentation**: Rewrote `docs/designs/use_cases.md` with 5 actual use cases covering all implemented operations (generate, renderToBinary, validate, convert, batch)
- **Implementation Accuracy**: Updated all documentation to reflect actual CLI integration using @mermaid-js/mermaid-cli with Chromium rendering
- **System Components**: Documented all 7 system components including CLI Integration System and Testing Environment
- **Mermaid Diagrams**: Added comprehensive architecture and flow diagrams using proper Mermaid syntax with quoted multi-word names

### Added
- **Complete Use Case Coverage**: Added detailed use cases for CLI-based diagram generation, binary data rendering, syntax validation, format conversion, and batch processing
- **Data Entity Models**: Added comprehensive entity relationship diagrams for each operation's data structures
- **State Diagrams**: Added processing flow state diagrams for all major operations
- **Sequence Diagrams**: Added interaction sequence diagrams showing CLI subprocess execution flows

### Technical Details
- **Documentation Sync Protocol**: Executed complete sync protocol per documenter-prompt.md requirements
- **Current Implementation**: All documentation now accurately describes the actual MermaidCli node with 5 operations
- **CLI Subprocess Details**: Documented mmdc command execution, Chromium environment setup, and file management
- **Testing Infrastructure**: Updated testing documentation to reflect Docker-based environment with Chromium support

## [0.1.2] - 2025-07-25

## [0.1.2] - 2025-07-25

### Fixed
- **Mermaid CLI Activation**: Enabled actual Mermaid CLI functionality by replacing stub functions with real implementations
- **Binary Data Functionality**: Fixed binary data output that was previously disabled due to stub functions
- **Diagram Generation**: Restored full diagram generation capabilities for all output formats (PNG, SVG, PDF)

### Technical Details
- **CLI Integration**: Activated @mermaid-js/mermaid-cli imports and removed temporary stub functions
- **Runtime Functionality**: Binary data output now works properly with actual diagram generation
- **Error Resolution**: Eliminated "Binary data output is not yet implemented" error messages

### Commit ID: 2e4feea

## [0.1.1] - 2025-07-25

### Added
- **Binary Data Output Support**: Implemented direct binary data return functionality for Mermaid diagrams, enabling seamless workflow integration without file system dependencies
- **Enhanced Output Type Selection**: Added comprehensive Output Type dropdown with options for File Content, Binary Data, and File Path Only modes
- **Binary Data Configuration**: Added binary property name and filename configuration options for custom binary data handling
- **MIME Type Detection**: Automatic MIME type detection and assignment for different output formats (PNG, SVG, PDF)

### Changed
- **Simplified Node UI**: Removed redundant Resource dropdown from node interface for cleaner user experience
- **Enhanced Conditional Logic**: Improved field display logic based on output type selection
- **Memory Management**: Optimized temporary file handling and cleanup for all output modes
- **Error Handling**: Enhanced error handling for binary data processing and file operations

### Technical Details
- **Binary Attachment**: Diagrams can now be attached as binary data to workflow items for direct use by subsequent nodes
- **File Cleanup**: Improved temporary file management with proper cleanup in all execution paths
- **Validation**: Added validation for required fields based on selected output type

### Commit ID: 46bf667

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
