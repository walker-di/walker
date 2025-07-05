import { z } from 'zod';

/**
 * Schema for work item priority
 */
export const PrioritySchema = z.enum(['critical', 'high', 'medium', 'low']);

/**
 * Schema for work item status
 */
export const StatusSchema = z.enum(['backlog', 'ready', 'in-progress', 'testing', 'done', 'blocked']);

/**
 * Schema for work item type
 */
export const WorkItemTypeSchema = z.enum(['epic', 'feature', 'story', 'task', 'bug', 'spike']);

/**
 * Schema for epic (high-level activity)
 */
export const EpicSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().optional(),
	color: z.string().optional(),
	priority: PrioritySchema.default('medium'),
	status: StatusSchema.default('backlog'),
	order: z.number(),
	estimatedEffort: z.string().optional(),
	businessValue: z.number().optional(),
	tags: z.array(z.string()).default([]),
	assignee: z.string().optional(),
	createdAt: z.date().default(() => new Date()),
	updatedAt: z.date().default(() => new Date()),
});

/**
 * Schema for user story
 */
export const UserStorySchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().optional(),
	asA: z.string().optional(), // "As a [user type]"
	iWant: z.string().optional(), // "I want [functionality]"
	soThat: z.string().optional(), // "So that [benefit]"
	epicId: z.string().optional(),
	releaseId: z.string().optional(),
	sprintId: z.string().optional(),
	order: z.number(),
	storyPoints: z.number().optional(),
	priority: PrioritySchema.default('medium'),
	status: StatusSchema.default('backlog'),
	type: WorkItemTypeSchema.default('story'),
	acceptanceCriteria: z.array(z.string()).default([]),
	testCases: z.array(z.string()).default([]),
	dependencies: z.array(z.string()).default([]),
	tags: z.array(z.string()).default([]),
	assignee: z.string().optional(),
	labels: z.array(z.string()).default([]),
	color: z.string().optional(),
	createdAt: z.date().default(() => new Date()),
	updatedAt: z.date().default(() => new Date()),
});

/**
 * Schema for release/version
 */
export const ReleaseSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	version: z.string().optional(),
	targetDate: z.date().optional(),
	startDate: z.date().optional(),
	status: z.enum(['planning', 'development', 'testing', 'released', 'cancelled']).default('planning'),
	goals: z.array(z.string()).default([]),
	features: z.array(z.string()).default([]),
	color: z.string().optional(),
	order: z.number(),
	isScheduled: z.boolean().default(true),
	createdAt: z.date().default(() => new Date()),
	updatedAt: z.date().default(() => new Date()),
});

/**
 * Schema for sprint
 */
export const SprintSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	releaseId: z.string().optional(),
	startDate: z.date().optional(),
	endDate: z.date().optional(),
	capacity: z.number().optional(),
	status: z.enum(['planning', 'active', 'completed', 'cancelled']).default('planning'),
	goals: z.array(z.string()).default([]),
	order: z.number(),
	createdAt: z.date().default(() => new Date()),
	updatedAt: z.date().default(() => new Date()),
});

/**
 * Schema for backlog board
 */
export const BacklogBoardSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().optional(),
	epics: z.array(EpicSchema).default([]),
	userStories: z.array(UserStorySchema).default([]),
	releases: z.array(ReleaseSchema).default([]),
	sprints: z.array(SprintSchema).default([]),
	createdAt: z.date().default(() => new Date()),
	updatedAt: z.date().default(() => new Date()),
});

/**
 * Schema for drag and drop position
 */
export const DragPositionSchema = z.object({
	containerId: z.string(),
	itemIndex: z.number(),
	containerType: z.enum(['epic', 'release', 'sprint', 'unscheduled']),
});

/**
 * Schema for drag and drop event data
 */
export const DragEventSchema = z.object({
	itemId: z.string(),
	itemType: z.enum(['epic', 'story']),
	sourcePosition: DragPositionSchema,
	targetPosition: DragPositionSchema,
});

/**
 * Schema for backlog view props
 */
