import { INodeProperties } from 'n8n-workflow';

export const mermaidOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'generate',
		options: [
			{
				name: 'Generate Diagram',
				value: 'generate',
				description: 'Generate diagram from Mermaid syntax',
				action: 'Generate a mermaid diagram',
			},
			{
				name: 'Validate Syntax',
				value: 'validate',
				description: 'Validate Mermaid diagram syntax',
				action: 'Validate mermaid syntax',
			},
			{
				name: 'Convert Format',
				value: 'convert',
				description: 'Convert diagram to different output format',
				action: 'Convert diagram format',
			},
			{
				name: 'Batch Process',
				value: 'batch',
				description: 'Process multiple diagrams at once',
				action: 'Batch process diagrams',
			},
		],
	},
];

export const generateOperationFields: INodeProperties[] = [
	{
		displayName: 'Input Source',
		name: 'inputSource',
		type: 'options',
		displayOptions: {
			show: {
				operation: ['generate'],
			},
		},
		default: 'text',
		options: [
			{
				name: 'Mermaid Text',
				value: 'text',
				description: 'Input Mermaid syntax as text',
			},
			{
				name: 'File Path',
				value: 'file',
				description: 'Input from file path',
			},
		],
	},
	{
		displayName: 'Mermaid Code',
		name: 'mermaidCode',
		type: 'string',
		typeOptions: {
			rows: 10,
		},
		displayOptions: {
			show: {
				operation: ['generate'],
				inputSource: ['text'],
			},
		},
		default: 'graph TD\n    A[Start] --> B[Process]\n    B --> C[End]',
		description: 'The Mermaid diagram code to render',
		placeholder: 'graph TD\n    A[Start] --> B[Process]\n    B --> C[End]',
	},
	{
		displayName: 'Input File Path',
		name: 'inputFilePath',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['generate'],
				inputSource: ['file'],
			},
		},
		default: '',
		description: 'Path to the input Mermaid file',
		placeholder: '/path/to/diagram.mmd',
	},
	{
		displayName: 'Output Format',
		name: 'outputFormat',
		type: 'options',
		displayOptions: {
			show: {
				operation: ['generate'],
			},
		},
		default: 'png',
		options: [
			{
				name: 'SVG',
				value: 'svg',
				description: 'Scalable Vector Graphics',
			},
			{
				name: 'PNG',
				value: 'png',
				description: 'Portable Network Graphics',
			},
			{
				name: 'PDF',
				value: 'pdf',
				description: 'Portable Document Format',
			},
		],
	},
	{
		displayName: 'Output Type',
		name: 'outputType',
		type: 'options',
		displayOptions: {
			show: {
				operation: ['generate'],
			},
		},
		default: 'fileContent',
		options: [
			{
				name: 'File Content',
				value: 'fileContent',
				description: 'Return diagram content as text/base64 data',
			},
			{
				name: 'Binary Data',
				value: 'binary',
				description: 'Return as binary data attachment for use in workflows',
			},
			{
				name: 'File Path Only',
				value: 'filePath',
				description: 'Save to file and return only the file path',
			},
		],
	},
	{
		displayName: 'Output Path',
		name: 'outputPath',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['generate'],
				outputType: ['filePath'],
			},
		},
		default: '',
		description: 'Output file path (required when using File Path Only mode)',
		placeholder: '/path/to/output.png',
	},
	{
		displayName: 'Binary Property Name',
		name: 'binaryPropertyName',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['generate'],
				outputType: ['binary'],
			},
		},
		default: 'data',
		description: 'Name of the binary property to store the diagram data',
		placeholder: 'data',
	},
	{
		displayName: 'File Name',
		name: 'fileName',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['generate'],
				outputType: ['binary'],
			},
		},
		default: '',
		description: 'File name for the binary data (auto-generated if empty)',
		placeholder: 'diagram.png',
	},
	{
		displayName: 'Theme',
		name: 'theme',
		type: 'options',
		displayOptions: {
			show: {
				operation: ['generate'],
			},
		},
		default: 'default',
		options: [
			{
				name: 'Default',
				value: 'default',
			},
			{
				name: 'Dark',
				value: 'dark',
			},
			{
				name: 'Forest',
				value: 'forest',
			},
			{
				name: 'Neutral',
				value: 'neutral',
			},
		],
	},
	{
		displayName: 'Background Color',
		name: 'backgroundColor',
		type: 'color',
		displayOptions: {
			show: {
				operation: ['generate'],
			},
		},
		default: 'white',
		description: 'Background color for the diagram',
	},
	{
		displayName: 'Width',
		name: 'width',
		type: 'number',
		displayOptions: {
			show: {
				operation: ['generate'],
				outputFormat: ['png'],
			},
		},
		default: 800,
		description: 'Width of the output image in pixels',
	},
	{
		displayName: 'Height',
		name: 'height',
		type: 'number',
		displayOptions: {
			show: {
				operation: ['generate'],
				outputFormat: ['png'],
			},
		},
		default: 600,
		description: 'Height of the output image in pixels',
	},
];

