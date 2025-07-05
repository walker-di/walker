import type { Meta, StoryObj } from '@storybook/svelte';
import BacklogView from './backlog-view.svelte';
import type { BacklogViewProps, Epic, UserStory, Release } from './types/backlog.js';
import { createEpic, createUserStory, createRelease } from './utils/backlog-utils.js';

const meta: Meta<BacklogView> = {
	title: 'Components/BacklogView',
	component: BacklogView,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: 'A comprehensive backlog management component with story mapping capabilities, similar to JobDIR Visual Paradigm Enterprise interface.'
			}
		}
	},
	argTypes: {
		viewMode: {
			control: { type: 'select' },
			options: ['story-map', 'backlog', 'sprint'],
			description: 'The current view mode'
		},
		allowAddEpic: {
			control: 'boolean',
			description: 'Whether users can add new epics'
		},
		allowRemoveEpic: {
			control: 'boolean',
			description: 'Whether users can remove epics'
		},
		allowAddStory: {
			control: 'boolean',
			description: 'Whether users can add new stories'
		},
		allowRemoveStory: {
			control: 'boolean',
			description: 'Whether users can remove stories'
		},
		allowAddRelease: {
			control: 'boolean',
			description: 'Whether users can add new releases'
		},
		allowRemoveRelease: {
			control: 'boolean',
			description: 'Whether users can remove releases'
		},
		allowDragDrop: {
			control: 'boolean',
			description: 'Whether drag and drop is enabled'
		},
		showStoryPoints: {
			control: 'boolean',
			description: 'Whether to show story points'
		},
		showUnscheduled: {
			control: 'boolean',
			description: 'Whether to show unscheduled section'
		},
		theme: {
			control: { type: 'select' },
			options: ['light', 'dark'],
			description: 'The theme to use'
		}
	},
	tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data for stories
const sampleEpics: Epic[] = [
	createEpic({
		title: 'Organize Job Fair',
		description: 'Coordinate and manage job fair events',
		color: '#FF9500',
		priority: 'high',
		status: 'in-progress',
		order: 0,
		estimatedEffort: '2 weeks',
		businessValue: 85,
		tags: ['recruitment', 'events']
	}),
	createEpic({
		title: 'General Activity',
		description: 'General platform activities and maintenance',
		color: '#007AFF',
		priority: 'medium',
		status: 'backlog',
		order: 1,
		estimatedEffort: '1 week',
		businessValue: 60,
		tags: ['platform', 'maintenance']
	}),
	createEpic({
		title: 'Find Job',
		description: 'Job search and discovery features',
		color: '#34C759',
		priority: 'critical',
		status: 'ready',
		order: 2,
		estimatedEffort: '3 weeks',
		businessValue: 95,
		tags: ['search', 'jobs']
	}),
	createEpic({
		title: 'Manage Vacancy',
		description: 'Vacancy management for employers',
		color: '#FF9F0A',
		priority: 'high',
		status: 'in-progress',
		order: 3,
		estimatedEffort: '2 weeks',
		businessValue: 80,
		tags: ['employers', 'vacancies']
	}),
	createEpic({
		title: 'Recruit Candidate',
		description: 'Candidate recruitment and selection process',
		color: '#AF52DE',
		priority: 'high',
		status: 'testing',
		order: 4,
		estimatedEffort: '4 weeks',
		businessValue: 90,
		tags: ['recruitment', 'candidates']
	})
];

const sampleReleases: Release[] = [
	createRelease({
		name: '1.0',
		description: 'Initial release with core functionality',
		version: '1.0.0',
		status: 'development',
		targetDate: new Date('2024-03-15'),
		order: 0,
		goals: ['Core job search', 'Basic user management', 'Employer dashboard'],
		features: ['Job search', 'User profiles', 'Application tracking']
	}),
	createRelease({
		name: '2.0',
		description: 'Enhanced features and improvements',
		version: '2.0.0',
		status: 'planning',
		targetDate: new Date('2024-06-15'),
		order: 1,
		goals: ['Advanced search', 'Analytics', 'Mobile app'],
		features: ['Advanced filters', 'Reporting', 'Mobile interface']
	})
];

