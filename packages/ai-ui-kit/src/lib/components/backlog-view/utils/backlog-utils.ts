import type {
	Epic,
	UserStory,
	Release,
	Sprint,
	BacklogBoard,
	BacklogLocale,
	Priority,
	Status,
	WorkItemType
} from '../types/backlog.js';

/**
 * Generate a unique ID
 */
export function generateId(): string {
	return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new epic
 */
export function createEpic(data: Partial<Epic> = {}): Epic {
	return {
		id: generateId(),
		title: data.title || 'New Epic',
		description: data.description || '',
		color: data.color || getRandomColor(),
		priority: data.priority || 'medium',
		status: data.status || 'backlog',
		order: data.order || 0,
		estimatedEffort: data.estimatedEffort,
		businessValue: data.businessValue,
		tags: data.tags || [],
		assignee: data.assignee,
		createdAt: new Date(),
		updatedAt: new Date(),
		...data
	};
}

/**
 * Create a new user story
 */
export function createUserStory(data: Partial<UserStory> = {}): UserStory {
	return {
		id: generateId(),
		title: data.title || 'New User Story',
		description: data.description || '',
		asA: data.asA,
		iWant: data.iWant,
		soThat: data.soThat,
		epicId: data.epicId,
		releaseId: data.releaseId,
		sprintId: data.sprintId,
		order: data.order || 0,
		storyPoints: data.storyPoints,
		priority: data.priority || 'medium',
		status: data.status || 'backlog',
		type: data.type || 'story',
		acceptanceCriteria: data.acceptanceCriteria || [],
		testCases: data.testCases || [],
		dependencies: data.dependencies || [],
		tags: data.tags || [],
		assignee: data.assignee,
		labels: data.labels || [],
		color: data.color || getStoryTypeColor(data.type || 'story'),
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
		startDate: data.startDate,
		status: data.status || 'planning',
		goals: data.goals || [],
		features: data.features || [],
		color: data.color || getRandomColor(),
		order: data.order || 0,
		isScheduled: data.isScheduled !== false,
		createdAt: new Date(),
		updatedAt: new Date(),
		...data
	};
}

/**
 * Create a new sprint
 */
export function createSprint(data: Partial<Sprint> = {}): Sprint {
	return {
		id: generateId(),
		name: data.name || 'New Sprint',
		description: data.description || '',
		releaseId: data.releaseId,
		startDate: data.startDate,
		endDate: data.endDate,
		capacity: data.capacity,
		status: data.status || 'planning',
		goals: data.goals || [],
		order: data.order || 0,
		createdAt: new Date(),
		updatedAt: new Date(),
		...data
	};
}

/**
 * Create a new backlog board
 */
export function createBoard(data: Partial<BacklogBoard> = {}): BacklogBoard {
	return {
		id: generateId(),
		title: data.title || 'Product Backlog',
		description: data.description || '',
		epics: data.epics || [],
		userStories: data.userStories || [],
		releases: data.releases || [],
		sprints: data.sprints || [],
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
		'#FF9500', // orange (like in the image)
		'#007AFF', // blue
		'#34C759', // green
		'#FF3B30', // red
		'#AF52DE', // purple
		'#FF9F0A', // amber
		'#5AC8FA', // cyan
		'#FFCC02', // yellow
		'#FF2D92', // pink
		'#30D158'  // mint
	];
	return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Get color for story type
 */
export function getStoryTypeColor(type: WorkItemType): string {
	const typeColors = {
		epic: '#FF9500',     // orange
		feature: '#007AFF',  // blue
		story: '#34C759',    // green
		task: '#FFCC02',     // yellow
		bug: '#FF3B30',      // red
		spike: '#AF52DE'     // purple
	};
	return typeColors[type] || '#34C759';
}

/**
 * Get priority color
 */
export function getPriorityColor(priority: Priority): string {
	const priorityColors = {
		critical: '#FF3B30', // red
		high: '#FF9F0A',     // orange
		medium: '#FFCC02',   // yellow
		low: '#34C759'       // green
	};
	return priorityColors[priority] || '#FFCC02';
}

/**
 * Get status color
 */
export function getStatusColor(status: Status): string {
	const statusColors = {
		backlog: '#8E8E93',    // gray
		ready: '#007AFF',      // blue
		'in-progress': '#FF9F0A', // orange
		testing: '#AF52DE',    // purple
		done: '#34C759',       // green
		blocked: '#FF3B30'     // red
	};
	return statusColors[status] || '#8E8E93';
}

/**
 * Update an epic
 */
export function updateEpic(epic: Epic, updates: Partial<Epic>): Epic {
	return {
		...epic,
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
 * Update a sprint
 */
export function updateSprint(sprint: Sprint, updates: Partial<Sprint>): Sprint {
	return {
		...sprint,
		...updates,
		updatedAt: new Date()
	};
}

/**
 * Remove an epic and all related stories
 */
export function removeEpic(
	epics: Epic[],
	userStories: UserStory[],
	epicId: string
): {
	epics: Epic[];
	userStories: UserStory[];
} {
	return {
		epics: epics.filter(e => e.id !== epicId),
		userStories: userStories.filter(s => s.epicId !== epicId)
	};
}

/**
 * Remove a user story
 */
export function removeUserStory(userStories: UserStory[], storyId: string): UserStory[] {
	return userStories.filter(s => s.id !== storyId);
}

/**
 * Remove a release and unassign all stories
 */
export function removeRelease(
	releases: Release[],
	userStories: UserStory[],
	releaseId: string
): {
	releases: Release[];
	userStories: UserStory[];
} {
	return {
		releases: releases.filter(r => r.id !== releaseId),
		userStories: userStories.map(s => 
			s.releaseId === releaseId ? { ...s, releaseId: undefined } : s
		)
	};
}

/**
 * Remove a sprint and unassign all stories
 */
export function removeSprint(
	sprints: Sprint[],
	userStories: UserStory[],
	sprintId: string
): {
	sprints: Sprint[];
	userStories: UserStory[];
} {
	return {
		sprints: sprints.filter(s => s.id !== sprintId),
		userStories: userStories.map(s => 
			s.sprintId === sprintId ? { ...s, sprintId: undefined } : s
		)
	};
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
 * Get stories for an epic
 */
export function getStoriesForEpic(userStories: UserStory[], epicId: string): UserStory[] {
	return userStories.filter(s => s.epicId === epicId).sort((a, b) => a.order - b.order);
}

/**
 * Get stories for a release
 */
export function getStoriesForRelease(userStories: UserStory[], releaseId: string): UserStory[] {
	return userStories.filter(s => s.releaseId === releaseId).sort((a, b) => a.order - b.order);
}

/**
 * Get unscheduled stories
 */
export function getUnscheduledStories(userStories: UserStory[]): UserStory[] {
	return userStories.filter(s => !s.releaseId).sort((a, b) => a.order - b.order);
}

/**
 * Get stories for a sprint
 */
export function getStoriesForSprint(userStories: UserStory[], sprintId: string): UserStory[] {
	return userStories.filter(s => s.sprintId === sprintId).sort((a, b) => a.order - b.order);
}

/**
 * Calculate total story points for a release
 */
export function calculateReleaseStoryPoints(userStories: UserStory[], releaseId: string): number {
	const releaseStories = getStoriesForRelease(userStories, releaseId);
	return releaseStories.reduce((total, story) => total + (story.storyPoints || 0), 0);
}

/**
 * Calculate total story points for a sprint
 */
export function calculateSprintStoryPoints(userStories: UserStory[], sprintId: string): number {
	const sprintStories = getStoriesForSprint(userStories, sprintId);
	return sprintStories.reduce((total, story) => total + (story.storyPoints || 0), 0);
}

/**
 * Get default locale
 */
export function getDefaultLocale(): BacklogLocale {
	return {
		// View modes
		storyMap: 'Story Map',
		backlog: 'Backlog',
		sprint: 'Sprint',
		
		// Actions
		addEpic: 'Add Epic',
		addStory: 'Add Story',
		addRelease: 'Add Release',
		addSprint: 'Add Sprint',
		newEpic: 'New Epic',
		newStory: 'New Story',
		newRelease: 'New Release',
		newSprint: 'New Sprint',
		removeEpic: 'Remove Epic',
		removeStory: 'Remove Story',
		removeRelease: 'Remove Release',
		removeSprint: 'Remove Sprint',
		editEpic: 'Edit Epic',
		editStory: 'Edit Story',
		editRelease: 'Edit Release',
		editSprint: 'Edit Sprint',
		saveChanges: 'Save Changes',
		cancel: 'Cancel',
		
		// Fields
		title: 'Title',
		name: 'Name',
		description: 'Description',
		asA: 'As a',
		iWant: 'I want',
		soThat: 'So that',
		storyPoints: 'Story Points',
		acceptanceCriteria: 'Acceptance Criteria',
		priority: 'Priority',
		status: 'Status',
		type: 'Type',
		assignee: 'Assignee',
		labels: 'Labels',
		tags: 'Tags',
		estimatedEffort: 'Estimated Effort',
		businessValue: 'Business Value',
		version: 'Version',
		targetDate: 'Target Date',
		startDate: 'Start Date',
		endDate: 'End Date',
		capacity: 'Capacity',
		goals: 'Goals',
		features: 'Features',
		
		// Navigation
		moveUp: 'Move Up',
		moveDown: 'Move Down',
		moveLeft: 'Move Left',
		moveRight: 'Move Right',
		
		// Sections
		unscheduled: 'Unscheduled',
		
		// Priorities
		priorities: {
			critical: 'Critical',
			high: 'High',
			medium: 'Medium',
			low: 'Low'
		},
		
		// Statuses
		statuses: {
			backlog: 'Backlog',
			ready: 'Ready',
			inProgress: 'In Progress',
			testing: 'Testing',
			done: 'Done',
			blocked: 'Blocked',
			planning: 'Planning',
			development: 'Development',
			released: 'Released',
			cancelled: 'Cancelled',
			active: 'Active',
			completed: 'Completed'
		},
		
		// Work item types
		types: {
			epic: 'Epic',
			feature: 'Feature',
			story: 'Story',
			task: 'Task',
			bug: 'Bug',
			spike: 'Spike'
		}
	};
}