export const validateOperationFields: INodeProperties[] = [
	{
		displayName: 'Mermaid Code',
		name: 'mermaidCode',
		type: 'string',
		typeOptions: {
			rows: 10,
		},
		displayOptions: {
			show: {
				operation: ['validate'],
			},
		},
		default: '',
		description: 'The Mermaid diagram code to validate',
		placeholder: 'graph TD\n    A[Start] --> B[Process]\n    B --> C[End]',
	},
	{
		displayName: 'Detailed Output',
		name: 'detailedOutput',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['validate'],
			},
		},
		default: false,
		description: 'Whether to return detailed validation information',
	},
];

export const convertOperationFields: INodeProperties[] = [
	{
		displayName: 'Input File Path',
		name: 'inputFilePath',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['convert'],
			},
		},
		default: '',
		description: 'Path to the input diagram file',
		placeholder: '/path/to/input.svg',
	},
	{
		displayName: 'Output Format',
		name: 'outputFormat',
		type: 'options',
		displayOptions: {
			show: {
				operation: ['convert'],
			},
		},
		default: 'png',
		options: [
			{
				name: 'PNG',
				value: 'png',
			},
			{
				name: 'PDF',
				value: 'pdf',
			},
			{
				name: 'SVG',
				value: 'svg',
			},
		],
	},
	{
		displayName: 'Output Path',
		name: 'outputPath',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['convert'],
			},
		},
		default: '',
		description: 'Output file path',
		placeholder: '/path/to/output.png',
	},
];

export const batchOperationFields: INodeProperties[] = [
	{
		displayName: 'Input Directory',
		name: 'inputDirectory',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['batch'],
			},
		},
		default: '',
		description: 'Directory containing Mermaid files to process',
		placeholder: '/path/to/diagrams/',
	},
	{
		displayName: 'File Pattern',
		name: 'filePattern',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['batch'],
			},
		},
		default: '*.mmd',
		description: 'File pattern to match (e.g., *.mmd, *.mermaid)',
	},
	{
		displayName: 'Output Directory',
		name: 'outputDirectory',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['batch'],
			},
		},
		default: '',
		description: 'Directory to save processed diagrams',
		placeholder: '/path/to/output/',
	},
	{
		displayName: 'Output Format',
		name: 'outputFormat',
		type: 'options',
		displayOptions: {
			show: {
				operation: ['batch'],
			},
		},
		default: 'svg',
		options: [
			{
				name: 'SVG',
				value: 'svg',
			},
			{
				name: 'PNG',
				value: 'png',
			},
			{
				name: 'PDF',
				value: 'pdf',
			},
		],
	},
	{
		displayName: 'Parallel Processing',
		name: 'parallel',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['batch'],
			},
		},
		default: true,
		description: 'Whether to process files in parallel',
	},
	{
		displayName: 'Max Concurrent',
		name: 'maxConcurrent',
		type: 'number',
		displayOptions: {
			show: {
				operation: ['batch'],
				parallel: [true],
			},
		},
		default: 4,
		description: 'Maximum number of concurrent processes',
	},
];
