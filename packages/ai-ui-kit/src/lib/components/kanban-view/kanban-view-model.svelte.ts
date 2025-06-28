import type {
	KanbanBoard,
	KanbanColumn,
	KanbanCard,
	KanbanCategory,
	KanbanViewProps,
	DragEvent,
	DragPosition
} from './types/kanban.js';

import {
	createBoard,
	createColumn,
	createCard,
	createDefaultCategories,
	updateCard,
	removeCard,
	addCard,
	reorderColumns,
	getDefaultLocale
} from './utils/kanban-utils.js';

import type { DndEvent } from 'svelte-dnd-action';

/**
 * Kanban View Model - manages state and business logic for the kanban board
 * Uses Svelte 5 runes for reactive state management
 */
export class KanbanViewModel {
	// Reactive state using Svelte 5 runes
	board = $state<KanbanBoard | null>(null);
	columns = $state<KanbanColumn[]>([]);
	categories = $state<KanbanCategory[]>([]);

	// UI state
	editingCard = $state<{ columnId: string; cardId: string } | null>(null);
	editingColumn = $state<string | null>(null);
	showAddCardForm = $state<string | null>(null); // columnId
	showAddColumnForm = $state<boolean>(false);

	// Drag and drop configuration
	flipDurationMs = 200;

	// Props reference
	private props: KanbanViewProps;
	private locale = getDefaultLocale();

	constructor(props: KanbanViewProps) {
		this.props = props;
		this.initializeBoard();
	}

	/**
	 * Update props and reinitialize if needed
	 */
	updateProps(props: KanbanViewProps) {
		this.props = props;
		this.initializeBoard();
	}

	/**
	 * Initialize the kanban board with default data or props data
	 */
	private initializeBoard() {
		// Initialize categories
		if (this.props.categories && this.props.categories.length > 0) {
			this.categories = [...this.props.categories];
		} else {
			this.categories = Object.values(createDefaultCategories());
		}

		// Initialize board and columns
		if (this.props.board) {
			this.board = this.props.board;
			this.columns = this.props.board.columns;
		} else if (this.props.columns && this.props.columns.length > 0) {
			this.columns = [...this.props.columns];
		} else {
			// Create default board with sample data
			const defaultBoard = createBoard('My Kanban Board');
			this.board = defaultBoard;
			this.columns = defaultBoard.columns;

			// Add some sample cards
			this.addSampleCards();
		}
	}

	/**
	 * Add sample cards for demonstration
	 */
	private addSampleCards() {
		if (this.columns.length > 0 && this.categories.length > 0) {
			const todoColumn = this.columns[0];
			const sampleCard = createCard(
				'Welcome to Kanban!',
				todoColumn.id,
				this.categories[0],
				'This is a sample card. You can edit, move, or delete it.'
			);

			this.columns[0] = addCard(todoColumn, sampleCard);
		}
	}

	/**
	 * Handle card drag consider (during drag)
	 */
	handleCardDragConsider(columnId: string, event: CustomEvent<DndEvent<KanbanCard>>) {
		const columnIndex = this.columns.findIndex(col => col.id === columnId);
		if (columnIndex === -1) return;

		this.columns[columnIndex] = {
			...this.columns[columnIndex],
			cards: event.detail.items
		};
	}

	/**
	 * Handle card drag finalize (drop)
	 */
	handleCardDragFinalize(columnId: string, event: CustomEvent<DndEvent<KanbanCard>>) {
		const columnIndex = this.columns.findIndex(col => col.id === columnId);
		if (columnIndex === -1) return;

		this.columns[columnIndex] = {
			...this.columns[columnIndex],
			cards: event.detail.items
		};

		// Notify parent component about the card move
		this.props.onCardMove?.({
			cardId: event.detail.info?.id || '',
			sourcePosition: { columnId, cardIndex: 0 }, // svelte-dnd-action handles the details
			targetPosition: { columnId, cardIndex: 0 }
		});

		this.updateBoard();
	}

	/**
	 * Handle column drag consider (during drag)
	 */
	handleColumnDragConsider(event: CustomEvent<DndEvent<KanbanColumn>>) {
		this.columns = event.detail.items;
	}

	/**
	 * Handle column drag finalize (drop)
	 */
	handleColumnDragFinalize(event: CustomEvent<DndEvent<KanbanColumn>>) {
		this.columns = event.detail.items;
		this.props.onColumnMove?.(0, 0); // svelte-dnd-action handles the details
		this.updateBoard();
	}

