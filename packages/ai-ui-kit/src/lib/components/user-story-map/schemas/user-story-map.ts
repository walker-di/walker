import { z } from 'zod';

/**
 * Schema for user persona
 */
export const UserPersonaSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	avatar: z.string().optional(),
	role: z.string().optional(),
	goals: z.array(z.string()).default([]),
	painPoints: z.array(z.string()).default([]),
	color: z.string().optional(),
	createdAt: z.date().default(() => new Date()),
	updatedAt: z.date().default(() => new Date()),
});

/**
 * Schema for user activity (backbone/epic)
 */
export const UserActivitySchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().optional(),
	personaId: z.string(),
	order: z.number(),
	color: z.string().optional(),
	estimatedDuration: z.string().optional(),
	priority: z.enum(['low', 'medium', 'high']).default('medium'),
	status: z.enum(['draft', 'active', 'completed', 'archived']).default('draft'),
	createdAt: z.date().default(() => new Date()),
	updatedAt: z.date().default(() => new Date()),
});

/**
 * Schema for task (step/feature)
 */
export const TaskSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().optional(),
	activityId: z.string(),
	order: z.number(),
	estimatedEffort: z.string().optional(),
	acceptanceCriteria: z.array(z.string()).default([]),
	dependencies: z.array(z.string()).default([]),
	tags: z.array(z.string()).default([]),
	priority: z.enum(['low', 'medium', 'high']).default('medium'),
	status: z.enum(['backlog', 'ready', 'in-progress', 'done']).default('backlog'),
	createdAt: z.date().default(() => new Date()),
	updatedAt: z.date().default(() => new Date()),
});

/**
 * Schema for user story (details)
 */
export const UserStorySchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().optional(),
	asA: z.string(), // "As a [user type]"
	iWant: z.string(), // "I want [functionality]"
	soThat: z.string(), // "So that [benefit]"
	taskId: z.string(),
	order: z.number(),
	storyPoints: z.number().optional(),
	acceptanceCriteria: z.array(z.string()).default([]),
	testCases: z.array(z.string()).default([]),
	priority: z.enum(['low', 'medium', 'high']).default('medium'),
	status: z.enum(['draft', 'ready', 'in-progress', 'testing', 'done']).default('draft'),
	assignee: z.string().optional(),
	labels: z.array(z.string()).default([]),
	createdAt: z.date().default(() => new Date()),
	updatedAt: z.date().default(() => new Date()),
});

/**
 * Schema for release
 */
export const ReleaseSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	version: z.string().optional(),
	targetDate: z.date().optional(),
	status: z.enum(['planning', 'development', 'testing', 'released']).default('planning'),
	userStoryIds: z.array(z.string()).default([]),
	goals: z.array(z.string()).default([]),
	features: z.array(z.string()).default([]),
	color: z.string().optional(),
	createdAt: z.date().default(() => new Date()),
	updatedAt: z.date().default(() => new Date()),
});

/**
 * Schema for user story map board
 */
export const UserStoryMapBoardSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().optional(),
	personas: z.array(UserPersonaSchema).default([]),
	activities: z.array(UserActivitySchema).default([]),
	tasks: z.array(TaskSchema).default([]),
	userStories: z.array(UserStorySchema).default([]),
	releases: z.array(ReleaseSchema).default([]),
	createdAt: z.date().default(() => new Date()),
	updatedAt: z.date().default(() => new Date()),
});

/**
 * Schema for drag and drop position
 */
export const DragPositionSchema = z.object({
	containerId: z.string(),
	itemIndex: z.number(),
	containerType: z.enum(['activity', 'task', 'story', 'release']),
});

/**
 * Schema for drag and drop event data
 */
export const DragEventSchema = z.object({
	itemId: z.string(),
	itemType: z.enum(['activity', 'task', 'story', 'release']),
	sourcePosition: DragPositionSchema,
	targetPosition: DragPositionSchema,
});

/**
 * Schema for user story map view props
 */
