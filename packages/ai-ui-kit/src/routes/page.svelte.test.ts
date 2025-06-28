import { page } from '@vitest/browser/context';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	it('should render main hero heading', async () => {
		render(Page);

		const heading = page.getByRole('heading', { name: /Beautiful Chat Interfaces/i });
		await expect.element(heading).toBeInTheDocument();
	});

	it('should render chat demo heading', async () => {
		render(Page);

		const chatHeading = page.getByRole('heading', { name: /AI UI Kit Demo/i });
		await expect.element(chatHeading).toBeInTheDocument();
	});
});
