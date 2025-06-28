import { expect, test } from '@playwright/test';

test('home page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1').first()).toBeVisible();
});

test('home page has main hero heading', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: /Beautiful Chat Interfaces/i })).toBeVisible();
});

test('home page has chat demo heading', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: /AI UI Kit Demo/i })).toBeVisible();
});
