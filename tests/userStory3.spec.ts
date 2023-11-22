import { test, expect } from '@playwright/test';

// Feature: Editing computer name information
test.describe('Editing computer name information', () => {

  // Test Case 1: Verify the presence of clickable computer names
  test('Presence of clickable computer names', async ({ page }) => {
    await page.goto('https://computer-database.gatling.io/computers');
    const computerNameLink = await page.$('//a[normalize-space()="ACE"]');
    await expect(computerNameLink).toBeTruthy();
  });

  // Test Case 2: Clicking on a computer name to edit
  test('Clicking on a computer name to edit', async ({ page }) => {
    await page.goto('https://computer-database.gatling.io/computers');
    await page.click('//a[normalize-space()="ACE"]');
    const editHeaderText = await page.$eval('//h1[normalize-space()="Edit computer"]', el => el.textContent);
    await expect(editHeaderText).toContain('Edit computer');
  });

  // Test Case 3: Verify the pre-population of computer information for editing
  test('Pre-population of computer information for editing', async ({ page }) => {
    await page.goto('https://computer-database.gatling.io/computers');
    await page.click('//a[normalize-space()="ACE"]');
    const preFilledName = await page.$eval('#name', el => el.getAttribute('value'));
    await expect(preFilledName).toBeTruthy();
  });

  // Test Case 4: Editing and saving valid changes - update name to 'ACE 50' and expect 'Done !' on saving
  test('Editing and saving valid changes', async ({ page }) => {
    await page.goto('https://computer-database.gatling.io/computers');
    await page.click('//a[normalize-space()="ACE"]');
    await page.fill('#name', 'ACE 50');
    await page.click('//input[@value="Save this computer"]');
    const successMessage = await page.$eval('.alert-message.warning', el => el.textContent);
    await expect(successMessage).toContain('Done !');
  });

  // Test Case 5: Editing and canceling changes
  test('Editing and canceling changes', async ({ page }) => {
    await page.goto('https://computer-database.gatling.io/computers');
    await page.click('//a[normalize-space()="ACE"]');
    const originalName = await page.$eval('#name', el => el.getAttribute('value'));
    await page.fill('#name', 'ACE 50');
    await page.click("//a[normalize-space()='Cancel']");
    expect(await page.getByText('Add a new computer'))
  });

  // Test Case 6: Editing with invalid information and saving
  test('Editing with invalid information and saving', async ({ page }) => {
    await page.goto('https://computer-database.gatling.io/computers');
    await page.click('//a[normalize-space()="ACE"]');
    await page.fill('#name', 'Test Computer');
    await page.fill('#introduced', '2022-01-01');
    await page.fill('#discontinued', '2023-01-01');
    await page.selectOption("//select[@id='company']", { label: 'Apple Inc.' });

    
    //await page.selectOption("//select[@id='company']", { label: 'Company Name' });
    await page.click("//input[@value='Save this computer']");

    // validation for failure submission
    expect((await page.isVisible("div[class='clearfix error'] span[class='help-inline']")))

  });

  // Test Case 7: Verify computer can be deleted
  test('Verify computer can be deleted', async ({ page }) => {
    await page.goto('https://computer-database.gatling.io/computers');
    await page.click('//a[normalize-space()="ACE"]');
    const deleteButton = await page.$('.btn.danger');
    await expect(deleteButton).toBeTruthy();
    await deleteButton?.click();
  });

});
