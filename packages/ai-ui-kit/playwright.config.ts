import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'npm run dev',
		port: 5173,
		timeout: 120 * 1000,
		reuseExistingServer: !process.env.CI
	},
	testDir: 'e2e',
	timeout: 30 * 1000,
	use: {
		baseURL: 'http://localhost:5173'
	},
	reporter: [
		['html', { outputFolder: 'playwright-report' }],
		['json', { outputFile: 'playwright-results.json' }],
		['github']
	]
});