const sampleUserStories: UserStory[] = [
	// Release 1.0 stories
	createUserStory({
		title: 'Log system events',
		description: 'System should log all important events for debugging',
		epicId: sampleEpics[1].id,
		releaseId: sampleReleases[0].id,
		storyPoints: 3,
		priority: 'medium',
		status: 'done',
		type: 'story',
		order: 0
	}),
	createUserStory({
		title: 'Perform general search',
		description: 'Users should be able to search for jobs using keywords',
		epicId: sampleEpics[2].id,
		releaseId: sampleReleases[0].id,
		storyPoints: 5,
		priority: 'high',
		status: 'in-progress',
		type: 'feature',
		order: 1,
		asA: 'job seeker',
		iWant: 'to search for jobs using keywords',
		soThat: 'I can find relevant opportunities'
	}),
	createUserStory({
		title: 'Upload resume',
		description: 'Allow users to upload their resume files',
		epicId: sampleEpics[2].id,
		releaseId: sampleReleases[0].id,
		storyPoints: 8,
		priority: 'high',
		status: 'ready',
		type: 'feature',
		order: 2
	}),
	createUserStory({
		title: 'Subscribe for Job Alert',
		description: 'Users can subscribe to receive job alerts via email',
		epicId: sampleEpics[2].id,
		releaseId: sampleReleases[0].id,
		storyPoints: 5,
		priority: 'medium',
		status: 'backlog',
		type: 'feature',
		order: 3
	}),
	createUserStory({
		title: 'Submit job vacancy',
		description: 'Employers can submit new job vacancies',
		epicId: sampleEpics[3].id,
		releaseId: sampleReleases[0].id,
		storyPoints: 8,
		priority: 'high',
		status: 'ready',
		type: 'feature',
		order: 4
	}),
	createUserStory({
		title: 'Edit vacancy',
		description: 'Employers can edit existing job vacancies',
		epicId: sampleEpics[3].id,
		releaseId: sampleReleases[0].id,
		storyPoints: 5,
		priority: 'medium',
		status: 'backlog',
		type: 'feature',
		order: 5
	}),
	createUserStory({
		title: 'Remove a vacancy',
		description: 'Employers can remove job vacancies',
		epicId: sampleEpics[3].id,
		releaseId: sampleReleases[0].id,
		storyPoints: 3,
		priority: 'medium',
		status: 'backlog',
		type: 'feature',
		order: 6
	}),
	createUserStory({
		title: 'Review application list',
		description: 'Employers can review list of job applications',
		epicId: sampleEpics[4].id,
		releaseId: sampleReleases[0].id,
		storyPoints: 5,
		priority: 'high',
		status: 'testing',
		type: 'feature',
		order: 7
	}),
	createUserStory({
		title: 'Send PM to seeker',
		description: 'Employers can send private messages to job seekers',
		epicId: sampleEpics[4].id,
		releaseId: sampleReleases[0].id,
		storyPoints: 8,
		priority: 'medium',
		status: 'backlog',
		type: 'feature',
		order: 8
	}),

	// Release 2.0 stories
	createUserStory({
		title: 'Archive system data per hour',
		description: 'System should automatically archive old data',
		epicId: sampleEpics[1].id,
		releaseId: sampleReleases[1].id,
		storyPoints: 5,
		priority: 'low',
		status: 'backlog',
		type: 'task',
		order: 9
	}),
	createUserStory({
		title: 'Build resume online',
		description: 'Users can build their resume using online tools',
		epicId: sampleEpics[2].id,
		releaseId: sampleReleases[1].id,
		storyPoints: 13,
		priority: 'medium',
		status: 'backlog',
		type: 'feature',
		order: 10
	}),
	createUserStory({
		title: 'Receive SMS notification for Job Alert',
		description: 'Users can receive job alerts via SMS',
		epicId: sampleEpics[2].id,
		releaseId: sampleReleases[1].id,
		storyPoints: 8,
		priority: 'low',
		status: 'backlog',
		type: 'feature',
		order: 11
	}),
	createUserStory({
		title: 'Approve vacancy submission',
		description: 'Admin can approve submitted job vacancies',
		epicId: sampleEpics[3].id,
		releaseId: sampleReleases[1].id,
		storyPoints: 5,
		priority: 'medium',
		status: 'backlog',
		type: 'feature',
		order: 12
	}),
	createUserStory({
		title: 'Approve vacancy amendment',
		description: 'Admin can approve changes to job vacancies',
		epicId: sampleEpics[3].id,
		releaseId: sampleReleases[1].id,
		storyPoints: 3,
		priority: 'low',
		status: 'backlog',
		type: 'feature',
		order: 13
	}),
	createUserStory({
		title: 'Receive notification for expired post',
		description: 'Employers receive notifications when job posts expire',
		epicId: sampleEpics[3].id,
		releaseId: sampleReleases[1].id,
		storyPoints: 3,
		priority: 'low',
		status: 'backlog',
		type: 'feature',
		order: 14
	}),
	createUserStory({
		title: 'Perform advanced candidate',
		description: 'Advanced candidate search and filtering',
		epicId: sampleEpics[4].id,
		releaseId: sampleReleases[1].id,
		storyPoints: 8,
		priority: 'medium',
		status: 'backlog',
		type: 'feature',
		order: 15
	}),
	createUserStory({
		title: 'Invite for interview',
		description: 'Employers can invite candidates for interviews',
		epicId: sampleEpics[4].id,
		releaseId: sampleReleases[1].id,
		storyPoints: 5,
		priority: 'high',
		status: 'backlog',
		type: 'feature',
		order: 16
	}),

	// Unscheduled stories
	createUserStory({
		title: 'Save search settings within session',
		description: 'Save user search preferences during session',
		epicId: sampleEpics[2].id,
		storyPoints: 2,
		priority: 'low',
		status: 'backlog',
		type: 'task',
		order: 17
	}),
	createUserStory({
		title: 'Complete job seeker questionnaire',
		description: 'Job seekers complete profile questionnaire',
		epicId: sampleEpics[2].id,
		storyPoints: 5,
		priority: 'medium',
		status: 'backlog',
		type: 'feature',
		order: 18
	}),
	createUserStory({
		title: 'Duplicate vacancy',
		description: 'Employers can duplicate existing job vacancies',
		epicId: sampleEpics[3].id,
		storyPoints: 3,
		priority: 'low',
		status: 'backlog',
		type: 'feature',
		order: 19
	}),
	createUserStory({
		title: 'Bookmark a Candidate',
		description: 'Employers can bookmark interesting candidates',
		epicId: sampleEpics[4].id,
		storyPoints: 3,
		priority: 'medium',
		status: 'backlog',
		type: 'feature',
		order: 20
	})
];