export const BacklogViewPropsSchema = z.object({
	board: BacklogBoardSchema.optional(),
	epics: z.array(EpicSchema).default([]),
	userStories: z.array(UserStorySchema).default([]),
	releases: z.array(ReleaseSchema).default([]),
	sprints: z.array(SprintSchema).default([]),
	allowAddEpic: z.boolean().default(true),
	allowRemoveEpic: z.boolean().default(true),
	allowAddStory: z.boolean().default(true),
	allowRemoveStory: z.boolean().default(true),
	allowAddRelease: z.boolean().default(true),
	allowRemoveRelease: z.boolean().default(true),
	allowAddSprint: z.boolean().default(true),
	allowRemoveSprint: z.boolean().default(true),
	allowDragDrop: z.boolean().default(true),
	showStoryPoints: z.boolean().default(true),
	showUnscheduled: z.boolean().default(true),
	showSprints: z.boolean().default(false),
	viewMode: z.enum(['story-map', 'backlog', 'sprint']).default('story-map'),
	theme: z.enum(['light', 'dark']).default('light'),
	locale: z.string().default('en'),
	
	// Event handlers
	onEpicAdd: z.function().optional(),
	onEpicRemove: z.function().optional(),
	onEpicUpdate: z.function().optional(),
	onStoryAdd: z.function().optional(),
	onStoryRemove: z.function().optional(),
	onStoryUpdate: z.function().optional(),
	onReleaseAdd: z.function().optional(),
	onReleaseRemove: z.function().optional(),
	onReleaseUpdate: z.function().optional(),
	onSprintAdd: z.function().optional(),
	onSprintRemove: z.function().optional(),
	onSprintUpdate: z.function().optional(),
	onItemMove: z.function().optional(),
	onBoardUpdate: z.function().optional(),
	onViewModeChange: z.function().optional(),
});

/**
 * Schema for epic form data
 */
export const EpicFormSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().optional(),
	priority: PrioritySchema.default('medium'),
	estimatedEffort: z.string().optional(),
	businessValue: z.number().min(0).optional(),
	tags: z.array(z.string()).default([]),
});

/**
 * Schema for story form data
 */
export const StoryFormSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().optional(),
	asA: z.string().optional(),
	iWant: z.string().optional(),
	soThat: z.string().optional(),
	storyPoints: z.number().min(0).optional(),
	priority: PrioritySchema.default('medium'),
	type: WorkItemTypeSchema.default('story'),
	acceptanceCriteria: z.array(z.string()).default([]),
	tags: z.array(z.string()).default([]),
	labels: z.array(z.string()).default([]),
});

/**
 * Schema for release form data
 */
export const ReleaseFormSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string().optional(),
	version: z.string().optional(),
	targetDate: z.date().optional(),
	startDate: z.date().optional(),
	goals: z.array(z.string()).default([]),
	features: z.array(z.string()).default([]),
});

/**
 * Schema for sprint form data
 */
export const SprintFormSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string().optional(),
	startDate: z.date().optional(),
	endDate: z.date().optional(),
	capacity: z.number().min(0).optional(),
	goals: z.array(z.string()).default([]),
});

// Export inferred types
export type Priority = z.infer<typeof PrioritySchema>;
export type Status = z.infer<typeof StatusSchema>;
export type WorkItemType = z.infer<typeof WorkItemTypeSchema>;
export type Epic = z.infer<typeof EpicSchema>;
export type UserStory = z.infer<typeof UserStorySchema>;
export type Release = z.infer<typeof ReleaseSchema>;
export type Sprint = z.infer<typeof SprintSchema>;
export type BacklogBoard = z.infer<typeof BacklogBoardSchema>;
export type DragPosition = z.infer<typeof DragPositionSchema>;
export type DragEvent = z.infer<typeof DragEventSchema>;
export type BacklogViewProps = z.infer<typeof BacklogViewPropsSchema>;
export type EpicForm = z.infer<typeof EpicFormSchema>;
export type StoryForm = z.infer<typeof StoryFormSchema>;
export type ReleaseForm = z.infer<typeof ReleaseFormSchema>;
export type SprintForm = z.infer<typeof SprintFormSchema>;
