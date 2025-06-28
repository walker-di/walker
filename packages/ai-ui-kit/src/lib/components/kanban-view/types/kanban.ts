// Re-export schema types for convenience
export type {
	KanbanCategory,
	KanbanCard,
	KanbanColumn,
	KanbanBoard,
	DragPosition,
	DragEvent,
	KanbanViewProps,
	CardForm,
	ColumnForm
} from '../schemas/kanban.js';

/**
 * Props interface for the KanbanView component
 */
export interface KanbanViewProps {
	board?: KanbanBoard;
	columns?: KanbanColumn[];
	categories?: KanbanCategory[];
	maxColumns?: number;
	allowAddColumn?: boolean;
	allowRemoveColumn?: boolean;
	allowAddCard?: boolean;
	allowRemoveCard?: boolean;
	allowEditCard?: boolean;
	allowDragCard?: boolean;
	allowDragColumn?: boolean;
	showCardCount?: boolean;
	showColumnActions?: boolean;
	theme?: 'light' | 'dark';
	locale?: string;

	// Event handlers
	onCardAdd?: (columnId: string, card: Partial<KanbanCard>) => void;
	onCardRemove?: (columnId: string, cardId: string) => void;
	onCardUpdate?: (columnId: string, cardId: string, updates: Partial<KanbanCard>) => void;
	onCardMove?: (event: DragEvent) => void;
	onColumnAdd?: (column: Partial<KanbanColumn>) => void;
	onColumnRemove?: (columnId: string) => void;
	onColumnUpdate?: (columnId: string, updates: Partial<KanbanColumn>) => void;
	onColumnMove?: (sourceIndex: number, targetIndex: number) => void;
	onBoardUpdate?: (updates: Partial<KanbanBoard>) => void;
}

/**
 * Props interface for the KanbanCard component
 */
export interface KanbanCardProps {
	card: KanbanCard;
	columnId: string;
	index: number;
	allowEdit?: boolean;
	allowRemove?: boolean;
	allowDrag?: boolean;
	categories?: KanbanCategory[];
	
	// Event handlers
	onUpdate?: (updates: Partial<KanbanCard>) => void;
	onRemove?: () => void;
	onDragStart?: (event: DragEvent) => void;
	onDragEnd?: (event: DragEvent) => void;
	onMoveUp?: () => void;
	onMoveDown?: () => void;
}

/**
 * Props interface for the KanbanColumn component
 */
export interface KanbanColumnProps {
	column: KanbanColumn;
	index: number;
	categories?: KanbanCategory[];
	allowAddCard?: boolean;
	allowRemoveColumn?: boolean;
	allowEditColumn?: boolean;
	allowDragCard?: boolean;
	showCardCount?: boolean;
	showActions?: boolean;
	
	// Event handlers
	onCardAdd?: (card: Partial<KanbanCard>) => void;
	onCardUpdate?: (cardId: string, updates: Partial<KanbanCard>) => void;
	onCardRemove?: (cardId: string) => void;
	onCardMove?: (event: DragEvent) => void;
	onColumnUpdate?: (updates: Partial<KanbanColumn>) => void;
	onColumnRemove?: () => void;
	onColumnMove?: (direction: 'left' | 'right') => void;
}

/**
 * Internal drag state interface
 */
export interface DragState {
	isDragging: boolean;
	draggedCard: KanbanCard | null;
	sourcePosition: DragPosition | null;
	targetPosition: DragPosition | null;
	dragOffset: { x: number; y: number };
	dragElement: HTMLElement | null;
}

/**
 * Kanban view model state interface
 */
export interface KanbanViewModelState {
	board: KanbanBoard | null;
	columns: KanbanColumn[];
	categories: KanbanCategory[];
	dragState: DragState;
	editingCard: { columnId: string; cardId: string } | null;
	editingColumn: string | null;
}

/**
 * Default category definitions
 */
export interface DefaultCategories {
	new: KanbanCategory;
	important: KanbanCategory;
	task: KanbanCategory;
	personal: KanbanCategory;
	work: KanbanCategory;
}

/**
 * Localization strings interface
 */
export interface KanbanLocale {
	addCard: string;
	addColumn: string;
	newCard: string;
	newColumn: string;
	removeCard: string;
	removeColumn: string;
	editCard: string;
	editColumn: string;
	saveChanges: string;
	cancel: string;
	title: string;
	description: string;
	category: string;
	assignee: string;
	priority: string;
	dueDate: string;
	tags: string;
	moveUp: string;
	moveDown: string;
	moveLeft: string;
	moveRight: string;
	cardCount: string;
	categories: {
		new: string;
		important: string;
		task: string;
		personal: string;
		work: string;
	};
	priorities: {
		low: string;
		medium: string;
		high: string;
	};
}

/**
 * Theme configuration interface
 */
export interface KanbanTheme {
	colors: {
		background: string;
		surface: string;
		border: string;
		text: {
			primary: string;
			secondary: string;
			muted: string;
		};
		column: {
			background: string;
			border: string;
			header: string;
		};
		card: {
			background: string;
			border: string;
			shadow: string;
		};
		button: {
			primary: string;
			secondary: string;
			danger: string;
		};
	};
	spacing: {
		xs: string;
		sm: string;
		md: string;
		lg: string;
		xl: string;
	};
	borderRadius: {
		sm: string;
		md: string;
		lg: string;
	};
}
