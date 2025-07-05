import type {
	BacklogBoard,
	Epic,
	UserStory,
	Release,
	Sprint,
	BacklogViewProps,
	DragEvent,
	DragPosition,
	DragState,
	BacklogLocale
} from './types/backlog.js';

import {
	createBoard,
	createEpic,
	createUserStory,
	createRelease,
	createSprint,
	updateEpic,
	updateUserStory,
	updateRelease,
	updateSprint,
	removeEpic,
	removeUserStory,
	removeRelease,
	removeSprint,
	reorderItems,
	getStoriesForEpic,
	getStoriesForRelease,
	getUnscheduledStories,
	getStoriesForSprint,
	getDefaultLocale
} from './utils/backlog-utils.js';

/**
 * Backlog View Model - manages state and business logic for the backlog view
 * Uses Svelte 5 runes for reactive state management
 */
export class BacklogViewModel {
	// Reactive state using Svelte 5 runes
	board = $state<BacklogBoard | null>(null);
	epics = $state<Epic[]>([]);
	userStories = $state<UserStory[]>([]);
	releases = $state<Release[]>([]);
	sprints = $state<Sprint[]>([]);

	// UI state
	viewMode = $state<'story-map' | 'backlog' | 'sprint'>('story-map');
	editingEpic = $state<string | null>(null);
	editingStory = $state<string | null>(null);
	editingRelease = $state<string | null>(null);
	editingSprint = $state<string | null>(null);
	showAddEpicForm = $state<boolean>(false);
	showAddStoryForm = $state<{ epicId?: string; releaseId?: string } | null>(null);
	showAddReleaseForm = $state<boolean>(false);
	showAddSprintForm = $state<string | null>(null); // releaseId

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
	private props: BacklogViewProps;
	private locale = getDefaultLocale();

	constructor(props: BacklogViewProps) {
		this.props = props;
		this.initializeBoard();
	}

	/**
	 * Initialize the board with provided data or create a new one
	 */
	private initializeBoard() {
		if (this.props.board) {
			this.board = this.props.board;
			this.epics = this.props.board.epics || [];
			this.userStories = this.props.board.userStories || [];
			this.releases = this.props.board.releases || [];
			this.sprints = this.props.board.sprints || [];
		} else {
			this.board = createBoard({
				title: 'Product Backlog',
				description: 'Agile product backlog and story mapping'
			});
			this.epics = this.props.epics || [];
			this.userStories = this.props.userStories || [];
			this.releases = this.props.releases || [];
			this.sprints = this.props.sprints || [];
		}

		// Set initial view mode
		this.viewMode = this.props.viewMode || 'story-map';
	}

	/**
	 * Update props and refresh state
	 */
	updateProps(newProps: BacklogViewProps) {
		this.props = newProps;
		this.initializeBoard();
	}

	// Epic operations
	addEpic(data: Partial<Epic> = {}) {
		const order = this.epics.length;
		const epic = createEpic({ ...data, order });
		this.epics = [...this.epics, epic];
		this.props.onEpicAdd?.(epic);
		this.updateBoard();
	}

	updateEpicData(epicId: string, updates: Partial<Epic>) {
		const epicIndex = this.epics.findIndex(e => e.id === epicId);
		if (epicIndex >= 0) {
			const updatedEpic = updateEpic(this.epics[epicIndex], updates);
			this.epics[epicIndex] = updatedEpic;
			this.props.onEpicUpdate?.(epicId, updates);
			this.updateBoard();
		}
	}

	removeEpicData(epicId: string) {
		const result = removeEpic(this.epics, this.userStories, epicId);
		this.epics = result.epics;
		this.userStories = result.userStories;
		this.props.onEpicRemove?.(epicId);
		this.updateBoard();
	}

	// User story operations
	addUserStory(epicId: string | undefined, releaseId: string | undefined, data: Partial<UserStory> = {}) {
		const order = epicId 
			? this.getStoriesForEpic(epicId).length
			: releaseId 
				? this.getStoriesForRelease(releaseId).length
				: this.getUnscheduledStories().length;
		
		const story = createUserStory({ 
			...data, 
			epicId, 
			releaseId,
			order 
		});
		this.userStories = [...this.userStories, story];
		this.props.onStoryAdd?.(epicId, story);
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
		const order = this.releases.length;
		const release = createRelease({ ...data, order });
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
		const result = removeRelease(this.releases, this.userStories, releaseId);
		this.releases = result.releases;
		this.userStories = result.userStories;
		this.props.onReleaseRemove?.(releaseId);
		this.updateBoard();
	}

	// Sprint operations
	addSprint(releaseId: string | undefined, data: Partial<Sprint> = {}) {
		const order = this.sprints.filter(s => s.releaseId === releaseId).length;
		const sprint = createSprint({ ...data, releaseId, order });
		this.sprints = [...this.sprints, sprint];
		this.props.onSprintAdd?.(releaseId, sprint);
		this.updateBoard();
	}

	updateSprintData(sprintId: string, updates: Partial<Sprint>) {
		const sprintIndex = this.sprints.findIndex(s => s.id === sprintId);
		if (sprintIndex >= 0) {
			const updatedSprint = updateSprint(this.sprints[sprintIndex], updates);
			this.sprints[sprintIndex] = updatedSprint;
			this.props.onSprintUpdate?.(sprintId, updates);
			this.updateBoard();
		}
	}

	removeSprintData(sprintId: string) {
		const result = removeSprint(this.sprints, this.userStories, sprintId);
		this.sprints = result.sprints;
		this.userStories = result.userStories;
		this.props.onSprintRemove?.(sprintId);
		this.updateBoard();
	}

	// Helper methods for getting related data
	getStoriesForEpic(epicId: string): UserStory[] {
		return getStoriesForEpic(this.userStories, epicId);
	}

	getStoriesForRelease(releaseId: string): UserStory[] {
		return getStoriesForRelease(this.userStories, releaseId);
	}

	getUnscheduledStories(): UserStory[] {
		return getUnscheduledStories(this.userStories);
	}

	getStoriesForSprint(sprintId: string): UserStory[] {
		return getStoriesForSprint(this.userStories, sprintId);
	}

	getSprintsForRelease(releaseId: string): Sprint[] {
		return this.sprints.filter(s => s.releaseId === releaseId).sort((a, b) => a.order - b.order);
	}

	// View mode operations
	setViewMode(mode: 'story-map' | 'backlog' | 'sprint') {
		this.viewMode = mode;
		this.props.onViewModeChange?.(mode);
	}

	// Drag and drop operations
	handleDragStart(item: Epic | UserStory, itemType: 'epic' | 'story', sourcePosition: DragPosition) {
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
			this.board.epics = this.epics;
			this.board.userStories = this.userStories;
			this.board.releases = this.releases;
			this.board.sprints = this.sprints;
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
		this.epics = [];
		this.userStories = [];
		this.releases = [];
		this.sprints = [];
		this.viewMode = 'story-map';
		this.editingEpic = null;
		this.editingStory = null;
		this.editingRelease = null;
		this.editingSprint = null;
		this.showAddEpicForm = false;
		this.showAddStoryForm = null;
		this.showAddReleaseForm = false;
		this.showAddSprintForm = null;
	}
}
