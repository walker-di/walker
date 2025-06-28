import type { 
	KanbanCard, 
	KanbanColumn, 
	KanbanBoard, 
	KanbanCategory, 
	DragEvent,
	DefaultCategories,
	KanbanLocale
} from '../types/kanban.js';

/**
 * Generate a unique ID for kanban items
 */
export function generateId(): string {
	return crypto.randomUUID();
}

/**
 * Create default categories for kanban boards
 */
export function createDefaultCategories(): DefaultCategories {
	return {
		new: {
			id: generateId(),
			label: 'New',
			color: 'white',
			bgColor: '#0A99FF'
		},
		important: {
			id: generateId(),
			label: 'Important',
			color: 'white',
			bgColor: '#EA0B38'
		},
		task: {
			id: generateId(),
			label: 'Task',
			color: 'black',
			bgColor: '#00F5DC'
		},
		personal: {
			id: generateId(),
			label: 'Personal',
			color: 'white',
			bgColor: '#629387'
		},
		work: {
			id: generateId(),
			label: 'Work',
			color: 'black',
			bgColor: '#13F644'
		}
	};
}

/**
 * Create a new kanban card
 */
export function createCard(
	title: string,
	columnId: string,
	category?: KanbanCategory,
	description?: string
): KanbanCard {
	const defaultCategories = createDefaultCategories();
	
	return {
		id: generateId(),
		title,
		description: description || '',
		category: category || defaultCategories.new,
		date: new Date().toLocaleDateString(),
		empty: false,
		animate: false,
		tags: [],
		createdAt: new Date(),
		updatedAt: new Date()
	};
}

/**
 * Create a new kanban column
 */
export function createColumn(title: string, order: number): KanbanColumn {
	return {
		id: generateId(),
		title,
		cards: [],
		order,
		collapsed: false
	};
}

/**
 * Create a new kanban board
 */
export function createBoard(title: string, description?: string): KanbanBoard {
	const defaultCategories = createDefaultCategories();
	
	return {
		id: generateId(),
		title,
		description: description || '',
		columns: [
			createColumn('To Do', 0),
			createColumn('In Progress', 1),
			createColumn('Done', 2)
		],
		categories: Object.values(defaultCategories),
		createdAt: new Date(),
		updatedAt: new Date()
	};
}

/**
 * Move a card between columns
 */
export function moveCard(
	columns: KanbanColumn[],
	dragEvent: DragEvent
): KanbanColumn[] {
	const { cardId, sourcePosition, targetPosition } = dragEvent;
	
	// Find source column and card
	const sourceColumn = columns.find(col => col.id === sourcePosition.columnId);
	const targetColumn = columns.find(col => col.id === targetPosition.columnId);
	
	if (!sourceColumn || !targetColumn) {
		throw new Error('Source or target column not found');
	}
	
	const cardIndex = sourceColumn.cards.findIndex(card => card.id === cardId);
	if (cardIndex === -1) {
		throw new Error('Card not found in source column');
	}
	
	const card = sourceColumn.cards[cardIndex];
	
	// Create new columns array
	const newColumns = columns.map(col => {
		if (col.id === sourcePosition.columnId) {
			// Remove card from source column
			return {
				...col,
				cards: col.cards.filter(c => c.id !== cardId)
			};
		} else if (col.id === targetPosition.columnId) {
			// Add card to target column at specified index
			const newCards = [...col.cards];
			newCards.splice(targetPosition.cardIndex, 0, {
				...card,
				updatedAt: new Date()
			});
			return {
				...col,
				cards: newCards
			};
		}
		return col;
	});
	
	return newColumns;
}

/**
 * Move a card within the same column
 */
export function moveCardWithinColumn(
	column: KanbanColumn,
	cardId: string,
	newIndex: number
): KanbanColumn {
	const cardIndex = column.cards.findIndex(card => card.id === cardId);
	if (cardIndex === -1) {
		throw new Error('Card not found in column');
	}
	
	const card = column.cards[cardIndex];
	const newCards = [...column.cards];
	
	// Remove card from current position
	newCards.splice(cardIndex, 1);
	
	// Insert card at new position
	newCards.splice(newIndex, 0, {
		...card,
		updatedAt: new Date()
	});
	
	return {
		...column,
		cards: newCards
	};
}

/**
 * Update a card in a column
 */
export function updateCard(
	column: KanbanColumn,
	cardId: string,
	updates: Partial<KanbanCard>
): KanbanColumn {
	return {
		...column,
		cards: column.cards.map(card =>
			card.id === cardId
				? { ...card, ...updates, updatedAt: new Date() }
				: card
		)
	};
}

/**
 * Remove a card from a column
 */
export function removeCard(column: KanbanColumn, cardId: string): KanbanColumn {
	return {
		...column,
		cards: column.cards.filter(card => card.id !== cardId)
	};
}

/**
 * Add a card to a column
 */
export function addCard(column: KanbanColumn, card: KanbanCard): KanbanColumn {
	return {
		...column,
		cards: [...column.cards, card]
	};
}

/**
 * Reorder columns
 */
export function reorderColumns(
	columns: KanbanColumn[],
	sourceIndex: number,
	targetIndex: number
): KanbanColumn[] {
	const newColumns = [...columns];
	const [movedColumn] = newColumns.splice(sourceIndex, 1);
	newColumns.splice(targetIndex, 0, movedColumn);
	
	// Update order property
	return newColumns.map((column, index) => ({
		...column,
		order: index
	}));
}

/**
 * Get default locale strings
 */
export function getDefaultLocale(): KanbanLocale {
	return {
		addCard: 'Add Card',
		addColumn: 'Add Column',
		newCard: 'New Card',
		newColumn: 'New Column',
		removeCard: 'Remove Card',
		removeColumn: 'Remove Column',
		editCard: 'Edit Card',
		editColumn: 'Edit Column',
		saveChanges: 'Save Changes',
		cancel: 'Cancel',
		title: 'Title',
		description: 'Description',
		category: 'Category',
		assignee: 'Assignee',
		priority: 'Priority',
		dueDate: 'Due Date',
		tags: 'Tags',
		moveUp: 'Move Up',
		moveDown: 'Move Down',
		moveLeft: 'Move Left',
		moveRight: 'Move Right',
		cardCount: 'cards',
		categories: {
			new: 'New',
			important: 'Important',
			task: 'Task',
			personal: 'Personal',
			work: 'Work'
		},
		priorities: {
			low: 'Low',
			medium: 'Medium',
			high: 'High'
		}
	};
}

/**
 * Validate drag and drop operation
 */
export function validateDragOperation(
	columns: KanbanColumn[],
	dragEvent: DragEvent
): boolean {
	const { sourcePosition, targetPosition } = dragEvent;
	
	// Check if source and target columns exist
	const sourceColumn = columns.find(col => col.id === sourcePosition.columnId);
	const targetColumn = columns.find(col => col.id === targetPosition.columnId);
	
	if (!sourceColumn || !targetColumn) {
		return false;
	}
	
	// Check if source card index is valid
	if (sourcePosition.cardIndex < 0 || sourcePosition.cardIndex >= sourceColumn.cards.length) {
		return false;
	}
	
	// Check if target card index is valid
	if (targetPosition.cardIndex < 0 || targetPosition.cardIndex > targetColumn.cards.length) {
		return false;
	}
	
	// Check if target column has max cards limit
	if (targetColumn.maxCards && targetColumn.cards.length >= targetColumn.maxCards) {
		// Allow if moving within the same column
		if (sourcePosition.columnId !== targetPosition.columnId) {
			return false;
		}
	}
	
	return true;
}
