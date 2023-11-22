import { test, expect } from '@playwright/test';

// Feature: Filtering by ASC and DESC on columns
test.describe('Filtering by ASC and DESC on columns', () => {

  // Test Case 1: Verify the presence of clickable columns
  test('Presence of clickable columns', async ({ page }) => {
    await page.goto('https://computer-database.gatling.io/computers');
    const introducedColumn = await page.$('text=Introduced');
    const discontinuedColumn = await page.$('text=Discontinued');
    const companyColumn = await page.$('text=Company');
    await expect(introducedColumn).toBeTruthy();
    await expect(discontinuedColumn).toBeTruthy();
    await expect(companyColumn).toBeTruthy();
  });

  // Test Case 2: Clicking on "Introduced" column to filter by ASC and DESC
  test('Clicking on "Introduced" column to filter by ASC and DESC', async ({ page }) => {
    await page.goto('https://computer-database.gatling.io/computers');
    await page.click('text=Introduced');
    expect (await page.locator("await page.locator('xpath=(//td[contains(text(),'-')])[1]')"))//Validate ASC order
    await page.click('text=Introduced'); // Click again to change to DESC order
    expect (await page.locator("xpath=(//td[normalize-space()='14 Oct 2011'])[1]"))//  Validate DESC order
    
  });

  // Test Case 3: Clicking on "Discontinued" column to filter by ASC and DESC
  test('Clicking on "Discontinued" column to filter by ASC and DESC', async ({ page }) => {
    await page.goto('https://computer-database.gatling.io/computers');
    await page.click('text=Discontinued');
    expect(await page.locator('cssSelector=await page.locator("xpath=tbody tr:nth-child(1) td:nth-child(2))'))//ASC order validation
    await page.click('text=Discontinued'); // Click again to change to DESC order
    expect(await page.locator("xpath=//td[normalize-space()='02 Mar 2011']"))//DESC order validation
  });

  // Test Case 4: Clicking on "Company" column to filter by ASC and DESC
  test('Clicking on "Company" column to filter by ASC and DESC', async ({ page }) => {
    await page.goto('https://computer-database.gatling.io/computers');
    await page.click('text=Company');
    expect(await page.locator("xpath=(//td[contains(text(),'-')])[3]"))//ASC order validation
    await page.click('text=Company'); // Click again to change to DESC order
    expect(await page.locator("xpath=//td[normalize-space()='Zemmix']")) //DESC order validation
  });

});
