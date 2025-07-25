# n8n Mermaid Nodes Architecture

This document contains the architectural design of the n8n Mermaid nodes solution with the focus on the high level components and how they interact. The solution provides Mermaid diagram generation capabilities within n8n workflows through custom nodes.

## High-level Component definitions & use

Describes the definitions and use of each component in the design, its technology and the scope of the use of any services.

**System components**

**n8n Workflow Engine**

The n8n workflow automation platform that hosts and executes the custom Mermaid nodes. It provides the runtime environment, data flow management, and user interface for creating workflows that include Mermaid diagram generation.

**Core Functionality: n8n Workflow Engine**

- Workflow Execution: Manages the execution flow of workflows containing Mermaid nodes
- Data Pipeline: Routes data between nodes in the workflow
- User Interface: Provides the visual workflow designer where users configure Mermaid nodes
- Node Registry: Discovers and loads custom Mermaid nodes from the npm package

**Architecture Diagram of component: n8n Workflow Engine**

```mermaid
---
title: n8n Workflow Engine Integration
---
flowchart TD
    "n8n Workflow Designer" --> "Workflow Runtime Engine"
    "Workflow Runtime Engine" --> "Node Registry"
    "Node Registry" --> "Mermaid Node Package"
    "Mermaid Node Package" --> "Custom Node Instances"
    "Custom Node Instances" --> "Mermaid Diagram Generator"
    "Mermaid Diagram Generator" --> "Output Data"
    "Output Data" --> "Next Workflow Node"
```

**Mermaid Node Package**

The npm package containing the MermaidCli custom n8n node that provides comprehensive Mermaid diagram generation capabilities through CLI subprocess execution. This package follows n8n's community node standards and includes node definitions and SVG assets.

**Core Functionality: Mermaid Node Package**

- Single Node Implementation: Provides the MermaidCli INodeType with 5 operations (generate, renderToBinary, validate, convert, batch)
- CLI Integration: Uses @mermaid-js/mermaid-cli via subprocess for reliable diagram rendering with Chromium
- Multi-format Output: Supports PNG, SVG, and PDF output formats with various delivery modes
- Asset Management: Includes mermaid.svg icon for the node display in n8n workflow editor
- Build Pipeline: Compiles TypeScript to JavaScript and packages assets for npm distribution

**Architecture Diagram of component: Mermaid Node Package**

```mermaid
---
title: Mermaid Node Package Structure
---
flowchart TD
    "Package Entry Point (index.js)" --> "MermaidCli Node Definition"
    "MermaidCli Node Definition" --> "MermaidCli.node.ts"
    "MermaidCli.node.ts" --> "MermaidOperations.ts"
    "MermaidOperations.ts" --> "Generate Operation"
    "MermaidOperations.ts" --> "RenderToBinary Operation"
    "MermaidOperations.ts" --> "Validate Operation"
    "MermaidOperations.ts" --> "Convert Operation"
    "MermaidOperations.ts" --> "Batch Operation"
    "Build System" --> "TypeScript Compiler"
    "Build System" --> "Gulp Asset Pipeline"
    "TypeScript Compiler" --> "JavaScript Output"
    "Gulp Asset Pipeline" --> "mermaid.svg Icon"
    "JavaScript Output" --> "Distribution Package"
    "mermaid.svg Icon" --> "Distribution Package"
```

**Custom Node Runtime**

The MermaidCli node instance that executes within n8n workflows to generate Mermaid diagrams through CLI subprocess operations. The node provides 5 distinct operations for comprehensive diagram processing and handles multiple output formats and delivery modes.

**Core Functionality: Custom Node Runtime**

- Input Processing: Receives and validates Mermaid syntax from text input or file paths
- CLI Subprocess Management: Executes @mermaid-js/mermaid-cli with proper Chromium environment configuration
- Multi-Operation Support: Handles generate, renderToBinary, validate, convert, and batch operations
- Output Formatting: Delivers results as file content, binary data, or file paths depending on configuration
- Error Handling: Manages CLI execution errors and provides detailed feedback for debugging

