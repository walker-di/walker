import { z } from 'zod';
import type { ContentPart, FileUpload } from '../schemas/chat.js';
import { ContentPartSchema, FileUploadSchema } from '../schemas/chat.js';
import { validateFile, validateFileUpload, type ValidationResult } from './validation.js';

/**
 * Enhanced file utilities with Zod validation
 */

// File type detection schemas
const ImageFileSchema = z.object({
	type: z.string().regex(/^image\//, 'Must be an image file'),
	name: z.string(),
	size: z.number()
});

const VideoFileSchema = z.object({
	type: z.string().regex(/^video\//, 'Must be a video file'),
	name: z.string(),
	size: z.number()
});

const AudioFileSchema = z.object({
	type: z.string().regex(/^audio\//, 'Must be an audio file'),
	name: z.string(),
	size: z.number()
});

const DocumentFileSchema = z.object({
	type: z.string().refine(
		(type) => type.includes('pdf') || type.includes('document') || type.includes('text'),
		'Must be a document file'
	),
	name: z.string(),
	size: z.number()
});

/**
 * Validate file against size and type constraints
 */
export function validateFileConstraints(
	file: File,
	maxSize: number = 10 * 1024 * 1024, // 10MB
	allowedTypes: string[] = ['image/*', 'video/*', 'audio/*', 'text/*', '.pdf']
): ValidationResult<File> {
	return validateFile(file, maxSize, allowedTypes);
}

/**
 * Convert File to base64 with validation
 */
export async function fileToBase64Safe(file: File): Promise<ValidationResult<string>> {
	try {
		// Validate file first
		const fileValidation = validateFileConstraints(file);
		if (!fileValidation.success) {
			return {
				success: false,
				errors: fileValidation.errors
			};
		}

		const base64 = await fileToBase64(file);
		
		// Validate base64 result
		const base64Schema = z.string().regex(/^[A-Za-z0-9+/]*={0,2}$/, 'Invalid base64 string');
		const base64Validation = base64Schema.safeParse(base64);
		
		if (!base64Validation.success) {
			return {
				success: false,
				errors: ['Failed to generate valid base64 string']
			};
		}

		return {
			success: true,
			data: base64
		};
	} catch (error) {
		return {
			success: false,
			errors: [`File conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
		};
	}
}

/**
 * Convert file to base64 string (original implementation)
 */
export function fileToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const result = reader.result as string;
			// Remove the data URL prefix (e.g., "data:image/png;base64,")
			const base64 = result.split(',')[1];
			resolve(base64);
		};
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

/**
 * Convert file to ContentPart with validation
 */
export async function fileToContentPartSafe(file: File): Promise<ValidationResult<ContentPart>> {
	try {
		// Validate file first
		const fileValidation = validateFileConstraints(file);
		if (!fileValidation.success) {
			return {
				success: false,
				errors: fileValidation.errors
			};
		}

		// Convert to base64
		const base64Result = await fileToBase64Safe(file);
		if (!base64Result.success) {
			return base64Result;
		}

		// Create content part based on file type
		let contentPart: unknown;

		if (file.type.startsWith('image/')) {
			contentPart = {
				type: 'image',
				source: { base64: base64Result.data },
				media_type: file.type,
				alt_text: file.name
			};
		} else if (file.type.startsWith('video/')) {
			contentPart = {
				type: 'video',
				source: { base64: base64Result.data },
				media_type: file.type
			};
		} else if (file.type.startsWith('audio/')) {
			contentPart = {
				type: 'audio',
				source: { base64: base64Result.data },
				media_type: file.type
			};
		} else {
			contentPart = {
				type: 'file',
				source: { base64: base64Result.data },
				media_type: file.type,
				filename: file.name,
				size: file.size
			};
		}

		// Validate the created content part
		const contentPartValidation = ContentPartSchema.safeParse(contentPart);
		if (!contentPartValidation.success) {
			return {
				success: false,
				errors: contentPartValidation.error.issues.map(issue => 
					`${issue.path.join('.')}: ${issue.message}`
				)
			};
		}

		return {
			success: true,
			data: contentPartValidation.data
		};
	} catch (error) {
		return {
			success: false,
			errors: [`File processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
		};
	}
}

/**
 * Create validated file upload object
 */
export function createFileUpload(
	file: File,
	id?: string,
	status: 'uploading' | 'uploaded' | 'error' = 'uploading',
	progress: number = 0
): ValidationResult<FileUpload> {
	const uploadData = {
		id: id || crypto.randomUUID(),
		file,
		status,
		progress: Math.max(0, Math.min(100, progress))
	};

	return validateFileUpload(uploadData);
}

/**
 * Batch process multiple files with validation
 */
export async function processFilesBatch(
	files: File[],
	maxSize?: number,
	allowedTypes?: string[]
): Promise<{
	successful: { file: File; contentPart: ContentPart }[];
	failed: { file: File; errors: string[] }[];
}> {
	const successful: { file: File; contentPart: ContentPart }[] = [];
	const failed: { file: File; errors: string[] }[] = [];

	for (const file of files) {
		// Validate file constraints
		const fileValidation = validateFileConstraints(file, maxSize, allowedTypes);
		if (!fileValidation.success) {
			failed.push({
				file,
				errors: fileValidation.errors || ['Unknown validation error']
			});
			continue;
		}

		// Convert to content part
		const contentPartResult = await fileToContentPartSafe(file);
		if (contentPartResult.success && contentPartResult.data) {
			successful.push({
				file,
				contentPart: contentPartResult.data
			});
		} else {
			failed.push({
				file,
				errors: contentPartResult.errors || ['Failed to process file']
			});
		}
	}

	return { successful, failed };
}

/**
 * Get file type category with validation
 */
export function getFileTypeCategory(file: File): ValidationResult<'image' | 'video' | 'audio' | 'document' | 'other'> {
	try {
		if (ImageFileSchema.safeParse(file).success) {
			return { success: true, data: 'image' };
		}
		if (VideoFileSchema.safeParse(file).success) {
			return { success: true, data: 'video' };
		}
		if (AudioFileSchema.safeParse(file).success) {
			return { success: true, data: 'audio' };
		}
		if (DocumentFileSchema.safeParse(file).success) {
			return { success: true, data: 'document' };
		}
		
		return { success: true, data: 'other' };
	} catch (error) {
		return {
			success: false,
			errors: [`File type detection failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
		};
	}
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Check if file type is supported
 */
export function isFileTypeSupported(file: File, allowedTypes: string[]): boolean {
	if (allowedTypes.length === 0) return true;
	
	return allowedTypes.some(type => {
		if (type.startsWith('.')) {
			return file.name.toLowerCase().endsWith(type.toLowerCase());
		}
		if (type.includes('*')) {
			const baseType = type.split('/')[0];
			return file.type.startsWith(baseType);
		}
		return file.type === type;
	});
}

/**
 * Validate file upload progress
 */
export function validateUploadProgress(progress: number): ValidationResult<number> {
	const progressSchema = z.number().min(0).max(100);
	const result = progressSchema.safeParse(progress);
	
	if (result.success) {
		return { success: true, data: result.data };
	}
	
	return {
		success: false,
		errors: ['Progress must be between 0 and 100']
	};
}
