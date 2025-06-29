# Canvas View Component

A powerful, interactive canvas component built with Fabric.js and Svelte 5, designed for creating and editing visual content with drawing tools, shapes, text, and images.

## Features

- **Drawing Tools**: Add text, rectangles, circles, and images
- **Interactive Controls**: Pan, zoom, select, and edit objects
- **Responsive Design**: Adapts to container size with automatic fitting
- **Export Capabilities**: Export canvas as PNG, JPEG, or SVG
- **Real-time Updates**: Automatic canvas state management and change detection
- **Touch Support**: Full touch and gesture support for mobile devices
- **Keyboard Shortcuts**: Standard shortcuts for common operations

## Installation

The CanvasView component is part of the ai-ui-kit package:

```bash
npm install ai-ui-kit fabric
```

## Basic Usage

```svelte
<script>
  import { CanvasView } from 'ai-ui-kit';
  
  let canvasRef;
  
  function handleCanvasChange(json) {
    console.log('Canvas updated:', json);
  }
</script>

<CanvasView
  bind:this={canvasRef}
  width={1920}
  height={1080}
  backgroundColor="#f0f0f0"
  onCanvasChange={handleCanvasChange}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `canvasDataJson` | `string` | `undefined` | Initial canvas data as JSON string |
| `onCanvasChange` | `(json: string) => void` | `undefined` | Callback when canvas data changes |
| `hideControls` | `boolean` | `false` | Hide the canvas toolbar |
| `width` | `number` | `1920` | Canvas width in pixels |
| `height` | `number` | `1080` | Canvas height in pixels |
| `backgroundColor` | `string` | `"#f0f0f0"` | Canvas background color |
| `class` | `string` | `""` | Custom CSS class for container |

## Methods

The component exposes several methods through template refs:

```svelte
<script>
  let canvasRef;
  
  // Export canvas as image
  async function exportImage() {
    const dataUrl = await canvasRef.exportCanvas('png');
    // Use dataUrl...
  }
  
  // Clear the canvas
  function clear() {
    canvasRef.clearCanvas();
  }
  
  // Load canvas data
  function loadData(jsonData) {
    canvasRef.loadCanvasData(jsonData);
  }
</script>
```

### Available Methods

- `hasSelectedObject(): boolean` - Check if an object is selected
- `deleteSelected()` - Delete the currently selected object
- `clearCanvas()` - Clear all objects from canvas
- `resizeCanvas(width: number, height: number)` - Resize the canvas
- `exportCanvas(format?: 'png' | 'jpeg' | 'svg'): Promise<string>` - Export canvas as image
- `downloadCanvas(format?: 'png' | 'jpeg' | 'svg')` - Download canvas as file
- `getCurrentCanvasJson(): string` - Get current canvas state as JSON
- `loadCanvasData(json: string)` - Load canvas from JSON data
- `getCanvasInstance()` - Get the underlying Fabric.js canvas instance

## Toolbar Features

The built-in toolbar provides:

- **Text Tool**: Add editable text boxes
- **Rectangle Tool**: Add rectangular shapes
- **Circle Tool**: Add circular shapes  
- **Image Tool**: Add images from URL
- **Delete Tool**: Remove selected objects
- **Clear Tool**: Clear entire canvas
- **Pan Mode**: Toggle between select and pan modes
- **Zoom Controls**: Zoom in, out, and fit to view
- **Export Tool**: Download canvas as image

## Canvas Tools

You can also use the canvas tools programmatically:

```svelte
<script>
  import { addText, addRectangle, addCircle, addImageFromUrl } from 'ai-ui-kit';
  
  let canvasRef;
  
  function addCustomText() {
    const canvas = canvasRef.getCanvasInstance();
    addText(canvas, 'Custom text');
  }
  
  function addCustomShape() {
    const canvas = canvasRef.getCanvasInstance();
    addRectangle(canvas);
  }
</script>
```

## Styling

The component uses Tailwind CSS classes and can be customized:

```svelte
<CanvasView
  class="border rounded-lg shadow-lg"
  backgroundColor="#ffffff"
/>
```

## Advanced Usage

### Custom Canvas Configuration

```svelte
<script>
  import { CanvasView } from 'ai-ui-kit';
  
  let canvasRef;
  
  function setupCustomCanvas() {
    const canvas = canvasRef.getCanvasInstance();
    
    // Configure custom settings
    canvas.selection = true;
    canvas.preserveObjectStacking = true;
    
    // Add custom event listeners
    canvas.on('object:selected', (e) => {
      console.log('Object selected:', e.target);
    });
  }
</script>

<CanvasView bind:this={canvasRef} onMount={setupCustomCanvas} />
```

### Saving and Loading

```svelte
<script>
  let canvasRef;
  let savedData = '';
  
  function saveCanvas() {
    savedData = canvasRef.getCurrentCanvasJson();
    localStorage.setItem('canvas-data', savedData);
  }
  
  function loadCanvas() {
    const data = localStorage.getItem('canvas-data');
    if (data) {
      canvasRef.loadCanvasData(data);
    }
  }
</script>
```

## Browser Support

- Modern browsers with ES2020+ support
- Canvas API support required
- Touch events for mobile devices

## Dependencies

- `fabric` - Canvas manipulation library
- `lucide-svelte` - Icons
- Tailwind CSS - Styling

## License

Part of the ai-ui-kit package. See package license for details.
