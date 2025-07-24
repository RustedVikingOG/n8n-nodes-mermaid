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

The npm package containing custom n8n nodes that provide Mermaid diagram generation capabilities. This package follows n8n's community node standards and includes node definitions, credentials, and assets.

**Core Functionality: Mermaid Node Package**

- Node Implementation: Provides the INodeType implementations for different Mermaid diagram types
- Credential Management: Handles authentication for external services if needed
- Asset Management: Includes icons and visual assets for the nodes
- Build Pipeline: Compiles TypeScript to JavaScript and packages assets for distribution

**Architecture Diagram of component: Mermaid Node Package**

```mermaid
---
title: Mermaid Node Package Structure
---
flowchart TD
    "Package Entry Point" --> "Node Definitions"
    "Node Definitions" --> "Example Node"
    "Node Definitions" --> "HttpBin Test Node"
    "Node Definitions" --> "Mermaid Diagram Nodes"
    "Credential Definitions" --> "HttpBin Credentials"
    "Credential Definitions" --> "External Service Credentials"
    "Build System" --> "TypeScript Compiler"
    "Build System" --> "Gulp Asset Pipeline"
    "TypeScript Compiler" --> "JavaScript Output"
    "Gulp Asset Pipeline" --> "Icon Assets"
    "JavaScript Output" --> "Distribution Package"
    "Icon Assets" --> "Distribution Package"
```

**Custom Node Runtime**

Individual node instances that execute within n8n workflows to generate Mermaid diagrams. Each node type handles specific diagram generation tasks and processes input data to create diagram outputs.

**Core Functionality: Custom Node Runtime**

- Input Processing: Receives and validates input data from previous workflow nodes
- Diagram Generation: Creates Mermaid diagram syntax based on input data and configuration
- Output Formatting: Formats generated diagrams for consumption by subsequent nodes
- Error Handling: Manages errors and provides meaningful feedback for debugging

**Architecture Diagram of component: Custom Node Runtime**

```mermaid
---
title: Custom Node Execution Flow
---
flowchart TD
    "Workflow Input Data" --> "Node Parameter Validation"
    "Node Parameter Validation" --> "Input Data Processing"
    "Input Data Processing" --> "Mermaid Syntax Generation"
    "Mermaid Syntax Generation" --> "Diagram Rendering"
    "Diagram Rendering" --> "Output Data Formation"
    "Output Data Formation" --> "Workflow Output"
    "Error Handling" --> "Workflow Output"
    "Mermaid Syntax Generation" --> "Error Handling"
    "Diagram Rendering" --> "Error Handling"
```

**TypeScript Compilation System**

The build system that compiles TypeScript source code to JavaScript and prepares the package for distribution. It ensures type safety during development and creates the final package structure.

**Core Functionality: TypeScript Compilation System**

- Type Checking: Validates TypeScript code against n8n interfaces and types
- Code Compilation: Transpiles TypeScript to JavaScript compatible with n8n runtime
- Asset Processing: Copies icons and other assets to the distribution directory
- Package Preparation: Creates the final npm package structure for publishing

**Architecture Diagram of component: TypeScript Compilation System**

```mermaid
---
title: Build and Compilation Pipeline
---
flowchart TD
    "TypeScript Source Files" --> "TypeScript Compiler (tsc)"
    "Node Icons and Assets" --> "Gulp Build Pipeline"
    "TypeScript Compiler (tsc)" --> "JavaScript Output Files"
    "Gulp Build Pipeline" --> "Processed Assets"
    "JavaScript Output Files" --> "Distribution Directory"
    "Processed Assets" --> "Distribution Directory"
    "Distribution Directory" --> "npm Package"
    "ESLint Configuration" --> "Code Quality Validation"
    "Code Quality Validation" --> "TypeScript Compiler (tsc)"
```

**Credential Management System**

Handles authentication and credential storage for external services that Mermaid nodes may need to access, such as APIs for diagram export or cloud storage services.

**Core Functionality: Credential Management System**

- Credential Definition: Defines the structure and validation for different credential types
- Secure Storage: Integrates with n8n's credential storage system for secure handling
- Authentication Flow: Manages authentication with external services
- Credential Testing: Validates credentials against external services

**Architecture Diagram of component: Credential Management System**

```mermaid
---
title: Credential Management Flow
---
flowchart TD
    "Credential Input Form" --> "Credential Validation"
    "Credential Validation" --> "n8n Credential Store"
    "n8n Credential Store" --> "Encrypted Storage"
    "Node Execution" --> "Credential Retrieval"
    "Credential Retrieval" --> "n8n Credential Store"
    "Credential Retrieval" --> "External Service Authentication"
    "External Service Authentication" --> "API Access"
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
        "Credential Store" --> "Workflow Engine"
    end
    
    subgraph "Runtime Execution"
        "Mermaid Node Instance" --> "Diagram Generator"
        "Diagram Generator" --> "Output Processor"
    end
    
    "npm Package" --> "Node Registry"
    "Workflow Engine" --> "Mermaid Node Instance"
    "Credential Store" --> "Mermaid Node Instance"
    "Output Processor" --> "Next Workflow Node"
```

The architecture follows n8n's plugin system where custom nodes are loaded as npm packages and executed within the n8n runtime environment. The Mermaid functionality is encapsulated within individual nodes that can be composed into larger workflows for automated diagram generation and processing.

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

The system responsible for testing node implementations, validating functionality, and ensuring compatibility with n8n platform requirements before deployment.

**Core Functionality: Testing and Validation System**

- Local Testing Environment: Runs n8n locally with development nodes for testing
- HTTP Testing Framework: Uses HttpBin node for validating HTTP operations and integrations
- Credential Testing: Validates authentication mechanisms against external services
- Build Validation: Ensures compiled output meets n8n package requirements

**Architecture Diagram of component: Testing and Validation System**

```mermaid
---
title: Testing and Validation Flow
---
flowchart TD
    "Node Implementation" --> "Local n8n Instance"
    "Local n8n Instance" --> "Test Workflow Execution"
    "Test Workflow Execution" --> "HttpBin Test Node"
    "HttpBin Test Node" --> "External API Validation"
    "Credential Testing" --> "Authentication Validation"
    "Build Output" --> "Package Structure Validation"
    "Package Structure Validation" --> "npm Registry Preparation"
    "External API Validation" --> "Integration Test Results"
    "Authentication Validation" --> "Security Compliance"
    "Integration Test Results" --> "Deployment Readiness"
```