**Architecture Diagram of component: Custom Node Runtime**

```mermaid
---
title: MermaidCli Node Execution Flow
---
flowchart TD
    "Workflow Input Data" --> "Operation Selection"
    "Operation Selection" --> "Parameter Validation"
    "Parameter Validation" --> "Input Processing"
    "Input Processing" --> "CLI Subprocess Execution"
    "CLI Subprocess Execution" --> "Chromium Rendering"
    "Chromium Rendering" --> "Output Format Processing"
    "Output Format Processing" --> "Result Delivery"
    "Result Delivery" --> "Workflow Output"
    "Error Handling" --> "Workflow Output"
    "CLI Subprocess Execution" --> "Error Handling"
    "Chromium Rendering" --> "Error Handling"
```

**Mermaid CLI Integration System**

The subprocess execution system that interfaces with @mermaid-js/mermaid-cli to render Mermaid diagrams using Chromium browser engine. This system handles command-line argument construction, environment variable configuration, and output file management.

**Core Functionality: Mermaid CLI Integration System**

- Subprocess Execution: Manages mmdc command execution with proper argument formatting
- Chromium Configuration: Sets environment variables for headless browser rendering in containerized environments
- File Management: Handles temporary file creation, cleanup, and output format processing
- Error Recovery: Provides detailed error reporting for CLI execution failures and cleanup operations

**Architecture Diagram of component: Mermaid CLI Integration System**

```mermaid
---
title: CLI Integration and Execution Pipeline
---
flowchart TD
    "Mermaid Syntax Input" --> "Temporary File Creation"
    "Temporary File Creation" --> "CLI Argument Construction"
    "CLI Argument Construction" --> "Environment Configuration"
    "Environment Configuration" --> "Chromium Path Setup"
    "Chromium Path Setup" --> "mmdc Command Execution"
    "mmdc Command Execution" --> "Output File Generation"
    "Output File Generation" --> "Binary Data Reading"
    "Binary Data Reading" --> "File Cleanup"
    "File Cleanup" --> "Result Processing"
    "Error Monitoring" --> "Result Processing"
    "mmdc Command Execution" --> "Error Monitoring"
```

**TypeScript Compilation System**

The build system that compiles TypeScript source code to JavaScript and prepares the package for distribution. It ensures type safety during development and creates the final package structure.

**Core Functionality: TypeScript Compilation System**

- Type Checking: Validates TypeScript code against n8n interfaces and types
- Code Compilation: Transpiles TypeScript to JavaScript compatible with n8n runtime
- Asset Processing: Copies mermaid.svg icon to the distribution directory via Gulp
- Package Preparation: Creates the final npm package structure for publishing

**Architecture Diagram of component: TypeScript Compilation System**

```mermaid
---
title: Build and Compilation Pipeline
---
flowchart TD
    "TypeScript Source Files" --> "TypeScript Compiler (tsc)"
    "mermaid.svg Icon" --> "Gulp Build Pipeline"
    "TypeScript Compiler (tsc)" --> "JavaScript Output Files"
    "Gulp Build Pipeline" --> "Processed SVG Asset"
    "JavaScript Output Files" --> "Distribution Directory"
    "Processed SVG Asset" --> "Distribution Directory"
    "Distribution Directory" --> "npm Package"
    "ESLint Configuration" --> "Code Quality Validation"
    "Code Quality Validation" --> "TypeScript Compiler (tsc)"
```

**Credential Management System**

Currently not implemented as the MermaidCli node operates through local CLI subprocess execution without requiring external service authentication. Future versions may include credential management for cloud diagram storage or export services.

**Core Functionality: Credential Management System**

- Local Operation: No credentials required for basic Mermaid CLI diagram generation
- Future Extension: Framework available for adding external service authentication
- Secure Storage: Would integrate with n8n's credential storage system when needed
- Service Integration: Prepared for API-based diagram export or cloud storage features

**Architecture Diagram of component: Credential Management System**

