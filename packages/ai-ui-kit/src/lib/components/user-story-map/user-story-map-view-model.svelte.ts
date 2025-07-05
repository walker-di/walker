import type {
	UserStoryMapBoard,
	UserPersona,
	UserActivity,
	Task,
	UserStory,
	Release,
	UserStoryMapViewProps,
	DragEvent,
	DragPosition,
	DragState,
	UserStoryMapLocale
} from './types/user-story-map.js';

import {
	createBoard,
	createPersona,
	createActivity,
	createTask,
	createUserStory,
	createRelease,
	updatePersona,
	updateActivity,
	updateTask,
	updateUserStory,
	updateRelease,
	removePersona,
	removeActivity,
	removeTask,
	removeUserStory,
	removeRelease,
	reorderItems,
	getActivitiesForPersona,
	getTasksForActivity,
	getUserStoriesForTask,
	getUserStoriesForRelease,
	getDefaultLocale
} from './utils/user-story-map-utils.js';

/**
 * User Story Map View Model - manages state and business logic for the user story map
 * Uses Svelte 5 runes for reactive state management
 */
export class UserStoryMapViewModel {
	// Reactive state using Svelte 5 runes
	board = $state<UserStoryMapBoard | null>(null);
	personas = $state<UserPersona[]>([]);
	activities = $state<UserActivity[]>([]);
	tasks = $state<Task[]>([]);
	userStories = $state<UserStory[]>([]);
	releases = $state<Release[]>([]);

	// UI state
	editingPersona = $state<string | null>(null);
	editingActivity = $state<{ personaId: string; activityId: string } | null>(null);
	editingTask = $state<{ activityId: string; taskId: string } | null>(null);
	editingStory = $state<{ taskId: string; storyId: string } | null>(null);
	editingRelease = $state<string | null>(null);
	showAddPersonaForm = $state<boolean>(false);
	showAddActivityForm = $state<string | null>(null); // personaId
	showAddTaskForm = $state<string | null>(null); // activityId
	showAddStoryForm = $state<string | null>(null); // taskId
	showAddReleaseForm = $state<boolean>(false);

	// Drag and drop state
	dragState = $state<DragState>({
		isDragging: false,
		draggedItem: null,
		draggedItemType: null,
		sourcePosition: null,
		targetPosition: null,
		dragOffset: { x: 0, y: 0 },
		dragElement: null
	});

	// Props reference
	private props: UserStoryMapViewProps;
	private locale = getDefaultLocale();

	constructor(props: UserStoryMapViewProps) {
		this.props = props;
		this.initializeBoard();
	}

	/**
	 * Initialize the board with provided data or create a new one
	 */
	private initializeBoard() {
		if (this.props.board) {
			this.board = this.props.board;
			this.personas = this.props.board.personas || [];
			this.activities = this.props.board.activities || [];
			this.tasks = this.props.board.tasks || [];
			this.userStories = this.props.board.userStories || [];
			this.releases = this.props.board.releases || [];
		} else {
			this.board = createBoard({
				title: 'User Story Map',
				description: 'A collaborative tool for mapping user journeys and stories'
			});
			this.personas = this.props.personas || [];
			this.activities = this.props.activities || [];
			this.tasks = this.props.tasks || [];
			this.userStories = this.props.userStories || [];
			this.releases = this.props.releases || [];
		}
	}

	/**
	 * Update props and refresh state
	 */
	updateProps(newProps: UserStoryMapViewProps) {
		this.props = newProps;
		this.initializeBoard();
	}

	// Persona operations
	addPersona(data: Partial<UserPersona> = {}) {
		const persona = createPersona(data);
		this.personas = [...this.personas, persona];
		this.props.onPersonaAdd?.(persona);
		this.updateBoard();
	}

	updatePersonaData(personaId: string, updates: Partial<UserPersona>) {
		const personaIndex = this.personas.findIndex(p => p.id === personaId);
		if (personaIndex >= 0) {
			const updatedPersona = updatePersona(this.personas[personaIndex], updates);
			this.personas[personaIndex] = updatedPersona;
			this.props.onPersonaUpdate?.(personaId, updates);
			this.updateBoard();
		}
	}

	removePersonaData(personaId: string) {
		const result = removePersona(this.personas, this.activities, this.tasks, this.userStories, personaId);
		this.personas = result.personas;
		this.activities = result.activities;
		this.tasks = result.tasks;
		this.userStories = result.userStories;
		this.props.onPersonaRemove?.(personaId);
		this.updateBoard();
	}

	// Activity operations
	addActivity(personaId: string, data: Partial<UserActivity> = {}) {
		const order = this.getActivitiesForPersona(personaId).length;
		const activity = createActivity(personaId, { ...data, order });
		this.activities = [...this.activities, activity];
		this.props.onActivityAdd?.(personaId, activity);
		this.updateBoard();
	}

	updateActivityData(activityId: string, updates: Partial<UserActivity>) {
		const activityIndex = this.activities.findIndex(a => a.id === activityId);
		if (activityIndex >= 0) {
			const updatedActivity = updateActivity(this.activities[activityIndex], updates);
			this.activities[activityIndex] = updatedActivity;
			this.props.onActivityUpdate?.(activityId, updates);
			this.updateBoard();
		}
	}

	removeActivityData(activityId: string) {
		const result = removeActivity(this.activities, this.tasks, this.userStories, activityId);
		this.activities = result.activities;
		this.tasks = result.tasks;
		this.userStories = result.userStories;
		this.props.onActivityRemove?.(activityId);
		this.updateBoard();
	}