export const UserStoryMapViewPropsSchema = z.object({
	board: UserStoryMapBoardSchema.optional(),
	personas: z.array(UserPersonaSchema).default([]),
	activities: z.array(UserActivitySchema).default([]),
	tasks: z.array(TaskSchema).default([]),
	userStories: z.array(UserStorySchema).default([]),
	releases: z.array(ReleaseSchema).default([]),
	allowAddPersona: z.boolean().default(true),
	allowRemovePersona: z.boolean().default(true),
	allowAddActivity: z.boolean().default(true),
	allowRemoveActivity: z.boolean().default(true),
	allowAddTask: z.boolean().default(true),
	allowRemoveTask: z.boolean().default(true),
	allowAddStory: z.boolean().default(true),
	allowRemoveStory: z.boolean().default(true),
	allowAddRelease: z.boolean().default(true),
	allowRemoveRelease: z.boolean().default(true),
	allowDragDrop: z.boolean().default(true),
	showStoryPoints: z.boolean().default(true),
	showReleases: z.boolean().default(true),
	theme: z.enum(['light', 'dark']).default('light'),
	locale: z.string().default('en'),
	
	// Event handlers
	onPersonaAdd: z.function().optional(),
	onPersonaRemove: z.function().optional(),
	onPersonaUpdate: z.function().optional(),
	onActivityAdd: z.function().optional(),
	onActivityRemove: z.function().optional(),
	onActivityUpdate: z.function().optional(),
	onTaskAdd: z.function().optional(),
	onTaskRemove: z.function().optional(),
	onTaskUpdate: z.function().optional(),
	onStoryAdd: z.function().optional(),
	onStoryRemove: z.function().optional(),
	onStoryUpdate: z.function().optional(),
	onReleaseAdd: z.function().optional(),
	onReleaseRemove: z.function().optional(),
	onReleaseUpdate: z.function().optional(),
	onItemMove: z.function().optional(),
	onBoardUpdate: z.function().optional(),
});

/**
 * Schema for story form data
 */
export const StoryFormSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().optional(),
	asA: z.string().min(1, 'User type is required'),
	iWant: z.string().min(1, 'Functionality is required'),
	soThat: z.string().min(1, 'Benefit is required'),
	storyPoints: z.number().min(0).optional(),
	priority: z.enum(['low', 'medium', 'high']).default('medium'),
	acceptanceCriteria: z.array(z.string()).default([]),
	labels: z.array(z.string()).default([]),
});

/**
 * Schema for task form data
 */
export const TaskFormSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().optional(),
	estimatedEffort: z.string().optional(),
	priority: z.enum(['low', 'medium', 'high']).default('medium'),
	acceptanceCriteria: z.array(z.string()).default([]),
	tags: z.array(z.string()).default([]),
});

/**
 * Schema for activity form data
 */
export const ActivityFormSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().optional(),
	estimatedDuration: z.string().optional(),
	priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

/**
 * Schema for persona form data
 */
export const PersonaFormSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string().optional(),
	role: z.string().optional(),
	goals: z.array(z.string()).default([]),
	painPoints: z.array(z.string()).default([]),
});

/**
 * Schema for release form data
 */
export const ReleaseFormSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string().optional(),
	version: z.string().optional(),
	targetDate: z.date().optional(),
	goals: z.array(z.string()).default([]),
	features: z.array(z.string()).default([]),
});

// Export inferred types
export type UserPersona = z.infer<typeof UserPersonaSchema>;
export type UserActivity = z.infer<typeof UserActivitySchema>;
export type Task = z.infer<typeof TaskSchema>;
export type UserStory = z.infer<typeof UserStorySchema>;
export type Release = z.infer<typeof ReleaseSchema>;
export type UserStoryMapBoard = z.infer<typeof UserStoryMapBoardSchema>;
export type DragPosition = z.infer<typeof DragPositionSchema>;
export type DragEvent = z.infer<typeof DragEventSchema>;
export type UserStoryMapViewProps = z.infer<typeof UserStoryMapViewPropsSchema>;
export type StoryForm = z.infer<typeof StoryFormSchema>;
export type TaskForm = z.infer<typeof TaskFormSchema>;
export type ActivityForm = z.infer<typeof ActivityFormSchema>;
export type PersonaForm = z.infer<typeof PersonaFormSchema>;
export type ReleaseForm = z.infer<typeof ReleaseFormSchema>;
