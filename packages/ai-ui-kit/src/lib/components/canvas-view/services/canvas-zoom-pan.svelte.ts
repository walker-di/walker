import type { Canvas } from "fabric";
import { Point } from "fabric";

export class CanvasZoomPan {
	isPanMode: boolean = $state(false);
	private canvas: Canvas;
	private lastPosX: number = 0;
	private lastPosY: number = 0;
	private pinchCenter: { x: number, y: number } | null = null;
	private initialDistance: number = 0;
	private isDragging: boolean = false;
	private minZoom: number = 0.1;
	private maxZoom: number = 10;

	constructor(canvas: Canvas) {
		this.canvas = canvas;
		this.initialize();
	}

	private initialize(): void {
		// Mouse events for dragging and zooming
		this.canvas.on("mouse:down", this.dragCanvasStart.bind(this));
		this.canvas.on("mouse:move", this.dragCanvas.bind(this));
		this.canvas.on("mouse:up", () => { this.isDragging = false; });
		this.canvas.on("mouse:wheel", this.zoomCanvasMouseWheel.bind(this));

		// Touch events for pinch-zoom
		if (this.canvas.wrapperEl) {
			this.canvas.wrapperEl.addEventListener('touchstart', this.handleTouchStart.bind(this));
			this.canvas.wrapperEl.addEventListener('touchmove', this.handleTouchMove.bind(this));
			this.canvas.wrapperEl.addEventListener('touchend', () => { this.isDragging = false; });
		}

		// Set initial mode to select mode
		this.setToSelectMode();
	}

	private dragCanvasStart(event: any): void {
		if (!this.isPanMode) return;

		const evt = event.e || event;
		if (evt.button === 1 || evt.button === 2) return;

		this.isDragging = true;
		this.lastPosX = evt.clientX;
		this.lastPosY = evt.clientY;
		this.canvas.defaultCursor = 'grabbing';
	}

	private dragCanvas(event: any): void {
		if (!this.isPanMode || !this.isDragging) return;

		const evt = event.e || event;
		if (evt.buttons !== undefined && evt.buttons !== 1 && !(evt instanceof Touch)) {
			this.isDragging = false;
			this.canvas.defaultCursor = 'grab';
			return;
		}

		this.redrawCanvas(evt);
	}

	private redrawCanvas(event: any): void {
		const vpt = this.canvas.viewportTransform;
		if (!vpt) return;

		let offsetX = vpt[4] + event.clientX - (this.lastPosX || 0);
		let offsetY = vpt[5] + event.clientY - (this.lastPosY || 0);

		vpt[4] = offsetX;
		vpt[5] = offsetY;

		this.lastPosX = event.clientX;
		this.lastPosY = event.clientY;

		this.canvas.setViewportTransform(vpt);
		this.canvas.requestRenderAll();
	}

	private zoomCanvasMouseWheel(event: any): void {
		const delta = event.e.deltaY;
		let zoom = this.canvas.getZoom();

		zoom *= 0.999 ** delta;
		zoom = Math.min(Math.max(zoom, this.minZoom), this.maxZoom);

		const point = { x: event.e.offsetX, y: event.e.offsetY };
		this.zoomCanvas(zoom, point);

		event.e.preventDefault();
		event.e.stopPropagation();
	}

	private zoomCanvas(zoom: number, point: { x: number, y: number }): void {
		const fabricPoint = new Point(point.x, point.y);
		this.canvas.zoomToPoint(fabricPoint, zoom);
		this.canvas.requestRenderAll();
	}

	private handleTouchStart(event: TouchEvent): void {
		if (!this.isPanMode) return;

		if (event.touches.length === 1) {
			this.dragCanvasStart(event.touches[0]);
		}

		if (event.touches.length === 2) {
			this.pinchCanvasStart(event);
		}
	}

	private handleTouchMove(event: TouchEvent): void {
		if (!this.isPanMode) return;

		event.preventDefault();

		if (event.touches.length === 1) {
			this.dragCanvas(event.touches[0]);
		}

		if (event.touches.length === 2) {
			this.pinchCanvas(event);
		}
	}

	private pinchCanvasStart(event: TouchEvent): void {
		if (event.touches.length !== 2) return;
		this.initialDistance = this.getPinchDistance(event.touches[0], event.touches[1]);
	}

	private pinchCanvas(event: TouchEvent): void {
		if (event.touches.length !== 2) return;

		this.setPinchCenter(event.touches[0], event.touches[1]);
		if (!this.pinchCenter) return;

		const currentDistance = this.getPinchDistance(event.touches[0], event.touches[1]);
		let scale = parseFloat((currentDistance / this.initialDistance).toFixed(2));

		scale = 1 + (scale - 1) / 20;
		const zoom = scale * this.canvas.getZoom();
		const limitedZoom = Math.min(Math.max(zoom, this.minZoom), this.maxZoom);

		this.zoomCanvas(limitedZoom, this.pinchCenter);
	}

