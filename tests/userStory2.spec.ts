import { test, expect } from '@playwright/test';

// Feature: Filtering computers by name
test.describe('Filtering computers by name', () => {

  // Test Case 1: Verify the presence of "Filter by name" button and input field
  test('Presence of "Filter by name" button and input field', async ({ page }) => {
    await page.goto('https://computer-database.gatling.io/computers');
    const filterButton = await page.$('#searchsubmit');
    const filterInput = await page.$('#searchbox');
    expect(filterButton).toBeTruthy();
    expect(filterInput).toBeTruthy();
  });

  // Test Case 2: Entering a valid computer name and clicking "Filter by name" and validate
  test('Entering a valid computer name and clicking "Filter by name" and validate', async ({ page }) => {
    await page.goto('https://computer-database.gatling.io/computers');
    await page.fill('#searchbox', 'Amiga');
    await page.click('#searchsubmit');
    await expect(await page.isVisible(`text=Amiga`)).toBeTruthy();
  });

  // Test Case 3: Entering an invalid computer name and clicking "Filter by name" and validate
  test('Entering an invalid computer name and clicking "Filter by name" and validate', async ({ page }) => {
    await page.goto('https://computer-database.gatling.io/computers');
    await page.fill('#searchbox', 'InvalidComputerName');
    await page.click('#searchsubmit');
    await expect(await page.isVisible(`text=InvalidComputerName`)).toBeFalsy();
  });


  // Test Case 4: Filtering with case sensitivity and validate
  test('Filtering with case sensitivity and validate', async ({ page }) => {
    await page.goto('https://computer-database.gatling.io/computers');
    await page.fill('#searchbox', 'ace');
    await page.click('#searchsubmit');
    await expect(await page.isVisible(`text=ace`)).toBeTruthy();

  });

  // Test Case 5: Multiple filters and validate
  test('Multiple filters and validate', async ({ page }) => {
    await page.goto('https://computer-database.gatling.io/computers');
    await page.fill('#searchbox', 'ACR');
    await page.click('#searchsubmit');
    await page.fill('#searchbox', 'Amiga');
    await page.click('#searchsubmit');
    await expect(await page.isVisible(`text=ACR`)).toBeFalsy();
    await expect(await page.isVisible(`text=Amiga`)).toBeTruthy();
  });

});
