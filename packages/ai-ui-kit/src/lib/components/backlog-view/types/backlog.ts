// Re-export schema types for convenience
export type {
	Priority,
	Status,
	WorkItemType,
	Epic,
	UserStory,
	Release,
	Sprint,
	BacklogBoard,
	DragPosition,
	DragEvent,
	EpicForm,
	StoryForm,
	ReleaseForm,
	SprintForm
} from '../schemas/backlog.js';

/**
 * Props interface for the BacklogView component
 */
export interface BacklogViewProps {
	board?: BacklogBoard;
	epics?: Epic[];
	userStories?: UserStory[];
	releases?: Release[];
	sprints?: Sprint[];
	allowAddEpic?: boolean;
	allowRemoveEpic?: boolean;
	allowAddStory?: boolean;
	allowRemoveStory?: boolean;
	allowAddRelease?: boolean;
	allowRemoveRelease?: boolean;
	allowAddSprint?: boolean;
	allowRemoveSprint?: boolean;
	allowDragDrop?: boolean;
	showStoryPoints?: boolean;
	showUnscheduled?: boolean;
	showSprints?: boolean;
	viewMode?: 'story-map' | 'backlog' | 'sprint';
	theme?: 'light' | 'dark';
	locale?: string;

	// Event handlers
	onEpicAdd?: (epic: Partial<Epic>) => void;
	onEpicRemove?: (epicId: string) => void;
	onEpicUpdate?: (epicId: string, updates: Partial<Epic>) => void;
	onStoryAdd?: (epicId: string | undefined, story: Partial<UserStory>) => void;
	onStoryRemove?: (storyId: string) => void;
	onStoryUpdate?: (storyId: string, updates: Partial<UserStory>) => void;
	onReleaseAdd?: (release: Partial<Release>) => void;
	onReleaseRemove?: (releaseId: string) => void;
	onReleaseUpdate?: (releaseId: string, updates: Partial<Release>) => void;
	onSprintAdd?: (releaseId: string | undefined, sprint: Partial<Sprint>) => void;
	onSprintRemove?: (sprintId: string) => void;
	onSprintUpdate?: (sprintId: string, updates: Partial<Sprint>) => void;
	onItemMove?: (event: DragEvent) => void;
	onBoardUpdate?: (updates: Partial<BacklogBoard>) => void;
	onViewModeChange?: (mode: 'story-map' | 'backlog' | 'sprint') => void;
}

/**
 * Props interface for the BacklogSidebar component
 */
export interface BacklogSidebarProps {
	viewMode: 'story-map' | 'backlog' | 'sprint';
	onViewModeChange: (mode: 'story-map' | 'backlog' | 'sprint') => void;
}

/**
 * Props interface for the EpicCard component
 */
export interface EpicCardProps {
	epic: Epic;
	index: number;
	allowEdit?: boolean;
	allowRemove?: boolean;
	allowDrag?: boolean;
	showActions?: boolean;

	// Event handlers
	onUpdate?: (updates: Partial<Epic>) => void;
	onRemove?: () => void;
	onDragStart?: (event: DragEvent) => void;
	onDragEnd?: (event: DragEvent) => void;
	onMoveLeft?: () => void;
	onMoveRight?: () => void;
}

/**
 * Props interface for the StoryCard component
 */
export interface StoryCardProps {
	story: UserStory;
	epicId?: string;
	releaseId?: string;
	index: number;
	allowEdit?: boolean;
	allowRemove?: boolean;
	allowDrag?: boolean;
	showStoryPoints?: boolean;
	showActions?: boolean;

	// Event handlers
	onUpdate?: (updates: Partial<UserStory>) => void;
	onRemove?: () => void;
	onDragStart?: (event: DragEvent) => void;
	onDragEnd?: (event: DragEvent) => void;
	onMoveUp?: () => void;
	onMoveDown?: () => void;
}

/**
 * Props interface for the ReleaseSwimLane component
 */
export interface ReleaseSwimLaneProps {
	release: Release;
	epics: Epic[];
	userStories: UserStory[];
	index: number;
	allowAddStory?: boolean;
	allowRemoveRelease?: boolean;
	allowEditRelease?: boolean;
	allowDragStory?: boolean;
	showStoryPoints?: boolean;
	showActions?: boolean;

