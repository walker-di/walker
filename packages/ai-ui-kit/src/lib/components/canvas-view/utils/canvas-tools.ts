import { Textbox, Rect, Circle, FabricImage, Triangle, Path, Line, type Canvas } from "fabric";

export function addText(canvas: Canvas, text: string = 'Text') {
	const objectCount = canvas.getObjects().length;
	const objectName = `Text ${objectCount + 1}`;

	const textWidth = 200;
	const textHeight = 50;
	const maxLeft = Math.max(0, canvas.width - textWidth);
	const maxTop = Math.max(0, canvas.height - textHeight);

	const textbox = new Textbox(text, {
		left: Math.min(100, maxLeft),
		top: Math.min(100, maxTop),
		fill: '#2c3e50',
		fontSize: 24,
		width: textWidth,
		name: objectName
	});

	textbox.set('name', objectName);
	canvas.add(textbox);
	canvas.setActiveObject(textbox);
	canvas.renderAll();
}

export function addRectangle(canvas: Canvas) {
	const objectCount = canvas.getObjects().length;
	const objectName = `Rectangle ${objectCount + 1}`;

	const rectWidth = 200;
	const rectHeight = 150;
	const maxLeft = Math.max(0, canvas.width - rectWidth);
	const maxTop = Math.max(0, canvas.height - rectHeight);

	const rect = new Rect({
		left: Math.min(100, maxLeft),
		top: Math.min(100, maxTop),
		width: rectWidth,
		height: rectHeight,
		fill: '#3498db',
		stroke: '#2980b9',
		strokeWidth: 2,
		name: objectName
	});

	rect.set('name', objectName);
	canvas.add(rect);
	canvas.setActiveObject(rect);
	canvas.renderAll();
}

export function addCircle(canvas: Canvas) {
	const objectCount = canvas.getObjects().length;
	const objectName = `Circle ${objectCount + 1}`;

	const radius = 75;
	const maxLeft = Math.max(0, canvas.width - radius * 2);
	const maxTop = Math.max(0, canvas.height - radius * 2);

	const circle = new Circle({
		left: Math.min(100, maxLeft),
		top: Math.min(100, maxTop),
		radius: radius,
		fill: '#e74c3c',
		stroke: '#c0392b',
		strokeWidth: 2,
		name: objectName
	});

	circle.set('name', objectName);
	canvas.add(circle);
	canvas.setActiveObject(circle);
	canvas.renderAll();
}

export async function addImageFromUrl(canvas: Canvas, url: string) {
	try {
		const objectCount = canvas.getObjects().length;
		const objectName = `Image ${objectCount + 1}`;

		const img = await FabricImage.fromURL(url, { crossOrigin: "anonymous" });

		// Scale image to fit within canvas if it's too large
		const maxWidth = canvas.width * 0.5;
		const maxHeight = canvas.height * 0.5;

		if (img.width > maxWidth || img.height > maxHeight) {
			const scaleX = maxWidth / img.width;
			const scaleY = maxHeight / img.height;
			const scale = Math.min(scaleX, scaleY);

			img.set({
				scaleX: scale,
				scaleY: scale
			});
		}

		img.set({
			left: 100,
			top: 100,
			name: objectName
		});

		canvas.add(img);
		canvas.setActiveObject(img);
		canvas.renderAll();
	} catch (error) {
		console.error('Error adding image:', error);
		throw error;
	}
}

export function deleteSelected(canvas: Canvas) {
	const activeObject = canvas.getActiveObject();
	if (activeObject) {
		canvas.remove(activeObject);
		canvas.renderAll();
	}
}

export function clearCanvas(canvas: Canvas) {
	canvas.clear();
	canvas.backgroundColor = '#f0f0f0';
	canvas.renderAll();
}

export function duplicateSelected(canvas: Canvas) {
	const activeObject = canvas.getActiveObject();
	if (activeObject) {
		activeObject.clone((cloned: any) => {
			cloned.set({
				left: cloned.left + 20,
				top: cloned.top + 20,
				name: `${cloned.name || 'Object'} Copy`
			});
			canvas.add(cloned);
			canvas.setActiveObject(cloned);
			canvas.renderAll();
		});
	}
}

export function bringToFront(canvas: Canvas) {
	const activeObject = canvas.getActiveObject();
	if (activeObject) {
		canvas.bringToFront(activeObject);
		canvas.renderAll();
	}
}

export function sendToBack(canvas: Canvas) {
	const activeObject = canvas.getActiveObject();
	if (activeObject) {
		canvas.sendToBack(activeObject);
		canvas.renderAll();
	}
}

