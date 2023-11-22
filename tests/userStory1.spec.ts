import { test, expect } from '@playwright/test';

// Feature: Adding a new computer
test.describe('Adding a new computer', () => {
  
  // Test Case 1: Verify the presence of "Add a new computer" button
  test('Presence of "Add a new computer" button', async ({ page }) => {
    await page.goto('https://computer-database.gatling.io/computers');
    const addButton = await page.$('#add');
    await expect(addButton).toBeTruthy();
  });

  // Test Case 2: Clicking the "Add a new computer" button and validate landing page
  test('Clicking "Add a new computer" button and validate landing page', async ({ page }) => {
    await page.goto('https://computer-database.gatling.io/computers');
    await page.click('#add');
    const pageTitle = await page.$eval('//h1[normalize-space()="Add a computer"]', el => el.textContent);
    await expect(pageTitle).toContain('Add a computer');
  });

  // Test Case 3: Validate the fields on the new computer form
  test('Validate fields on the new computer form', async ({ page }) => {
    await page.goto('https://computer-database.gatling.io/computers');
    await page.click('#add');
    await expect(await page.isVisible('#name')).toBeTruthy();
    await expect(await page.isVisible('#introduced')).toBeTruthy();
    await expect(await page.isVisible('#discontinued')).toBeTruthy();
    await expect(await page.isVisible('#company')).toBeTruthy();
  });

  // Test Case 4: Enter valid information and submit
  test('Enter valid information and submit', async ({ page }) => {
    await page.goto('https://computer-database.gatling.io/computers');
    await page.click('#add');
    await page.fill('#name', 'Test Computer');
    await page.fill('#introduced', '2022-01-01');
    await page.fill('#discontinued', '2023-01-01');
    await page.selectOption("//select[@id='company']", { label: 'Apple Inc.' });

    
    //await page.selectOption("//select[@id='company']", { label: 'Company Name' });
    await page.click('//input[@value="Create this computer"]');

    // validation for successful submission
    expect((await page.isVisible("//strong[normalize-space()='Done !']")))

  });

  // Test Case 5: Enter invalid information and submit
  test('Enter invalid information and submit', async ({ page }) => {
    await page.goto('https://computer-database.gatling.io/computers');
    await page.click('#add');
    await page.fill('#name', 'Test Computer');
    await page.fill('#introduced', '2022-01-01');
    await page.fill('#discontinued', '2023-01-01');
    await page.selectOption("//select[@id='company']", { label: 'Apple Inc.' });

    
    //await page.selectOption("//select[@id='company']", { label: 'Company Name' });
    await page.click('//input[@value="Create this computer"]');

    // validation for failure submission
    expect((await page.isVisible("div[class='clearfix error'] span[class='help-inline']")))

  });

  // Test Case 6: Cancel the operation
  test('Cancel the operation', async ({ page }) => {
    await page.goto('https://computer-database.gatling.io/computers');
    await page.click('#add');
    await page.click('//a[@class="btn"]');
    // validation for returning to the main page 
    expect(await page.getByText('Add a new computer'))
  });

  // Test Case 7: Check for proper error handling
  test('Check for proper error handling', async ({ page }) => {
    await page.goto('https://computer-database.gatling.io/computers');
    await page.click('#add');
    await page.fill('#name', 'Test Computer');
    await page.fill('#introduced', '2022-01-01');
    await page.fill('#discontinued', '2022-01-01');
    await page.click('//input[@value="Create this computer"]');
    //validation for the error message 'Discontinued date is before introduction date'
    expect(await page.getByText('Discontinued date is before introduction date'))
  });

  // Test Case 8: Verify the visibility of the added computer search by computer name
  test('Verify visibility of the added computer in search', async ({ page }) => {
    // A computer with the name 'ACE' exists in list
    await page.goto('https://computer-database.gatling.io/computers');
    await page.fill('#searchbox', 'ACE');
    await page.click('#searchsubmit');
    await expect(await page.isVisible(`text=ACE`)).toBeTruthy();
  });

});

