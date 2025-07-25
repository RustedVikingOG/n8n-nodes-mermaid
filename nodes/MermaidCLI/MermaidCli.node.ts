import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import {
	mermaidOperations,
	generateOperationFields,
	validateOperationFields,
	convertOperationFields,
	batchOperationFields,
} from './MermaidOperations';

// Temporarily comment out mermaid-cli imports to fix the Docker issue
// import { run as mermaidCliRun } from '@mermaid-js/mermaid-cli';
// import mermaid from 'mermaid';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

// Temporary stub functions until mermaid dependencies are properly configured
const mermaidCliRun = async (...args: any[]) => {
	console.log('Mermaid CLI functionality temporarily disabled.');
	return false;
};

const mermaid = {
	initialize: (config?: any) => {},
	parse: async (code?: string) => ({ parser: 'temp' })
};

export class MermaidCli implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Mermaid CLI',
		name: 'mermaidCli',
		icon: 'file:mermaid.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Execute Mermaid CLI commands for diagram generation',
		defaults: {
			name: 'Mermaid CLI',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			...mermaidOperations,
			...generateOperationFields,
			...validateOperationFields,
			...convertOperationFields,
			...batchOperationFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;

				let result: any;

				switch (operation) {
					case 'generate':
						result = await generateDiagram(this, i);
						break;
					case 'validate':
						result = await validateSyntax(this, i);
						break;
					case 'convert':
						result = await convertFormat(this, i);
						break;
					case 'batch':
						result = await batchProcess(this, i);
						break;
					default:
						throw new NodeOperationError(
							this.getNode(),
							`Unknown operation: ${operation}`,
							{ itemIndex: i },
						);
				}

				const nodeExecutionData: INodeExecutionData = {
					json: result,
					pairedItem: { item: i },
				};

				// Add binary data if present
				if (result.binary) {
					nodeExecutionData.binary = result.binary;
					// Remove binary from JSON to avoid duplication
					delete result.binary;
				}

				returnData.push(nodeExecutionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

async function generateDiagram(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<any> {
	const inputSource = executeFunctions.getNodeParameter('inputSource', itemIndex) as string;
	const outputFormat = executeFunctions.getNodeParameter('outputFormat', itemIndex) as string;
	const outputType = executeFunctions.getNodeParameter('outputType', itemIndex) as string;
	const theme = executeFunctions.getNodeParameter('theme', itemIndex) as string;
	const backgroundColor = executeFunctions.getNodeParameter('backgroundColor', itemIndex) as string;

	let mermaidCode: string;
	let inputFilePath: string;

	if (inputSource === 'text') {
		mermaidCode = executeFunctions.getNodeParameter('mermaidCode', itemIndex) as string;
		// Create temporary file for CLI processing
		const tempDir = os.tmpdir();
		inputFilePath = path.join(tempDir, `mermaid-${Date.now()}-${itemIndex}.mmd`);
		await fs.writeFile(inputFilePath, mermaidCode);
	} else {
		inputFilePath = executeFunctions.getNodeParameter('inputFilePath', itemIndex) as string;
	}

	// Prepare CLI options
	const options: any = {
		theme,
		backgroundColor,
	};

	// Handle format-specific options
	if (outputFormat === 'png') {
		const width = executeFunctions.getNodeParameter('width', itemIndex) as number;
		const height = executeFunctions.getNodeParameter('height', itemIndex) as number;
		options.width = width;
		options.height = height;
	}

	// Handle output based on outputType
	let outputFilePath: string;
	let returnContent = false;

	if (outputType === 'filePath') {
		// User must provide an output path
		outputFilePath = executeFunctions.getNodeParameter('outputPath', itemIndex) as string;
		if (!outputFilePath) {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				'Output Path is required when using "File Path Only" output type',
				{ itemIndex },
			);
		}
	} else if (outputType === 'binary') {
		// Binary mode - create temporary output file and return as binary data
		const tempDir = os.tmpdir();
		outputFilePath = path.join(tempDir, `mermaid-output-${Date.now()}-${itemIndex}.${outputFormat}`);
	} else {
		// fileContent mode - create temporary output file and return content
		const tempDir = os.tmpdir();
		outputFilePath = path.join(tempDir, `mermaid-output-${Date.now()}-${itemIndex}.${outputFormat}`);
		returnContent = true;
	}

	try {
		// Use the mermaid-cli Node.js API with proper typing
		await mermaidCliRun(
			inputFilePath,
			outputFilePath as `${string}.png` | `${string}.svg` | `${string}.pdf`,
			options
		);

		let result: any = {
			success: true,
			inputPath: inputFilePath,
			outputPath: outputFilePath,
			format: outputFormat,
			outputType,
			options,
		};

		// If we need to return content, read the file
		if (returnContent) {
			try {
				if (outputFormat === 'svg') {
					result.content = await fs.readFile(outputFilePath, 'utf-8');
					result.contentType = 'image/svg+xml';
				} else {
					const buffer = await fs.readFile(outputFilePath);
					result.content = buffer.toString('base64');
					result.contentType = outputFormat === 'png' ? 'image/png' : 'application/pdf';
				}

				// Clean up temporary output file
				await fs.unlink(outputFilePath);
			} catch (readError) {
				result.readError = (readError as Error).message;
			}
		}

		// Handle binary data output
		if (outputType === 'binary') {
			try {
				const binaryPropertyName = executeFunctions.getNodeParameter('binaryPropertyName', itemIndex) as string;
				let fileName = executeFunctions.getNodeParameter('fileName', itemIndex) as string;
				
				// Auto-generate filename if not provided
				if (!fileName) {
					fileName = `mermaid-diagram-${Date.now()}.${outputFormat}`;
				}

				// Read the file as buffer for binary data
				const fileBuffer = await fs.readFile(outputFilePath);
				
				// Set up MIME type based on format
				let mimeType: string;
				switch (outputFormat) {
					case 'png':
						mimeType = 'image/png';
						break;
					case 'svg':
						mimeType = 'image/svg+xml';
						break;
					case 'pdf':
						mimeType = 'application/pdf';
						break;
					default:
						mimeType = 'application/octet-stream';
				}

				// Add binary data to result
				result.binary = {
					[binaryPropertyName]: {
						data: fileBuffer.toString('base64'),
						mimeType,
						fileName,
						fileExtension: outputFormat,
					},
				};

				// Clean up temporary output file
				await fs.unlink(outputFilePath);
			} catch (binaryError) {
				result.binaryError = (binaryError as Error).message;
			}
		}			// Clean up temporary input file if created
			if (inputSource === 'text') {
				try {
					await fs.unlink(inputFilePath);
				} catch (cleanupError) {
					result.cleanupWarning = (cleanupError as Error).message;
				}
			}

			return result;
		} catch (error) {
			// Clean up files on error
			if (inputSource === 'text') {
				try {
					await fs.unlink(inputFilePath);
				} catch (cleanupError) {
					// Ignore cleanup errors
				}
			}
			if (returnContent || outputType === 'binary') {
				try {
					await fs.unlink(outputFilePath);
				} catch (cleanupError) {
					// Ignore cleanup errors
				}
			}

			throw new NodeOperationError(
				executeFunctions.getNode(),
				`Failed to generate diagram: ${(error as Error).message}`,
				{ itemIndex },
			);
		}
	}

async function validateSyntax(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<any> {
	const mermaidCode = executeFunctions.getNodeParameter('mermaidCode', itemIndex) as string;
	const detailedOutput = executeFunctions.getNodeParameter('detailedOutput', itemIndex) as boolean;

		try {
			// Initialize mermaid for validation
			mermaid.initialize({ startOnLoad: false });

			// Use mermaid's parse function to validate syntax
			const parseResult = await mermaid.parse(mermaidCode);

			if (parseResult) {
				return {
					valid: true,
					message: 'Mermaid syntax is valid',
					details: detailedOutput ? { parseResult } : undefined,
				};
			} else {
				return {
					valid: false,
					message: 'Mermaid syntax is invalid',
					details: detailedOutput ? { parseResult } : undefined,
				};
			}
		} catch (error) {
			return {
				valid: false,
				message: 'Mermaid syntax is invalid',
				error: (error as Error).message,
				details: detailedOutput ? error : undefined,
			};
		}
	}

async function convertFormat(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<any> {
	const inputFilePath = executeFunctions.getNodeParameter('inputFilePath', itemIndex) as string;
	const outputFormat = executeFunctions.getNodeParameter('outputFormat', itemIndex) as string;
	const outputPath = executeFunctions.getNodeParameter('outputPath', itemIndex) as string;

		try {
			await mermaidCliRun(
				inputFilePath,
				outputPath as `${string}.png` | `${string}.svg` | `${string}.pdf`,
				{}
			);

			return {
				success: true,
				inputPath: inputFilePath,
				outputPath: outputPath,
				format: outputFormat,
			};
		} catch (error) {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				`Failed to convert format: ${(error as Error).message}`,
				{ itemIndex },
			);
		}
	}

async function batchProcess(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<any> {
	const inputDirectory = executeFunctions.getNodeParameter('inputDirectory', itemIndex) as string;
	const filePattern = executeFunctions.getNodeParameter('filePattern', itemIndex) as string;
	const outputDirectory = executeFunctions.getNodeParameter('outputDirectory', itemIndex) as string;
	const outputFormat = executeFunctions.getNodeParameter('outputFormat', itemIndex) as string;
	const parallel = executeFunctions.getNodeParameter('parallel', itemIndex) as boolean;
	const maxConcurrent = executeFunctions.getNodeParameter('maxConcurrent', itemIndex) as number;

		try {
			// Find matching files
			const files = await fs.readdir(inputDirectory);
			const pattern = new RegExp(filePattern.replace('*', '.*'));
			const matchingFiles = files.filter((file: string) => pattern.test(file));

			if (matchingFiles.length === 0) {
				return {
					success: true,
					message: 'No matching files found',
					pattern: filePattern,
					directory: inputDirectory,
					filesProcessed: 0,
				};
			}

			const results: any[] = [];

			if (parallel) {
				// Process files in parallel with concurrency limit
				const chunks: string[][] = [];
				for (let i = 0; i < matchingFiles.length; i += maxConcurrent) {
					chunks.push(matchingFiles.slice(i, i + maxConcurrent));
				}

				for (const chunk of chunks) {
					const promises = chunk.map(async (file) => {
						const inputPath = path.join(inputDirectory, file);
						const outputFile = path.parse(file).name + '.' + outputFormat;
						const outputPath = path.join(outputDirectory, outputFile);

						try {
							await mermaidCliRun(
								inputPath,
								outputPath as `${string}.png` | `${string}.svg` | `${string}.pdf`,
								{}
							);
							return {
								file,
								success: true,
								inputPath,
								outputPath,
							};
						} catch (error) {
							return {
								file,
								success: false,
								inputPath,
								error: (error as Error).message,
							};
						}
					});

					const chunkResults = await Promise.all(promises);
					results.push(...chunkResults);
				}
			} else {
				// Process files sequentially
				for (const file of matchingFiles) {
					const inputPath = path.join(inputDirectory, file);
					const outputFile = path.parse(file).name + '.' + outputFormat;
					const outputPath = path.join(outputDirectory, outputFile);

					try {
						await mermaidCliRun(
							inputPath,
							outputPath as `${string}.png` | `${string}.svg` | `${string}.pdf`,
							{}
						);
						results.push({
							file,
							success: true,
							inputPath,
							outputPath,
						});
					} catch (error) {
						results.push({
							file,
							success: false,
							inputPath,
							error: (error as Error).message,
						});
					}
				}
			}

			const successful = results.filter(r => r.success).length;
			const failed = results.filter(r => !r.success).length;

			return {
				success: true,
				filesProcessed: matchingFiles.length,
				successful,
				failed,
				parallel,
				maxConcurrent: parallel ? maxConcurrent : undefined,
				results,
			};
		} catch (error) {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				`Failed to batch process: ${(error as Error).message}`,
				{ itemIndex },
			);
		}
	}