	// Task operations
	addTask(activityId: string, data: Partial<Task> = {}) {
		const order = this.getTasksForActivity(activityId).length;
		const task = createTask(activityId, { ...data, order });
		this.tasks = [...this.tasks, task];
		this.props.onTaskAdd?.(activityId, task);
		this.updateBoard();
	}

	updateTaskData(taskId: string, updates: Partial<Task>) {
		const taskIndex = this.tasks.findIndex(t => t.id === taskId);
		if (taskIndex >= 0) {
			const updatedTask = updateTask(this.tasks[taskIndex], updates);
			this.tasks[taskIndex] = updatedTask;
			this.props.onTaskUpdate?.(taskId, updates);
			this.updateBoard();
		}
	}

	removeTaskData(taskId: string) {
		const result = removeTask(this.tasks, this.userStories, taskId);
		this.tasks = result.tasks;
		this.userStories = result.userStories;
		this.props.onTaskRemove?.(taskId);
		this.updateBoard();
	}

	// User story operations
	addUserStory(taskId: string, data: Partial<UserStory> = {}) {
		const order = this.getUserStoriesForTask(taskId).length;
		const story = createUserStory(taskId, { ...data, order });
		this.userStories = [...this.userStories, story];
		this.props.onStoryAdd?.(taskId, story);
		this.updateBoard();
	}

	updateUserStoryData(storyId: string, updates: Partial<UserStory>) {
		const storyIndex = this.userStories.findIndex(s => s.id === storyId);
		if (storyIndex >= 0) {
			const updatedStory = updateUserStory(this.userStories[storyIndex], updates);
			this.userStories[storyIndex] = updatedStory;
			this.props.onStoryUpdate?.(storyId, updates);
			this.updateBoard();
		}
	}

	removeUserStoryData(storyId: string) {
		this.userStories = removeUserStory(this.userStories, storyId);
		this.props.onStoryRemove?.(storyId);
		this.updateBoard();
	}

	// Release operations
	addRelease(data: Partial<Release> = {}) {
		const release = createRelease(data);
		this.releases = [...this.releases, release];
		this.props.onReleaseAdd?.(release);
		this.updateBoard();
	}

	updateReleaseData(releaseId: string, updates: Partial<Release>) {
		const releaseIndex = this.releases.findIndex(r => r.id === releaseId);
		if (releaseIndex >= 0) {
			const updatedRelease = updateRelease(this.releases[releaseIndex], updates);
			this.releases[releaseIndex] = updatedRelease;
			this.props.onReleaseUpdate?.(releaseId, updates);
			this.updateBoard();
		}
	}

	removeReleaseData(releaseId: string) {
		this.releases = removeRelease(this.releases, releaseId);
		this.props.onReleaseRemove?.(releaseId);
		this.updateBoard();
	}

	// Helper methods for getting related data
	getActivitiesForPersona(personaId: string): UserActivity[] {
		return getActivitiesForPersona(this.activities, personaId);
	}

	getTasksForActivity(activityId: string): Task[] {
		return getTasksForActivity(this.tasks, activityId);
	}

	getUserStoriesForTask(taskId: string): UserStory[] {
		return getUserStoriesForTask(this.userStories, taskId);
	}

	getUserStoriesForRelease(release: Release): UserStory[] {
		return getUserStoriesForRelease(this.userStories, release);
	}

	// Drag and drop operations
	handleDragStart(item: UserStory | Task | UserActivity | Release, itemType: 'story' | 'task' | 'activity' | 'release', sourcePosition: DragPosition) {
		this.dragState.isDragging = true;
		this.dragState.draggedItem = item;
		this.dragState.draggedItemType = itemType;
		this.dragState.sourcePosition = sourcePosition;
	}

	handleDragEnd() {
		if (this.dragState.sourcePosition && this.dragState.targetPosition && this.dragState.draggedItem) {
			const dragEvent: DragEvent = {
				itemId: this.dragState.draggedItem.id,
				itemType: this.dragState.draggedItemType!,
				sourcePosition: this.dragState.sourcePosition,
				targetPosition: this.dragState.targetPosition
			};
			this.props.onItemMove?.(dragEvent);
		}

		// Reset drag state
		this.dragState.isDragging = false;
		this.dragState.draggedItem = null;
		this.dragState.draggedItemType = null;
		this.dragState.sourcePosition = null;
		this.dragState.targetPosition = null;
		this.dragState.dragOffset = { x: 0, y: 0 };
		this.dragState.dragElement = null;
	}

	// Update board data
	private updateBoard() {
		if (this.board) {
			this.board.personas = this.personas;
			this.board.activities = this.activities;
			this.board.tasks = this.tasks;
			this.board.userStories = this.userStories;
			this.board.releases = this.releases;
			this.board.updatedAt = new Date();
			this.props.onBoardUpdate?.(this.board);
		}
	}

	/**
	 * Cleanup resources
	 */
	destroy() {
		// Reset all state
		this.board = null;
		this.personas = [];
		this.activities = [];
		this.tasks = [];
		this.userStories = [];
		this.releases = [];
		this.editingPersona = null;
		this.editingActivity = null;
		this.editingTask = null;
		this.editingStory = null;
		this.editingRelease = null;
		this.showAddPersonaForm = false;
		this.showAddActivityForm = null;
		this.showAddTaskForm = null;
		this.showAddStoryForm = null;
		this.showAddReleaseForm = false;
	}
}
