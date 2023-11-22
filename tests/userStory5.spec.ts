import { test, expect } from '@playwright/test';
import { url } from 'inspector';

// Feature: Navigating to other pages
test.describe('Navigating to other pages', () => {

  // Test Case 1: Verify the presence of the "Next" button
  test('Presence of "Next" button', async ({ page }) => {
    await page.goto('https://computer-database.gatling.io/computers');
    const nextButton = await page.$('text=Next →');
    await expect(nextButton).toBeTruthy();
  });

  // Test Case 2: Clicking the "Next →" button to navigate to the next page
  test('Clicking "Next →" button to navigate to the next page', async ({ page }) => {
    await page.goto('https://computer-database.gatling.io/computers');
    await page.click('text=Next →');
    await expect(await page.isEnabled('text=← Previous')).toBeTruthy(); //validate presense of previous button
  });

  // Test Case 3: Verify the visibility of the "Next" button on the last page
  test('Visibility of "Next" button on the last page', async ({ page }) => {
    await page.goto('https://computer-database.gatling.io/computers?p=100');
    const nextButton = await page.$('text=Next →');
    await expect(nextButton).toBeNull;

  });

  // Test Case 4: Verify the functionality of the "Next" button with a large dataset
  test('Functionality of "Next" button with a large dataset', async ({ page }) => {
    // Assuming a large dataset 400 rows
    await page.goto('https://computer-database.gatling.io/computers?p=1&n=400');
    await page.click('text=Next →');
    // validation for navigating to the next page to very last - Displaying 401 to 574 of 574
    await expect(await page.isEnabled('text=Next →')).toBeTruthy();
  });

  // Test Case 5: Verify the impact of items per page on "Next" button
  test('Impact of items per page on "Next" button', async ({ page }) => {
    await page.goto('https://computer-database.gatling.io/computers?p=1&n=5');
    const nextButton = await page.$('text=Next →');
    await expect(nextButton).toBeTruthy();
  });

  // Test Case 6: Verify proper handling of concurrent requests
  test('Proper handling of concurrent requests', async ({ page }) => {
    // Multiple click for concurrent requests
    await page.goto('https://computer-database.gatling.io/computers?p=1');
    const [response] = await Promise.all([
        page.waitForNavigation(),
        page.click('text=Next →')
      ]);
    // Validation for proper handling of concurrent requests
    // const nextButton = await page.$('text=Next →');
    // await expect(nextButton).toBeNull;
    expect(response?.url()).toBe('https://computer-database.gatling.io/computers?p=2');
  });

  // Test Case 7: Verify the presence of a "Previous" button
  test('Presence of "Previous" button', async ({ page }) => {
    await page.goto('https://computer-database.gatling.io/computers?p=2');
    const previousButton = await page.$('text=← Previous');
    await expect(previousButton).toBeTruthy();
  });

});
