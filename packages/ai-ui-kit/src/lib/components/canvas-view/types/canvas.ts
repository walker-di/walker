import type { Canvas } from "fabric";

export interface CanvasViewProps {
	/**
	 * Initial canvas data as JSON string
	 */
	canvasDataJson?: string;

	/**
	 * Callback when canvas data changes
	 */
	onCanvasChange?: (canvasJson: string) => void;

	/**
	 * Hide canvas controls (toolbar, sidebar)
	 */
	hideControls?: boolean;

	/**
	 * Show sidebar with tools and options
	 */
	showSidebar?: boolean;

	/**
	 * Show header with advanced controls
	 */
	showHeader?: boolean;

	/**
	 * Canvas width
	 */
	width?: number;

	/**
	 * Canvas height
	 */
	height?: number;

	/**
	 * Canvas background color
	 */
	backgroundColor?: string;

	/**
	 * Enable/disable drawing mode
	 */
	drawingMode?: boolean;

	/**
	 * Custom CSS class for the canvas container
	 */
	class?: string;
}

export interface CanvasToolProps {
	canvas: Canvas;
	canvasService: any; // Will be typed properly when we create the service
}

export interface CanvasObject {
	id: string;
	name: string;
	type: string;
	object: any;
}

export interface CanvasLayer {
	id: string;
	name: string;
	type: string;
	object: any;
	visible: boolean;
	locked: boolean;
}