```mermaid
---
title: Credential Management Flow (Future Implementation)
---
flowchart TD
    "Local CLI Operation" --> "No Credentials Required"
    "Future Cloud Services" --> "Credential Input Form"
    "Credential Input Form" --> "Credential Validation"
    "Credential Validation" --> "n8n Credential Store"
    "n8n Credential Store" --> "Encrypted Storage"
    "Node Execution" --> "Local CLI Operation"
    "Future External APIs" --> "Credential Retrieval"
    "Credential Retrieval" --> "External Service Authentication"
```

## Overall System Architecture

```mermaid
---
title: n8n Mermaid Nodes Complete Architecture
---
flowchart TB
    subgraph "Development Environment"
        "TypeScript Source" --> "Build Pipeline"
        "Build Pipeline" --> "npm Package"
    end
    
    subgraph "n8n Platform"
        "Workflow Designer" --> "Workflow Engine"
        "Node Registry" --> "Workflow Engine"
    end
    
    subgraph "Runtime Execution"
        "MermaidCli Node Instance" --> "CLI Subprocess Manager"
        "CLI Subprocess Manager" --> "Chromium Renderer"
        "Chromium Renderer" --> "Output Processor"
    end
    
    "npm Package" --> "Node Registry"
    "Workflow Engine" --> "MermaidCli Node Instance"
    "Output Processor" --> "Next Workflow Node"
```

The architecture follows n8n's plugin system where the custom MermaidCli node is loaded as an npm package and executed within the n8n runtime environment. The Mermaid functionality is implemented through CLI subprocess execution using @mermaid-js/mermaid-cli with Chromium rendering for reliable diagram generation.

**Development Toolchain System**

The integrated development environment and toolchain that supports the creation, testing, and deployment of Mermaid nodes. This includes code quality tools, formatters, and build automation.

**Core Functionality: Development Toolchain System**

- Code Quality Assurance: ESLint with n8n-specific rules ensures compliance with community standards
- Code Formatting: Prettier maintains consistent code style across all TypeScript files
- Editor Integration: VS Code configuration provides recommended extensions and settings
- Template Management: Example nodes serve as development templates for Mermaid implementations

**Architecture Diagram of component: Development Toolchain System**

```mermaid
---
title: Development Toolchain Architecture
---
flowchart TD
    "Developer IDE" --> "TypeScript Language Server"
    "TypeScript Language Server" --> "ESLint Integration"
    "ESLint Integration" --> "n8n Node Rules"
    "Prettier Formatter" --> "Code Style Enforcement"
    "VS Code Extensions" --> "Development Experience"
    "Example Node Templates" --> "Implementation Guidance"
    "Code Style Enforcement" --> "Consistent Codebase"
    "n8n Node Rules" --> "Community Standards"
    "Implementation Guidance" --> "Mermaid Node Development"
```

**Testing and Validation System**

The Docker-based testing environment and validation system that ensures MermaidCli node implementations work correctly with n8n platform requirements and Chromium rendering dependencies.

**Core Functionality: Testing and Validation System**

- Containerized Testing: Docker environment with Chromium for testing CLI subprocess execution
- Local n8n Integration: Runs n8n locally with development nodes for workflow testing
- Dependency Validation: Ensures @mermaid-js/mermaid-cli and Chromium dependencies work correctly
- Build Validation: Verifies compiled output meets n8n community node package requirements

**Architecture Diagram of component: Testing and Validation System**

```mermaid
---
title: Testing and Validation Flow
---
flowchart TD
    "MermaidCli Implementation" --> "Docker Test Environment"
    "Docker Test Environment" --> "Chromium Browser Setup"
    "Chromium Browser Setup" --> "Local n8n Instance"
    "Local n8n Instance" --> "Test Workflow Execution"
    "Test Workflow Execution" --> "CLI Subprocess Testing"
    "CLI Subprocess Testing" --> "Diagram Generation Validation"
    "Build Output" --> "Package Structure Validation"
    "Package Structure Validation" --> "npm Registry Preparation"
    "Diagram Generation Validation" --> "Output Format Testing"
    "Output Format Testing" --> "Integration Test Results"
    "Integration Test Results" --> "Deployment Readiness"
```
