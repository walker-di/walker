// Re-export schema types for convenience
export type {
	UserPersona,
	UserActivity,
	Task,
	UserStory,
	Release,
	UserStoryMapBoard,
	DragPosition,
	DragEvent,
	StoryForm,
	TaskForm,
	ActivityForm,
	PersonaForm,
	ReleaseForm
} from '../schemas/user-story-map.js';

/**
 * Props interface for the UserStoryMapView component
 */
export interface UserStoryMapViewProps {
	board?: UserStoryMapBoard;
	personas?: UserPersona[];
	activities?: UserActivity[];
	tasks?: Task[];
	userStories?: UserStory[];
	releases?: Release[];
	allowAddPersona?: boolean;
	allowRemovePersona?: boolean;
	allowAddActivity?: boolean;
	allowRemoveActivity?: boolean;
	allowAddTask?: boolean;
	allowRemoveTask?: boolean;
	allowAddStory?: boolean;
	allowRemoveStory?: boolean;
	allowAddRelease?: boolean;
	allowRemoveRelease?: boolean;
	allowDragDrop?: boolean;
	showStoryPoints?: boolean;
	showReleases?: boolean;
	theme?: 'light' | 'dark';
	locale?: string;

	// Event handlers
	onPersonaAdd?: (persona: Partial<UserPersona>) => void;
	onPersonaRemove?: (personaId: string) => void;
	onPersonaUpdate?: (personaId: string, updates: Partial<UserPersona>) => void;
	onActivityAdd?: (personaId: string, activity: Partial<UserActivity>) => void;
	onActivityRemove?: (activityId: string) => void;
	onActivityUpdate?: (activityId: string, updates: Partial<UserActivity>) => void;
	onTaskAdd?: (activityId: string, task: Partial<Task>) => void;
	onTaskRemove?: (taskId: string) => void;
	onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
	onStoryAdd?: (taskId: string, story: Partial<UserStory>) => void;
	onStoryRemove?: (storyId: string) => void;
	onStoryUpdate?: (storyId: string, updates: Partial<UserStory>) => void;
	onReleaseAdd?: (release: Partial<Release>) => void;
	onReleaseRemove?: (releaseId: string) => void;
	onReleaseUpdate?: (releaseId: string, updates: Partial<Release>) => void;
	onItemMove?: (event: DragEvent) => void;
	onBoardUpdate?: (updates: Partial<UserStoryMapBoard>) => void;
}

/**
 * Props interface for the UserStoryCard component
 */
export interface UserStoryCardProps {
	story: UserStory;
	taskId: string;
	index: number;
	allowEdit?: boolean;
	allowRemove?: boolean;
	allowDrag?: boolean;
	showStoryPoints?: boolean;

	// Event handlers
	onUpdate?: (updates: Partial<UserStory>) => void;
	onRemove?: () => void;
	onDragStart?: (event: DragEvent) => void;
	onDragEnd?: (event: DragEvent) => void;
	onMoveUp?: () => void;
	onMoveDown?: () => void;
}

/**
 * Props interface for the TaskColumn component
 */
export interface TaskColumnProps {
	task: Task;
	activity: UserActivity;
	userStories: UserStory[];
	index: number;
	allowAddStory?: boolean;
	allowRemoveTask?: boolean;
	allowEditTask?: boolean;
	allowDragStory?: boolean;
	showStoryPoints?: boolean;
	showActions?: boolean;

	// Event handlers
	onStoryAdd?: (story: Partial<UserStory>) => void;
	onStoryUpdate?: (storyId: string, updates: Partial<UserStory>) => void;
	onStoryRemove?: (storyId: string) => void;
	onStoryMove?: (event: DragEvent) => void;
	onTaskUpdate?: (updates: Partial<Task>) => void;
	onTaskRemove?: () => void;
	onTaskMove?: (direction: 'left' | 'right') => void;
}

/**
 * Props interface for the ActivityRow component
 */
export interface ActivityRowProps {
	activity: UserActivity;
	persona: UserPersona;
	tasks: Task[];
	userStories: UserStory[];
	index: number;
	allowAddTask?: boolean;
	allowRemoveActivity?: boolean;
	allowEditActivity?: boolean;
	allowDragTask?: boolean;
	showStoryPoints?: boolean;
	showActions?: boolean;

	// Event handlers
	onTaskAdd?: (task: Partial<Task>) => void;
	onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
	onTaskRemove?: (taskId: string) => void;
	onTaskMove?: (event: DragEvent) => void;
	onActivityUpdate?: (updates: Partial<UserActivity>) => void;
	onActivityRemove?: () => void;
	onActivityMove?: (direction: 'up' | 'down') => void;
	onStoryAdd?: (taskId: string, story: Partial<UserStory>) => void;
	onStoryUpdate?: (storyId: string, updates: Partial<UserStory>) => void;
	onStoryRemove?: (storyId: string) => void;
	onStoryMove?: (event: DragEvent) => void;
}

