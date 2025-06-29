import { Canvas, type ImageFormat, Rect } from "fabric";

export class CanvasService {
	canvas = $state<Canvas>(undefined as any);
	width = $state(1920);
	height = $state(1080);
	isDrawing = $state(false);

	constructor(target: HTMLCanvasElement, options?: { width?: number; height?: number; backgroundColor?: string }) {
		this.width = options?.width || 1920;
		this.height = options?.height || 1080;
		
		this.canvas = new Canvas(target, {
			width: this.width,
			height: this.height,
			allowTouchScrolling: false,
			defaultCursor: 'grab',
			selection: true,
			backgroundColor: options?.backgroundColor || '#f0f0f0',
			renderOnAddRemove: true,
			stateful: true,
			preserveObjectStacking: true,
			uniformScaling: false,
			centeredScaling: false,
			centeredRotation: true
		});

		// Set canvas clipping path to prevent objects from going outside bounds
		this.canvas.clipPath = new Rect({
			left: 0,
			top: 0,
			width: this.canvas.width,
			height: this.canvas.height,
			absolutePositioned: true,
		});

		this.centerCanvas();
		this.canvas.renderAll();
	}

	// Drawing mode toggle
	toggleDrawing() {
		this.isDrawing = !this.isDrawing;
		this.canvas.isDrawingMode = this.isDrawing;

		if (this.isDrawing && this.canvas.freeDrawingBrush) {
			this.canvas.freeDrawingBrush.color = 'black';
			this.canvas.freeDrawingBrush.width = 5;
		}
	}

	async export(format: ImageFormat = "png") {
		const hiddenCanvas = document.createElement("canvas");
		const fabricBuffer = new Canvas(hiddenCanvas, {
			width: this.canvas.getWidth(),
			height: this.canvas.getHeight(),
			selection: false,
		});
		const elements = this.canvas.toJSON();

		await fabricBuffer.loadFromJSON(elements);
		const dataURL = fabricBuffer.toDataURL({
			format,
			quality: 1,
			multiplier: 1,
		});
		return dataURL;
	}

	async download(format: ImageFormat = "png") {
		const dataURL = await this.export(format);
		const link = document.createElement("a");
		link.download = `canvas-export.${format}`;
		link.href = dataURL;
		link.click();
	}

	resize(width: number, height: number, useMagicResize = false) {
		if (!this.canvas) return;

		if (useMagicResize) {
			const currentWidth = this.canvas.getWidth();
			const currentHeight = this.canvas.getHeight();
			const scaleX = width / currentWidth;
			const scaleY = height / currentHeight;

			for (const obj of this.canvas.getObjects()) {
				obj.scaleX = (obj.scaleX || 1) * scaleX;
				obj.scaleY = (obj.scaleY || 1) * scaleY;
				obj.left = (obj.left || 0) * scaleX;
				obj.top = (obj.top || 0) * scaleY;
				obj.setCoords();
			}
		}

		this.canvas.clipPath = new Rect({
			left: 0,
			top: 0,
			width,
			height,
			absolutePositioned: true,
		});

		this.canvas.setWidth(width);
		this.canvas.setHeight(height);
		this.centerCanvas();
		this.canvas.renderAll();
		this.width = width;
		this.height = height;
	}

	// Center the canvas in the viewport
	centerCanvas() {
		const containerEl = this.canvas.wrapperEl?.parentElement;
		if (!containerEl) {
			console.error('Container element not found');
			return;
		}

		try {
			const containerRect = containerEl.getBoundingClientRect();
			const containerStyle = window.getComputedStyle(containerEl);
			const paddingLeft = parseFloat(containerStyle.paddingLeft) || 0;
			const paddingRight = parseFloat(containerStyle.paddingRight) || 0;
			const paddingTop = parseFloat(containerStyle.paddingTop) || 0;
			const paddingBottom = parseFloat(containerStyle.paddingBottom) || 0;
			const borderLeft = parseFloat(containerStyle.borderLeftWidth) || 0;
			const borderRight = parseFloat(containerStyle.borderRightWidth) || 0;
			const borderTop = parseFloat(containerStyle.borderTopWidth) || 0;
			const borderBottom = parseFloat(containerStyle.borderBottomWidth) || 0;

			const containerWidth = containerRect.width - paddingLeft - paddingRight - borderLeft - borderRight;
			const containerHeight = containerRect.height - paddingTop - paddingBottom - borderTop - borderBottom;
			const canvasWidth = this.canvas.width || 1920;
			const canvasHeight = this.canvas.height || 1080;

			// Reset the zoom and position to identity matrix
			this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

			// Calculate the scale to fit the canvas in the container
			const scaleX = containerWidth / canvasWidth;
			const scaleY = containerHeight / canvasHeight;
			const scale = Math.min(scaleX, scaleY);

			// Calculate the scaled dimensions
			const scaledWidth = canvasWidth * scale;
			const scaledHeight = canvasHeight * scale;

			// Calculate the offsets to center the canvas
			const offsetX = ((containerWidth - scaledWidth) / 2) + paddingLeft + borderLeft;
			const offsetY = ((containerHeight - scaledHeight) / 2) + paddingTop + borderTop;

			// Create a new viewport transform
			const newVpt = [scale, 0, 0, scale, offsetX, offsetY] as [number, number, number, number, number, number];

			// Apply the new viewport transform
			this.canvas.setViewportTransform(newVpt);
			this.canvas.requestRenderAll();
		} catch (error) {
			console.error('Error in centerCanvas():', error);
		}
	}

	// Clear the canvas
	clear() {
		this.canvas.clear();
		this.canvas.backgroundColor = '#f0f0f0';
		this.canvas.renderAll();
	}

	// Get canvas JSON
	toJSON() {
		return this.canvas.toJSON();
	}

	// Load from JSON
	async loadFromJSON(json: string | object) {
		const jsonData = typeof json === 'string' ? JSON.parse(json) : json;
		await this.canvas.loadFromJSON(jsonData);
		this.canvas.renderAll();
	}

	// Dispose of the canvas
	dispose() {
		if (this.canvas) {
			this.canvas.dispose();
		}
	}
}
