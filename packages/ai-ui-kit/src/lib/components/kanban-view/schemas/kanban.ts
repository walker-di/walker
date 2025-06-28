import { z } from 'zod';

/**
 * Schema for kanban card category
 */
export const KanbanCategorySchema = z.object({
	id: z.string(),
	label: z.string(),
	color: z.string(),
	bgColor: z.string(),
});

/**
 * Schema for kanban card
 */
export const KanbanCardSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().optional(),
	category: KanbanCategorySchema,
	date: z.string().optional(),
	empty: z.boolean().default(false),
	animate: z.boolean().default(false),
	assignee: z.string().optional(),
	priority: z.enum(['low', 'medium', 'high']).optional(),
	tags: z.array(z.string()).default([]),
	dueDate: z.date().optional(),
	createdAt: z.date().default(() => new Date()),
	updatedAt: z.date().default(() => new Date()),
});

/**
 * Schema for kanban column
 */
export const KanbanColumnSchema = z.object({
	id: z.string(),
	title: z.string(),
	cards: z.array(KanbanCardSchema).default([]),
	maxCards: z.number().optional(),
	color: z.string().optional(),
	collapsed: z.boolean().default(false),
	order: z.number(),
});

/**
 * Schema for kanban board
 */
export const KanbanBoardSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().optional(),
	columns: z.array(KanbanColumnSchema).default([]),
	categories: z.array(KanbanCategorySchema).default([]),
	createdAt: z.date().default(() => new Date()),
	updatedAt: z.date().default(() => new Date()),
});

/**
 * Schema for drag and drop position
 */
export const DragPositionSchema = z.object({
	columnId: z.string(),
	cardIndex: z.number(),
});

/**
 * Schema for drag and drop event data
 */
export const DragEventSchema = z.object({
	cardId: z.string(),
	sourcePosition: DragPositionSchema,
	targetPosition: DragPositionSchema,
});

/**
 * Schema for kanban view props
 */
export const KanbanViewPropsSchema = z.object({
	board: KanbanBoardSchema.optional(),
	columns: z.array(KanbanColumnSchema).default([]),
	categories: z.array(KanbanCategorySchema).default([]),
	maxColumns: z.number().default(10),
	allowAddColumn: z.boolean().default(true),
	allowRemoveColumn: z.boolean().default(true),
	allowAddCard: z.boolean().default(true),
	allowRemoveCard: z.boolean().default(true),
	allowEditCard: z.boolean().default(true),
	allowDragCard: z.boolean().default(true),
	allowDragColumn: z.boolean().default(false),
	showCardCount: z.boolean().default(true),
	showColumnActions: z.boolean().default(true),
	theme: z.enum(['light', 'dark']).default('light'),
	locale: z.string().default('en'),
	
	// Event handlers
	onCardAdd: z.function().optional(),
	onCardRemove: z.function().optional(),
	onCardUpdate: z.function().optional(),
	onCardMove: z.function().optional(),
	onColumnAdd: z.function().optional(),
	onColumnRemove: z.function().optional(),
	onColumnUpdate: z.function().optional(),
	onColumnMove: z.function().optional(),
	onBoardUpdate: z.function().optional(),
});

/**
 * Schema for card form data
 */
export const CardFormSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().optional(),
	categoryId: z.string(),
	assignee: z.string().optional(),
	priority: z.enum(['low', 'medium', 'high']).optional(),
	tags: z.array(z.string()).default([]),
	dueDate: z.date().optional(),
});

/**
 * Schema for column form data
 */
export const ColumnFormSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	color: z.string().optional(),
	maxCards: z.number().min(1).optional(),
});

// Export inferred types
export type KanbanCategory = z.infer<typeof KanbanCategorySchema>;
export type KanbanCard = z.infer<typeof KanbanCardSchema>;
export type KanbanColumn = z.infer<typeof KanbanColumnSchema>;
export type KanbanBoard = z.infer<typeof KanbanBoardSchema>;
export type DragPosition = z.infer<typeof DragPositionSchema>;
export type DragEvent = z.infer<typeof DragEventSchema>;
export type KanbanViewProps = z.infer<typeof KanbanViewPropsSchema>;
export type CardForm = z.infer<typeof CardFormSchema>;
export type ColumnForm = z.infer<typeof ColumnFormSchema>;
