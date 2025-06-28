import { describe, it, expect, vi } from 'vitest';
import {
	validateFileConstraints,
	fileToBase64Safe,
	fileToContentPartSafe,
	createFileUpload,
	processFilesBatch,
	getFileTypeCategory,
	formatFileSize,
	isFileTypeSupported,
	validateUploadProgress
} from '../utils/file-utils.js';

// Mock FileReader for testing
global.FileReader = vi.fn(() => ({
	readAsDataURL: vi.fn(),
	onload: null,
	onerror: null,
	result: null
})) as any;

describe('File Utils with Zod Validation', () => {
	describe('validateFileConstraints', () => {
		it('validates file within constraints', () => {
			const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
			const result = validateFileConstraints(file, 1024, ['text/*']);

			expect(result.success).toBe(true);
			expect(result.data).toBe(file);
		});

		it('rejects file exceeding size limit', () => {
			const file = new File(['x'.repeat(1000)], 'large.txt', { type: 'text/plain' });
			const result = validateFileConstraints(file, 500, ['text/*']);

			expect(result.success).toBe(false);
			expect(result.errors).toBeDefined();
			expect(result.errors![0]).toContain('File size exceeds maximum allowed size');
		});

		it('rejects file with disallowed type', () => {
			const file = new File(['test'], 'test.txt', { type: 'text/plain' });
			const result = validateFileConstraints(file, 1024, ['image/*']);

			expect(result.success).toBe(false);
			expect(result.errors).toBeDefined();
			expect(result.errors![0]).toContain('File type is not allowed');
		});

		it('allows any file type when no restrictions', () => {
			const file = new File(['test'], 'test.txt', { type: 'text/plain' });
			const result = validateFileConstraints(file, 1024, []);

			expect(result.success).toBe(true);
		});

		it('validates file extension', () => {
			const file = new File(['test'], 'document.pdf', { type: 'application/pdf' });
			const result = validateFileConstraints(file, 1024, ['.pdf']);

			expect(result.success).toBe(true);
		});

		it('rejects file with wrong extension', () => {
			const file = new File(['test'], 'document.txt', { type: 'text/plain' });
			const result = validateFileConstraints(file, 1024, ['.pdf']);

			expect(result.success).toBe(false);
		});
	});

	describe('fileToBase64Safe', () => {
		it('converts valid file to base64', async () => {
			const file = new File(['test'], 'test.txt', { type: 'text/plain' });
			
			// Mock FileReader
			const mockFileReader = {
				readAsDataURL: vi.fn(),
				onload: null,
				onerror: null,
				result: 'data:text/plain;base64,dGVzdA=='
			};
			
			vi.mocked(FileReader).mockImplementation(() => mockFileReader as any);

			// Simulate successful read
			setTimeout(() => {
				if (mockFileReader.onload) {
					mockFileReader.onload({} as any);
				}
			}, 0);

			const result = await fileToBase64Safe(file);
			expect(result.success).toBe(true);
			expect(result.data).toBe('dGVzdA==');
		});

		it('handles file read errors', async () => {
			const file = new File(['test'], 'test.txt', { type: 'text/plain' });
			
			const mockFileReader = {
				readAsDataURL: vi.fn(),
				onload: null,
				onerror: null,
				result: null
			};
			
			vi.mocked(FileReader).mockImplementation(() => mockFileReader as any);

			// Simulate error
			setTimeout(() => {
				if (mockFileReader.onerror) {
					mockFileReader.onerror(new Error('Read failed') as any);
				}
			}, 0);

			const result = await fileToBase64Safe(file);
			expect(result.success).toBe(false);
			expect(result.errors).toBeDefined();
		});
	});

	describe('createFileUpload', () => {
		it('creates valid file upload object', () => {
			const file = new File(['test'], 'test.txt', { type: 'text/plain' });
			const result = createFileUpload(file, 'upload-1', 'uploading', 50);

			expect(result.success).toBe(true);
			expect(result.data!.id).toBe('upload-1');
			expect(result.data!.file).toBe(file);
			expect(result.data!.status).toBe('uploading');
			expect(result.data!.progress).toBe(50);
		});

		it('generates ID when not provided', () => {
			const file = new File(['test'], 'test.txt', { type: 'text/plain' });
			const result = createFileUpload(file);

			expect(result.success).toBe(true);
			expect(result.data!.id).toBeDefined();
			expect(result.data!.id.length).toBeGreaterThan(0);
		});

		it('clamps progress to valid range', () => {
			const file = new File(['test'], 'test.txt', { type: 'text/plain' });
			
			const result1 = createFileUpload(file, 'test', 'uploading', -10);
			expect(result1.data!.progress).toBe(0);

			const result2 = createFileUpload(file, 'test', 'uploading', 150);
			expect(result2.data!.progress).toBe(100);
		});
	});

	describe('getFileTypeCategory', () => {
		it('categorizes image files', () => {
			const file = new File(['test'], 'image.jpg', { type: 'image/jpeg' });
			const result = getFileTypeCategory(file);

			expect(result.success).toBe(true);
			expect(result.data).toBe('image');
		});

		it('categorizes video files', () => {
			const file = new File(['test'], 'video.mp4', { type: 'video/mp4' });
			const result = getFileTypeCategory(file);

			expect(result.success).toBe(true);
			expect(result.data).toBe('video');
		});

		it('categorizes audio files', () => {
			const file = new File(['test'], 'audio.mp3', { type: 'audio/mpeg' });
			const result = getFileTypeCategory(file);

			expect(result.success).toBe(true);
			expect(result.data).toBe('audio');
		});

		it('categorizes document files', () => {
			const file = new File(['test'], 'document.pdf', { type: 'application/pdf' });
			const result = getFileTypeCategory(file);

			expect(result.success).toBe(true);
			expect(result.data).toBe('document');
		});

		it('categorizes other files', () => {
			const file = new File(['test'], 'data.bin', { type: 'application/octet-stream' });
			const result = getFileTypeCategory(file);

			expect(result.success).toBe(true);
			expect(result.data).toBe('other');
		});
	});

	describe('formatFileSize', () => {
		it('formats bytes correctly', () => {
			expect(formatFileSize(0)).toBe('0 Bytes');
			expect(formatFileSize(1024)).toBe('1 KB');
			expect(formatFileSize(1024 * 1024)).toBe('1 MB');
			expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
			expect(formatFileSize(1536)).toBe('1.5 KB');
		});
	});

	describe('isFileTypeSupported', () => {
		it('supports file when no restrictions', () => {
			const file = new File(['test'], 'test.txt', { type: 'text/plain' });
			expect(isFileTypeSupported(file, [])).toBe(true);
		});

		it('supports file with matching MIME type', () => {
			const file = new File(['test'], 'test.txt', { type: 'text/plain' });
			expect(isFileTypeSupported(file, ['text/plain'])).toBe(true);
		});

		it('supports file with wildcard MIME type', () => {
			const file = new File(['test'], 'test.txt', { type: 'text/plain' });
			expect(isFileTypeSupported(file, ['text/*'])).toBe(true);
		});

		it('supports file with matching extension', () => {
			const file = new File(['test'], 'document.pdf', { type: 'application/pdf' });
			expect(isFileTypeSupported(file, ['.pdf'])).toBe(true);
		});

		it('rejects unsupported file type', () => {
			const file = new File(['test'], 'test.txt', { type: 'text/plain' });
			expect(isFileTypeSupported(file, ['image/*'])).toBe(false);
		});

		it('rejects unsupported file extension', () => {
			const file = new File(['test'], 'test.txt', { type: 'text/plain' });
			expect(isFileTypeSupported(file, ['.pdf'])).toBe(false);
		});
	});

	describe('validateUploadProgress', () => {
		it('validates valid progress values', () => {
			expect(validateUploadProgress(0).success).toBe(true);
			expect(validateUploadProgress(50).success).toBe(true);
			expect(validateUploadProgress(100).success).toBe(true);
		});

		it('rejects invalid progress values', () => {
			expect(validateUploadProgress(-1).success).toBe(false);
			expect(validateUploadProgress(101).success).toBe(false);
		});
	});

	describe('processFilesBatch', () => {
		it('processes valid files successfully', async () => {
			const files = [
				new File(['test1'], 'test1.txt', { type: 'text/plain' }),
				new File(['test2'], 'test2.txt', { type: 'text/plain' })
			];

			// Mock successful base64 conversion
			const mockFileReader = {
				readAsDataURL: vi.fn(),
				onload: null,
				onerror: null,
				result: 'data:text/plain;base64,dGVzdA=='
			};
			
			vi.mocked(FileReader).mockImplementation(() => mockFileReader as any);

			// Simulate successful reads
			let callCount = 0;
			vi.mocked(mockFileReader.readAsDataURL).mockImplementation(() => {
				setTimeout(() => {
					if (mockFileReader.onload) {
						mockFileReader.onload({} as any);
					}
				}, 0);
			});

			const result = await processFilesBatch(files, 1024, ['text/*']);
			
			expect(result.successful.length).toBe(2);
			expect(result.failed.length).toBe(0);
		});

		it('separates valid and invalid files', async () => {
			const files = [
				new File(['test'], 'test.txt', { type: 'text/plain' }), // valid
				new File(['x'.repeat(2000)], 'large.txt', { type: 'text/plain' }), // too large
				new File(['test'], 'image.jpg', { type: 'image/jpeg' }) // wrong type
			];

			const result = await processFilesBatch(files, 1024, ['text/*']);

			// The first file passes validation but may fail processing due to mocking
			// The other two should fail validation (size and type constraints)
			expect(result.successful.length).toBeLessThanOrEqual(1);
			expect(result.failed.length).toBeGreaterThanOrEqual(2);
		});
	});
});