	/**
	 * Add a new card to a column
	 */
	addCard(columnId: string, cardData: Partial<KanbanCard>) {
		const column = this.columns.find(col => col.id === columnId);
		if (!column) return;

		const newCard = createCard(
			cardData.title || 'New Card',
			columnId,
			cardData.category || this.categories[0],
			cardData.description
		);

		const columnIndex = this.columns.findIndex(col => col.id === columnId);
		this.columns[columnIndex] = addCard(column, newCard);

		this.props.onCardAdd?.(columnId, newCard);
		this.updateBoard();
		this.showAddCardForm = null;
	}

	/**
	 * Update a card
	 */
	updateCardData(columnId: string, cardId: string, updates: Partial<KanbanCard>) {
		const columnIndex = this.columns.findIndex(col => col.id === columnId);
		if (columnIndex === -1) return;

		this.columns[columnIndex] = updateCard(this.columns[columnIndex], cardId, updates);
		this.props.onCardUpdate?.(columnId, cardId, updates);
		this.updateBoard();
		this.editingCard = null;
	}

	/**
	 * Remove a card
	 */
	removeCardData(columnId: string, cardId: string) {
		const columnIndex = this.columns.findIndex(col => col.id === columnId);
		if (columnIndex === -1) return;

		this.columns[columnIndex] = removeCard(this.columns[columnIndex], cardId);
		this.props.onCardRemove?.(columnId, cardId);
		this.updateBoard();
	}

	/**
	 * Add a new column
	 */
	addColumn(columnData: Partial<KanbanColumn>) {
		if (this.columns.length >= (this.props.maxColumns || 10)) return;

		const newColumn = createColumn(
			columnData.title || 'New Column',
			this.columns.length
		);

		this.columns = [...this.columns, newColumn];
		this.props.onColumnAdd?.(newColumn);
		this.updateBoard();
		this.showAddColumnForm = false;
	}

	/**
	 * Update a column
	 */
	updateColumnData(columnId: string, updates: Partial<KanbanColumn>) {
		const columnIndex = this.columns.findIndex(col => col.id === columnId);
		if (columnIndex === -1) return;

		this.columns[columnIndex] = { ...this.columns[columnIndex], ...updates };
		this.props.onColumnUpdate?.(columnId, updates);
		this.updateBoard();
		this.editingColumn = null;
	}

	/**
	 * Remove a column
	 */
	removeColumnData(columnId: string) {
		this.columns = this.columns.filter(col => col.id !== columnId);
		this.props.onColumnRemove?.(columnId);
		this.updateBoard();
	}

	/**
	 * Move column left or right
	 */
	moveColumn(columnId: string, direction: 'left' | 'right') {
		const currentIndex = this.columns.findIndex(col => col.id === columnId);
		if (currentIndex === -1) return;

		const targetIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
		if (targetIndex < 0 || targetIndex >= this.columns.length) return;

		this.columns = reorderColumns(this.columns, currentIndex, targetIndex);
		this.props.onColumnMove?.(currentIndex, targetIndex);
		this.updateBoard();
	}

	/**
	 * Update the board with current columns
	 */
	private updateBoard() {
		if (this.board) {
			this.board = {
				...this.board,
				columns: this.columns,
				updatedAt: new Date()
			};
			this.props.onBoardUpdate?.(this.board);
		}
	}

	/**
	 * Toggle card editing mode
	 */
	toggleCardEdit(columnId: string, cardId: string) {
		if (this.editingCard?.columnId === columnId && this.editingCard?.cardId === cardId) {
			this.editingCard = null;
		} else {
			this.editingCard = { columnId, cardId };
		}
	}

	/**
	 * Toggle column editing mode
	 */
	toggleColumnEdit(columnId: string) {
		if (this.editingColumn === columnId) {
			this.editingColumn = null;
		} else {
			this.editingColumn = columnId;
		}
	}

	/**
	 * Toggle add card form
	 */
	toggleAddCardForm(columnId: string) {
		if (this.showAddCardForm === columnId) {
			this.showAddCardForm = null;
		} else {
			this.showAddCardForm = columnId;
		}
	}

	/**
	 * Cleanup method
	 */
	destroy() {
		// No custom cleanup needed for svelte-dnd-action
		// The library handles its own cleanup
	}
}