/**
 * Props interface for the PersonaColumn component
 */
export interface PersonaColumnProps {
	persona: UserPersona;
	activities: UserActivity[];
	tasks: Task[];
	userStories: UserStory[];
	index: number;
	allowAddActivity?: boolean;
	allowRemovePersona?: boolean;
	allowEditPersona?: boolean;
	allowDragActivity?: boolean;
	showStoryPoints?: boolean;
	showActions?: boolean;

	// Event handlers
	onActivityAdd?: (activity: Partial<UserActivity>) => void;
	onActivityUpdate?: (activityId: string, updates: Partial<UserActivity>) => void;
	onActivityRemove?: (activityId: string) => void;
	onActivityMove?: (event: DragEvent) => void;
	onPersonaUpdate?: (updates: Partial<UserPersona>) => void;
	onPersonaRemove?: () => void;
	onPersonaMove?: (direction: 'left' | 'right') => void;
	onTaskAdd?: (activityId: string, task: Partial<Task>) => void;
	onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
	onTaskRemove?: (taskId: string) => void;
	onTaskMove?: (event: DragEvent) => void;
	onStoryAdd?: (taskId: string, story: Partial<UserStory>) => void;
	onStoryUpdate?: (storyId: string, updates: Partial<UserStory>) => void;
	onStoryRemove?: (storyId: string) => void;
	onStoryMove?: (event: DragEvent) => void;
}

/**
 * Props interface for the ReleaseRow component
 */
export interface ReleaseRowProps {
	release: Release;
	userStories: UserStory[];
	allStories: UserStory[];
	index: number;
	allowEdit?: boolean;
	allowRemove?: boolean;
	allowDrag?: boolean;
	showActions?: boolean;

	// Event handlers
	onUpdate?: (updates: Partial<Release>) => void;
	onRemove?: () => void;
	onStoryAssign?: (storyId: string) => void;
	onStoryUnassign?: (storyId: string) => void;
	onMove?: (direction: 'up' | 'down') => void;
}

/**
 * Internal drag state interface
 */
export interface DragState {
	isDragging: boolean;
	draggedItem: UserStory | Task | UserActivity | Release | null;
	draggedItemType: 'story' | 'task' | 'activity' | 'release' | null;
	sourcePosition: DragPosition | null;
	targetPosition: DragPosition | null;
	dragOffset: { x: number; y: number };
	dragElement: HTMLElement | null;
}

/**
 * User story map view model state interface
 */
export interface UserStoryMapViewModelState {
	board: UserStoryMapBoard | null;
	personas: UserPersona[];
	activities: UserActivity[];
	tasks: Task[];
	userStories: UserStory[];
	releases: Release[];
	dragState: DragState;
	editingStory: { taskId: string; storyId: string } | null;
	editingTask: { activityId: string; taskId: string } | null;
	editingActivity: { personaId: string; activityId: string } | null;
	editingPersona: string | null;
	editingRelease: string | null;
}

/**
 * Localization strings interface
 */
export interface UserStoryMapLocale {
	addPersona: string;
	addActivity: string;
	addTask: string;
	addStory: string;
	addRelease: string;
	newPersona: string;
	newActivity: string;
	newTask: string;
	newStory: string;
	newRelease: string;
	removePersona: string;
	removeActivity: string;
	removeTask: string;
	removeStory: string;
	removeRelease: string;
	editPersona: string;
	editActivity: string;
	editTask: string;
	editStory: string;
	editRelease: string;
	saveChanges: string;
	cancel: string;
	name: string;
	title: string;
	description: string;
	role: string;
	goals: string;
	painPoints: string;
	asA: string;
	iWant: string;
	soThat: string;
	storyPoints: string;
	acceptanceCriteria: string;
	priority: string;
	status: string;
	assignee: string;
	labels: string;
	tags: string;
	estimatedEffort: string;
	estimatedDuration: string;
	version: string;
	targetDate: string;
	features: string;
	moveUp: string;
	moveDown: string;
	moveLeft: string;
	moveRight: string;
	priorities: {
		low: string;
		medium: string;
		high: string;
	};
	statuses: {
		draft: string;
		ready: string;
		inProgress: string;
		testing: string;
		done: string;
		active: string;
		completed: string;
		archived: string;
		planning: string;
		development: string;
		released: string;
	};
}

/**
 * Theme configuration interface
 */
export interface UserStoryMapTheme {
	colors: {
		background: string;
		surface: string;
		border: string;
		text: {
			primary: string;
			secondary: string;
			muted: string;
		};
		persona: {
			background: string;
			border: string;
			header: string;
		};
		activity: {
			background: string;
			border: string;
			header: string;
		};
		task: {
			background: string;
			border: string;
			header: string;
		};
		story: {
			background: string;
			border: string;
			shadow: string;
		};
		release: {
			background: string;
			border: string;
			header: string;
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
