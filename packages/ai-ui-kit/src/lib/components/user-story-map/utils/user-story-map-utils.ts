import type {
	UserPersona,
	UserActivity,
	Task,
	UserStory,
	Release,
	UserStoryMapBoard,
	UserStoryMapLocale,
	DragEvent
} from '../types/user-story-map.js';

/**
 * Generate a unique ID
 */
export function generateId(): string {
	return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new user persona
 */
export function createPersona(data: Partial<UserPersona> = {}): UserPersona {
	return {
		id: generateId(),
		name: data.name || 'New Persona',
		description: data.description || '',
		avatar: data.avatar,
		role: data.role || '',
		goals: data.goals || [],
		painPoints: data.painPoints || [],
		color: data.color || getRandomColor(),
		createdAt: new Date(),
		updatedAt: new Date(),
		...data
	};
}

/**
 * Create a new user activity
 */
export function createActivity(personaId: string, data: Partial<UserActivity> = {}): UserActivity {
	return {
		id: generateId(),
		title: data.title || 'New Activity',
		description: data.description || '',
		personaId,
		order: data.order || 0,
		color: data.color || getRandomColor(),
		estimatedDuration: data.estimatedDuration,
		priority: data.priority || 'medium',
		status: data.status || 'draft',
		createdAt: new Date(),
		updatedAt: new Date(),
		...data
	};
}

/**
 * Create a new task
 */
export function createTask(activityId: string, data: Partial<Task> = {}): Task {
	return {
		id: generateId(),
		title: data.title || 'New Task',
		description: data.description || '',
		activityId,
		order: data.order || 0,
		estimatedEffort: data.estimatedEffort,
		acceptanceCriteria: data.acceptanceCriteria || [],
		dependencies: data.dependencies || [],
		tags: data.tags || [],
		priority: data.priority || 'medium',
		status: data.status || 'backlog',
		createdAt: new Date(),
		updatedAt: new Date(),
		...data
	};
}

/**
 * Create a new user story
 */
export function createUserStory(taskId: string, data: Partial<UserStory> = {}): UserStory {
	return {
		id: generateId(),
		title: data.title || 'New User Story',
		description: data.description || '',
		asA: data.asA || 'user',
		iWant: data.iWant || 'functionality',
		soThat: data.soThat || 'benefit',
		taskId,
		order: data.order || 0,
		storyPoints: data.storyPoints,
		acceptanceCriteria: data.acceptanceCriteria || [],
		testCases: data.testCases || [],
		priority: data.priority || 'medium',
		status: data.status || 'draft',
		assignee: data.assignee,
		labels: data.labels || [],
		createdAt: new Date(),
		updatedAt: new Date(),
		...data
	};
}

/**
 * Create a new release
 */
export function createRelease(data: Partial<Release> = {}): Release {
	return {
		id: generateId(),
		name: data.name || 'New Release',
		description: data.description || '',
		version: data.version,
		targetDate: data.targetDate,
		status: data.status || 'planning',
		userStoryIds: data.userStoryIds || [],
		goals: data.goals || [],
		features: data.features || [],
		color: data.color || getRandomColor(),
		createdAt: new Date(),
		updatedAt: new Date(),
		...data
	};
}

/**
 * Create a new user story map board
 */
export function createBoard(data: Partial<UserStoryMapBoard> = {}): UserStoryMapBoard {
	return {
		id: generateId(),
		title: data.title || 'User Story Map',
		description: data.description || '',
		personas: data.personas || [],
		activities: data.activities || [],
		tasks: data.tasks || [],
		userStories: data.userStories || [],
		releases: data.releases || [],
		createdAt: new Date(),
		updatedAt: new Date(),
		...data
	};
}

/**
 * Get a random color for visual distinction
 */
export function getRandomColor(): string {
	const colors = [
		'#3B82F6', // blue
		'#10B981', // emerald
		'#F59E0B', // amber
		'#EF4444', // red
		'#8B5CF6', // violet
		'#06B6D4', // cyan
		'#84CC16', // lime
		'#F97316', // orange
		'#EC4899', // pink
		'#6366F1'  // indigo
	];
	return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Update a persona
 */
export function updatePersona(persona: UserPersona, updates: Partial<UserPersona>): UserPersona {
	return {
		...persona,
		...updates,
		updatedAt: new Date()
	};
}

/**
 * Update an activity
 */
export function updateActivity(activity: UserActivity, updates: Partial<UserActivity>): UserActivity {
	return {
		...activity,
		...updates,
		updatedAt: new Date()
	};
}

/**
 * Update a task
 */
export function updateTask(task: Task, updates: Partial<Task>): Task {
	return {
		...task,
		...updates,
		updatedAt: new Date()
	};
}

/**
 * Update a user story
 */
export function updateUserStory(story: UserStory, updates: Partial<UserStory>): UserStory {
	return {
		...story,
		...updates,
		updatedAt: new Date()
	};
}

/**
 * Update a release
 */
export function updateRelease(release: Release, updates: Partial<Release>): Release {
	return {
		...release,
		...updates,
		updatedAt: new Date()
	};
}

/**
 * Remove a persona and all related data
 */
export function removePersona(
	personas: UserPersona[],
	activities: UserActivity[],
	tasks: Task[],
	userStories: UserStory[],
	personaId: string
): {
	personas: UserPersona[];
	activities: UserActivity[];
	tasks: Task[];
	userStories: UserStory[];
} {
	const relatedActivities = activities.filter(a => a.personaId === personaId);
	const relatedActivityIds = relatedActivities.map(a => a.id);
	const relatedTasks = tasks.filter(t => relatedActivityIds.includes(t.activityId));
	const relatedTaskIds = relatedTasks.map(t => t.id);

	return {
		personas: personas.filter(p => p.id !== personaId),
		activities: activities.filter(a => a.personaId !== personaId),
		tasks: tasks.filter(t => !relatedActivityIds.includes(t.activityId)),
		userStories: userStories.filter(s => !relatedTaskIds.includes(s.taskId))
	};
}

/**
 * Remove an activity and all related data
 */
export function removeActivity(
	activities: UserActivity[],
	tasks: Task[],
	userStories: UserStory[],
	activityId: string
): {
	activities: UserActivity[];
	tasks: Task[];
	userStories: UserStory[];
} {
	const relatedTasks = tasks.filter(t => t.activityId === activityId);
	const relatedTaskIds = relatedTasks.map(t => t.id);

	return {
		activities: activities.filter(a => a.id !== activityId),
		tasks: tasks.filter(t => t.activityId !== activityId),
		userStories: userStories.filter(s => !relatedTaskIds.includes(s.taskId))
	};
}

/**
 * Remove a task and all related user stories
 */
export function removeTask(
	tasks: Task[],
	userStories: UserStory[],
	taskId: string
): {
	tasks: Task[];
	userStories: UserStory[];
} {
	return {
		tasks: tasks.filter(t => t.id !== taskId),
		userStories: userStories.filter(s => s.taskId !== taskId)
	};
}

/**
 * Remove a user story
 */
export function removeUserStory(userStories: UserStory[], storyId: string): UserStory[] {
	return userStories.filter(s => s.id !== storyId);
}

/**
 * Remove a release
 */
export function removeRelease(releases: Release[], releaseId: string): Release[] {
	return releases.filter(r => r.id !== releaseId);
}

/**
 * Reorder items in an array
 */
export function reorderItems<T extends { order: number }>(items: T[], fromIndex: number, toIndex: number): T[] {
	const result = [...items];
	const [removed] = result.splice(fromIndex, 1);
	result.splice(toIndex, 0, removed);
	
	// Update order values
	return result.map((item, index) => ({
		...item,
		order: index
	}));
}

/**
 * Get activities for a persona
 */
export function getActivitiesForPersona(activities: UserActivity[], personaId: string): UserActivity[] {
	return activities.filter(a => a.personaId === personaId).sort((a, b) => a.order - b.order);
}

/**
 * Get tasks for an activity
 */
export function getTasksForActivity(tasks: Task[], activityId: string): Task[] {
	return tasks.filter(t => t.activityId === activityId).sort((a, b) => a.order - b.order);
}

/**
 * Get user stories for a task
 */
export function getUserStoriesForTask(userStories: UserStory[], taskId: string): UserStory[] {
	return userStories.filter(s => s.taskId === taskId).sort((a, b) => a.order - b.order);
}

/**
 * Get user stories for a release
 */
export function getUserStoriesForRelease(userStories: UserStory[], release: Release): UserStory[] {
	return userStories.filter(s => release.userStoryIds.includes(s.id));
}

/**
 * Calculate total story points for a release
 */
export function calculateReleaseStoryPoints(userStories: UserStory[], release: Release): number {
	const releaseStories = getUserStoriesForRelease(userStories, release);
	return releaseStories.reduce((total, story) => total + (story.storyPoints || 0), 0);
}

/**
 * Get default locale
 */
export function getDefaultLocale(): UserStoryMapLocale {
	return {
		addPersona: 'Add Persona',
		addActivity: 'Add Activity',
		addTask: 'Add Task',
		addStory: 'Add Story',
		addRelease: 'Add Release',
		newPersona: 'New Persona',
		newActivity: 'New Activity',
		newTask: 'New Task',
		newStory: 'New Story',
		newRelease: 'New Release',
		removePersona: 'Remove Persona',
		removeActivity: 'Remove Activity',
		removeTask: 'Remove Task',
		removeStory: 'Remove Story',
		removeRelease: 'Remove Release',
		editPersona: 'Edit Persona',
		editActivity: 'Edit Activity',
		editTask: 'Edit Task',
		editStory: 'Edit Story',
		editRelease: 'Edit Release',
		saveChanges: 'Save Changes',
		cancel: 'Cancel',
		name: 'Name',
		title: 'Title',
		description: 'Description',
		role: 'Role',
		goals: 'Goals',
		painPoints: 'Pain Points',
		asA: 'As a',
		iWant: 'I want',
		soThat: 'So that',
		storyPoints: 'Story Points',
		acceptanceCriteria: 'Acceptance Criteria',
		priority: 'Priority',
		status: 'Status',
		assignee: 'Assignee',
		labels: 'Labels',
		tags: 'Tags',
		estimatedEffort: 'Estimated Effort',
		estimatedDuration: 'Estimated Duration',
		version: 'Version',
		targetDate: 'Target Date',
		features: 'Features',
		moveUp: 'Move Up',
		moveDown: 'Move Down',
		moveLeft: 'Move Left',
		moveRight: 'Move Right',
		priorities: {
			low: 'Low',
			medium: 'Medium',
			high: 'High'
		},
		statuses: {
			draft: 'Draft',
			ready: 'Ready',
			inProgress: 'In Progress',
			testing: 'Testing',
			done: 'Done',
			active: 'Active',
			completed: 'Completed',
			archived: 'Archived',
			planning: 'Planning',
			development: 'Development',
			released: 'Released'
		}
	};
}