	private getPinchDistance(touch1: Touch, touch2: Touch): number {
		const coord = this.getPinchCoordinates(touch1, touch2);
		return Math.sqrt(Math.pow(coord.x2 - coord.x1, 2) + Math.pow(coord.y2 - coord.y1, 2));
	}

	private getPinchCoordinates(touch1: Touch, touch2: Touch): { x1: number, y1: number, x2: number, y2: number } {
		return {
			x1: touch1.clientX,
			y1: touch1.clientY,
			x2: touch2.clientX,
			y2: touch2.clientY,
		};
	}

	private setPinchCenter(touch1: Touch, touch2: Touch): void {
		const coord = this.getPinchCoordinates(touch1, touch2);
		const currentX = (coord.x1 + coord.x2) / 2;
		const currentY = (coord.y1 + coord.y2) / 2;

		this.pinchCenter = { x: currentX, y: currentY };
	}

	public resetZoom(): void {
		const center = {
			x: this.canvas.width! / 2,
			y: this.canvas.height! / 2
		};

		this.zoomCanvas(1, center);

		const vpt = this.canvas.viewportTransform;
		if (vpt) {
			vpt[4] = 0;
			vpt[5] = 0;
			this.canvas.setViewportTransform(vpt);
			this.canvas.requestRenderAll();
		}
	}

	public togglePanMode(): boolean {
		this.isPanMode = !this.isPanMode;

		if (this.isPanMode) {
			this.setToPanMode();
		} else {
			this.setToSelectMode();
		}

		return this.isPanMode;
	}

	private setToPanMode(): void {
		this.canvas.selection = false;
		this.canvas.skipTargetFind = true;
		this.canvas.defaultCursor = 'grab';
		this.canvas.discardActiveObject();
		this.canvas.requestRenderAll();
	}

	private setToSelectMode(): void {
		this.canvas.selection = true;
		this.canvas.skipTargetFind = false;
		this.canvas.defaultCursor = 'default';
		this.canvas.requestRenderAll();
	}

	public isPanModeActive(): boolean {
		return this.isPanMode;
	}

	public getCanvas(): Canvas {
		return this.canvas;
	}

	public zoomToLevel(zoomFactor: number, center: { x: number, y: number }): void {
		const limitedZoom = Math.min(Math.max(zoomFactor, this.minZoom), this.maxZoom);
		const fabricPoint = new Point(center.x, center.y);
		this.canvas.zoomToPoint(fabricPoint, limitedZoom);
		this.canvas.requestRenderAll();
	}

	public zoomToFit(): void {
		const containerEl = this.canvas.wrapperEl?.parentElement;
		if (!containerEl) return;

		const containerWidth = containerEl.clientWidth;
		const containerHeight = containerEl.clientHeight;
		if (containerWidth <= 0 || containerHeight <= 0) return;

		const canvasWidth = this.canvas.width ?? 1;
		const canvasHeight = this.canvas.height ?? 1;
		if (canvasWidth <= 0 || canvasHeight <= 0) return;

		const padding = 20;
		const availableWidth = containerWidth - padding;
		const availableHeight = containerHeight - padding;

		const scaleX = availableWidth / canvasWidth;
		const scaleY = availableHeight / canvasHeight;
		const scale = Math.min(scaleX, scaleY);

		const limitedZoom = Math.min(Math.max(scale, this.minZoom), this.maxZoom);
		const center = this.canvas.getCenterPoint();
		this.zoomToLevel(limitedZoom, center);

		this.centerCanvas();
	}

	private centerCanvas(): void {
		if (!this.canvas.wrapperEl) return;

		const vpt = this.canvas.viewportTransform;
		if (!vpt) return;

		const containerRect = this.canvas.wrapperEl.parentElement?.getBoundingClientRect();
		if (!containerRect) return;

		const canvasWidth = this.canvas.width || 1920;
		const canvasHeight = this.canvas.height || 1080;
		const zoom = this.canvas.getZoom();

		const scaledWidth = canvasWidth * zoom;
		const scaledHeight = canvasHeight * zoom;

		const offsetX = (containerRect.width - scaledWidth) / 2;
		const offsetY = (containerRect.height - scaledHeight) / 2;

		vpt[4] = offsetX;
		vpt[5] = offsetY;

		this.canvas.setViewportTransform(vpt);
		this.canvas.requestRenderAll();
	}
}