	// Event handlers
	onStoryAdd?: (epicId: string | undefined, story: Partial<UserStory>) => void;
	onStoryUpdate?: (storyId: string, updates: Partial<UserStory>) => void;
	onStoryRemove?: (storyId: string) => void;
	onStoryMove?: (event: DragEvent) => void;
	onReleaseUpdate?: (updates: Partial<Release>) => void;
	onReleaseRemove?: () => void;
	onReleaseMove?: (direction: 'up' | 'down') => void;
}

/**
 * Props interface for the UnscheduledSwimLane component
 */
export interface UnscheduledSwimLaneProps {
	epics: Epic[];
	userStories: UserStory[];
	allowAddStory?: boolean;
	allowDragStory?: boolean;
	showStoryPoints?: boolean;
	showActions?: boolean;

	// Event handlers
	onStoryAdd?: (epicId: string | undefined, story: Partial<UserStory>) => void;
	onStoryUpdate?: (storyId: string, updates: Partial<UserStory>) => void;
	onStoryRemove?: (storyId: string) => void;
	onStoryMove?: (event: DragEvent) => void;
}

/**
 * Internal drag state interface
 */
export interface DragState {
	isDragging: boolean;
	draggedItem: Epic | UserStory | null;
	draggedItemType: 'epic' | 'story' | null;
	sourcePosition: DragPosition | null;
	targetPosition: DragPosition | null;
	dragOffset: { x: number; y: number };
	dragElement: HTMLElement | null;
}

/**
 * Backlog view model state interface
 */
export interface BacklogViewModelState {
	board: BacklogBoard | null;
	epics: Epic[];
	userStories: UserStory[];
	releases: Release[];
	sprints: Sprint[];
	dragState: DragState;
	viewMode: 'story-map' | 'backlog' | 'sprint';
	editingEpic: string | null;
	editingStory: string | null;
	editingRelease: string | null;
	editingSprint: string | null;
	showAddEpicForm: boolean;
	showAddStoryForm: { epicId?: string; releaseId?: string } | null;
	showAddReleaseForm: boolean;
	showAddSprintForm: string | null; // releaseId
}

/**
 * Localization strings interface
 */
export interface BacklogLocale {
	// View modes
	storyMap: string;
	backlog: string;
	sprint: string;
	
	// Actions
	addEpic: string;
	addStory: string;
	addRelease: string;
	addSprint: string;
	newEpic: string;
	newStory: string;
	newRelease: string;
	newSprint: string;
	removeEpic: string;
	removeStory: string;
	removeRelease: string;
	removeSprint: string;
	editEpic: string;
	editStory: string;
	editRelease: string;
	editSprint: string;
	saveChanges: string;
	cancel: string;
	
	// Fields
	title: string;
	name: string;
	description: string;
	asA: string;
	iWant: string;
	soThat: string;
	storyPoints: string;
	acceptanceCriteria: string;
	priority: string;
	status: string;
	type: string;
	assignee: string;
	labels: string;
	tags: string;
	estimatedEffort: string;
	businessValue: string;
	version: string;
	targetDate: string;
	startDate: string;
	endDate: string;
	capacity: string;
	goals: string;
	features: string;
	
	// Navigation
	moveUp: string;
	moveDown: string;
	moveLeft: string;
	moveRight: string;
	
	// Sections
	unscheduled: string;
	
	// Priorities
	priorities: {
		critical: string;
		high: string;
		medium: string;
		low: string;
	};
	
	// Statuses
	statuses: {
		backlog: string;
		ready: string;
		inProgress: string;
		testing: string;
		done: string;
		blocked: string;
		planning: string;
		development: string;
		released: string;
		cancelled: string;
		active: string;
		completed: string;
	};
	
	// Work item types
	types: {
		epic: string;
		feature: string;
		story: string;
		task: string;
		bug: string;
		spike: string;
	};
}

/**
 * Theme configuration interface
 */
export interface BacklogTheme {
	colors: {
		background: string;
		surface: string;
		border: string;
		text: {
			primary: string;
			secondary: string;
			muted: string;
		};
		epic: {
			background: string;
			border: string;
			text: string;
		};
		story: {
			background: string;
			border: string;
			text: string;
		};
		release: {
			background: string;
			border: string;
			header: string;
		};
		unscheduled: {
			background: string;
			border: string;
			header: string;
		};
		sidebar: {
			background: string;
			border: string;
			active: string;
		};
		priority: {
			critical: string;
			high: string;
			medium: string;
			low: string;
		};
		status: {
			backlog: string;
			ready: string;
			inProgress: string;
			testing: string;
			done: string;
			blocked: string;
		};
		type: {
			epic: string;
			feature: string;
			story: string;
			task: string;
			bug: string;
			spike: string;
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
