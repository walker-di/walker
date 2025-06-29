import type { Canvas } from "fabric";
import { CanvasService } from "./services/canvas-service.svelte.js";
import { CanvasZoomPan } from "./services/canvas-zoom-pan.svelte.js";
import type { CanvasViewProps, CanvasObject } from "./types/canvas.js";

export class CanvasViewModel {
	// Canvas instances
	canvasService = $state<CanvasService>(undefined as any);
	canvas = $state<Canvas>(undefined as any);
	canvasZoomPan = $state<CanvasZoomPan>(undefined as any);

	// State
	selectedObject = $state<any>(null);
	isLoading = $state(false);
	canvasLayers = $state<CanvasObject[]>([]);

	// Props
	private props: CanvasViewProps;
	private canvasElement: HTMLCanvasElement | null = null;

	constructor(props: CanvasViewProps) {
		this.props = props;
	}

	async initialize(canvasElement: HTMLCanvasElement) {
		this.canvasElement = canvasElement;
		this.isLoading = true;

		try {
			// Initialize canvas service
			this.canvasService = new CanvasService(canvasElement, {
				width: this.props.width,
				height: this.props.height,
				backgroundColor: this.props.backgroundColor
			});

			this.canvas = this.canvasService.canvas;
			this.canvasZoomPan = new CanvasZoomPan(this.canvas);

			// Load initial canvas data if provided
			if (this.props.canvasDataJson) {
				await this.loadCanvasData(this.props.canvasDataJson);
			}

			// Set up event listeners
			this.setupEventListeners();

			this.isLoading = false;
		} catch (error) {
			console.error("Error initializing canvas:", error);
			this.isLoading = false;
		}
	}

	private setupEventListeners() {
		if (!this.canvas) return;

		// Canvas change events
		this.canvas.on("object:modified", () => {
			if (!this.isLoading) {
				this.saveCanvas();
			}
		});

		this.canvas.on("object:added", () => {
			if (!this.isLoading) {
				this.saveCanvas();
				this.updateLayers();
			}
		});

		this.canvas.on("object:removed", () => {
			if (!this.isLoading) {
				this.saveCanvas();
				this.updateLayers();
			}
		});

		// Selection events
		this.canvas.on("selection:created", this.updateSelection.bind(this));
		this.canvas.on("selection:updated", this.updateSelection.bind(this));
		this.canvas.on("selection:cleared", this.clearSelection.bind(this));

		// Object movement constraints
		this.canvas.on("object:moving", (e: any) => {
			if (!e.target) return;

			const obj = e.target;
			const objBounds = obj.getBoundingRect();

			// Keep objects within canvas bounds
			if (objBounds.left < 0) {
				obj.left = obj.left - objBounds.left + 1;
			}
			if (objBounds.top < 0) {
				obj.top = obj.top - objBounds.top + 1;
			}
			if (objBounds.left + objBounds.width > this.canvas.width) {
				obj.left = this.canvas.width - objBounds.width + (obj.left - objBounds.left) - 1;
			}
			if (objBounds.top + objBounds.height > this.canvas.height) {
				obj.top = this.canvas.height - objBounds.height + (obj.top - objBounds.top) - 1;
			}
		});

		this.canvas.on("object:moved", () => {
			if (!this.isLoading) {
				this.saveCanvas();
			}
		});
	}

	private updateSelection(e: any) {
		this.selectedObject = e.selected?.[0] || null;
	}

	private clearSelection() {
		this.selectedObject = null;
	}

	private updateLayers() {
		if (!this.canvas) return;

		const objects = this.canvas.getObjects();
		this.canvasLayers = objects.map((obj: any, index: number) => {
			if (!obj.id) {
				obj.id = `layer-${index}-${Date.now()}`;
			}

			const layerName = obj.name || `Layer ${index + 1}`;
			if (!obj.name) {
				obj.set("name", layerName);
			}

			return {
				id: obj.id,
				name: layerName,
				type: obj.type || "unknown",
				object: obj,
			};
		});
	}

	async loadCanvasData(canvasJson: string = "{}") {
		if (!this.canvas) return;

		this.isLoading = true;
		try {
			await this.canvas.loadFromJSON(canvasJson);
			this.canvasZoomPan.zoomToFit();
			this.canvas.renderAll();
			this.updateLayers();
		} catch (error) {
			console.error("Error loading canvas data:", error);
		} finally {
			this.isLoading = false;
		}
	}

	private saveCanvas() {
		if (!this.canvas || this.isLoading) return;

		try {
			const objects = this.canvas.getObjects();
			objects.forEach((obj: any, index: number) => {
				if (!obj.name) {
					const defaultName = `Layer ${index + 1}`;
					obj.name = defaultName;
					obj.set("name", defaultName);
				}
				obj.setCoords();
			});

			const canvasJson = this.canvas.toJSON();
			if (!canvasJson.objects) {
				canvasJson.objects = [];
			}

			// Filter out any invalid objects
			canvasJson.objects = canvasJson.objects.filter((obj: any) => {
				return obj && obj.type;
			});

			const json = JSON.stringify(canvasJson);
			this.props.onCanvasChange?.(json);
			this.canvas.renderAll();
		} catch (error) {
			console.error("Error saving canvas state:", error);
		}
	}

	// Public methods
	hasSelectedObject(): boolean {
		return !!this.selectedObject;
	}

	deleteSelected() {
		if (!this.canvas || !this.selectedObject) return;
		this.canvas.remove(this.selectedObject);
		this.selectedObject = null;
		this.saveCanvas();
	}

	clearCanvas() {
		if (!this.canvas) return;
		this.canvas.clear();
		this.canvas.backgroundColor = this.props.backgroundColor || "#f0f0f0";
		this.canvas.renderAll();
		this.saveCanvas();
	}

	resizeCanvas(width: number, height: number) {
		if (!this.canvasService) return;
		this.canvasService.resize(width, height);
		this.saveCanvas();
	}

	async exportCanvas(format: "png" | "jpeg" | "svg" = "png") {
		if (!this.canvasService) return null;
		return await this.canvasService.export(format);
	}

	async downloadCanvas(format: "png" | "jpeg" | "svg" = "png") {
		if (!this.canvasService) return;
		await this.canvasService.download(format);
	}

	getCurrentCanvasJson(): string {
		if (!this.canvas) return "{}";

		const objects = this.canvas.getObjects();
		objects.forEach((obj: any, index: number) => {
			if (!obj.name) {
				const defaultName = `Layer ${index + 1}`;
				obj.name = defaultName;
				obj.set("name", defaultName);
			}
		});

		const canvasJson = this.canvas.toJSON();
		return JSON.stringify(canvasJson);
	}

	dispose() {
		if (this.canvasService) {
			this.canvasService.dispose();
		}
	}
}