// Default story
export const Default: Story = {
	args: {
		epics: sampleEpics,
		userStories: sampleUserStories,
		releases: sampleReleases,
		viewMode: 'story-map',
		allowAddEpic: true,
		allowRemoveEpic: true,
		allowAddStory: true,
		allowRemoveStory: true,
		allowAddRelease: true,
		allowRemoveRelease: true,
		allowDragDrop: true,
		showStoryPoints: true,
		showUnscheduled: true,
		theme: 'light'
	}
};

// Empty state
export const Empty: Story = {
	args: {
		epics: [],
		userStories: [],
		releases: [],
		viewMode: 'story-map',
		allowAddEpic: true,
		allowRemoveEpic: true,
		allowAddStory: true,
		allowRemoveStory: true,
		allowAddRelease: true,
		allowRemoveRelease: true,
		allowDragDrop: true,
		showStoryPoints: true,
		showUnscheduled: true,
		theme: 'light'
	}
};

// Read-only mode
export const ReadOnly: Story = {
	args: {
		epics: sampleEpics,
		userStories: sampleUserStories,
		releases: sampleReleases,
		viewMode: 'story-map',
		allowAddEpic: false,
		allowRemoveEpic: false,
		allowAddStory: false,
		allowRemoveStory: false,
		allowAddRelease: false,
		allowRemoveRelease: false,
		allowDragDrop: false,
		showStoryPoints: true,
		showUnscheduled: true,
		theme: 'light'
	}
};

// Dark theme
export const DarkTheme: Story = {
	args: {
		epics: sampleEpics,
		userStories: sampleUserStories,
		releases: sampleReleases,
		viewMode: 'story-map',
		allowAddEpic: true,
		allowRemoveEpic: true,
		allowAddStory: true,
		allowRemoveStory: true,
		allowAddRelease: true,
		allowRemoveRelease: true,
		allowDragDrop: true,
		showStoryPoints: true,
		showUnscheduled: true,
		theme: 'dark'
	},
	parameters: {
		backgrounds: { default: 'dark' }
	}
};

// Without story points
export const WithoutStoryPoints: Story = {
	args: {
		epics: sampleEpics,
		userStories: sampleUserStories,
		releases: sampleReleases,
		viewMode: 'story-map',
		allowAddEpic: true,
		allowRemoveEpic: true,
		allowAddStory: true,
		allowRemoveStory: true,
		allowAddRelease: true,
		allowRemoveRelease: true,
		allowDragDrop: true,
		showStoryPoints: false,
		showUnscheduled: true,
		theme: 'light'
	}
};

// Without unscheduled section
export const WithoutUnscheduled: Story = {
	args: {
		epics: sampleEpics,
		userStories: sampleUserStories.filter(s => s.releaseId), // Only scheduled stories
		releases: sampleReleases,
		viewMode: 'story-map',
		allowAddEpic: true,
		allowRemoveEpic: true,
		allowAddStory: true,
		allowRemoveStory: true,
		allowAddRelease: true,
		allowRemoveRelease: true,
		allowDragDrop: true,
		showStoryPoints: true,
		showUnscheduled: false,
		theme: 'light'
	}
};