export function setBackgroundColor(canvas: Canvas, color: string) {
	canvas.backgroundColor = color;
	canvas.renderAll();
}

export async function setBackgroundImage(canvas: Canvas, url: string) {
	try {
		const img = await FabricImage.fromURL(url, { crossOrigin: "anonymous" });

		const canvasWidth = canvas.width;
		const canvasHeight = canvas.height;
		const scaleX = canvasWidth / img.width;
		const scaleY = canvasHeight / img.height;
		const scale = Math.min(scaleX, scaleY);

		img.set({
			scaleX: scale,
			scaleY: scale,
			originX: "left",
			originY: "top",
		});

		canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
	} catch (error) {
		console.error('Error setting background image:', error);
		throw error;
	}
}

export function removeBackgroundImage(canvas: Canvas) {
	canvas.backgroundImage = undefined;
	canvas.renderAll();
}

export function addTriangle(canvas: Canvas) {
	const objectCount = canvas.getObjects().length;
	const objectName = `Triangle ${objectCount + 1}`;

	const triangleWidth = 100;
	const triangleHeight = 100;
	const maxLeft = Math.max(0, canvas.width - triangleWidth);
	const maxTop = Math.max(0, canvas.height - triangleHeight);

	const triangle = new Triangle({
		left: Math.min(100, maxLeft),
		top: Math.min(100, maxTop),
		fill: '#9b59b6',
		width: triangleWidth,
		height: triangleHeight,
		strokeWidth: 2,
		stroke: '#8e44ad',
		name: objectName
	});

	triangle.set('name', objectName);
	canvas.add(triangle);
	canvas.setActiveObject(triangle);
	canvas.renderAll();
}

export function addStar(canvas: Canvas) {
	const objectCount = canvas.getObjects().length;
	const objectName = `Star ${objectCount + 1}`;

	const starSize = 100;
	const maxLeft = Math.max(0, canvas.width - starSize);
	const maxTop = Math.max(0, canvas.height - starSize);

	// Create a 5-pointed star using a path
	const pathData = createStarPath(5, starSize / 2, starSize / 4);

	const star = new Path(pathData, {
		left: Math.min(100, maxLeft),
		top: Math.min(100, maxTop),
		fill: '#f1c40f',
		stroke: '#f39c12',
		strokeWidth: 2,
		name: objectName
	});

	star.set('name', objectName);
	canvas.add(star);
	canvas.setActiveObject(star);
	canvas.renderAll();
}

export function addLine(canvas: Canvas) {
	const objectCount = canvas.getObjects().length;
	const objectName = `Line ${objectCount + 1}`;

	const lineLength = 200;
	const maxLeft = Math.max(0, canvas.width - lineLength);
	const maxTop = Math.max(0, canvas.height - 50);

	const line = new Line([0, 0, lineLength, 0], {
		left: Math.min(100, maxLeft),
		top: Math.min(100, maxTop),
		stroke: '#2c3e50',
		strokeWidth: 3,
		name: objectName
	});

	line.set('name', objectName);
	canvas.add(line);
	canvas.setActiveObject(line);
	canvas.renderAll();
}

export function addArrow(canvas: Canvas) {
	const objectCount = canvas.getObjects().length;
	const objectName = `Arrow ${objectCount + 1}`;

	const arrowLength = 150;
	const maxLeft = Math.max(0, canvas.width - arrowLength);
	const maxTop = Math.max(0, canvas.height - 50);

	// Create arrow path
	const pathData = `M 0 0 L ${arrowLength - 20} 0 L ${arrowLength - 30} -10 L ${arrowLength} 0 L ${arrowLength - 30} 10 L ${arrowLength - 20} 0`;

	const arrow = new Path(pathData, {
		left: Math.min(100, maxLeft),
		top: Math.min(100, maxTop),
		fill: '#e74c3c',
		stroke: '#c0392b',
		strokeWidth: 2,
		name: objectName
	});

	arrow.set('name', objectName);
	canvas.add(arrow);
	canvas.setActiveObject(arrow);
	canvas.renderAll();
}

// Helper function to create a star path
function createStarPath(spikes: number, outerRadius: number, innerRadius: number) {
	const path = [];
	const angleStep = Math.PI / spikes;
	const center = outerRadius;

	path.push('M');

	for (let i = 0; i < spikes * 2; i++) {
		const radius = i % 2 === 0 ? outerRadius : innerRadius;
		const angle = i * angleStep - Math.PI / 2;
		const x = center + radius * Math.cos(angle);
		const y = center + radius * Math.sin(angle);

		path.push(x, y);
	}

	path.push('z');
	return path.join(' ');
}
