import { test, expect } from '@playwright/test';

import { ComputerPage } from '../pages/ComputerPage';

test.describe('Inventory management system test cases', () => {
  let computerPage: ComputerPage; 
  test.beforeEach(async ({ page }) => {
    computerPage = new ComputerPage(page); // Initialize the ComputerPage with the current page
  });

  test('Presence of "Add a new computer" button', async () => {
    await computerPage.navigateToComputersPage();
    await expect(computerPage.isElementVisible('#add')).toBeTruthy();
  });

  test('Clicking "Add a new computer" button and validate landing page', async () => {
    await computerPage.navigateToComputersPage();
    await computerPage.clickAddComputerButton();
    const pageTitle = await computerPage.getPageTitleText();
    await expect(pageTitle).toContain('Add a computer');
  });

  test('Validate fields on the new computer form', async () => {
    await computerPage.navigateToComputersPage();
    await computerPage.clickAddComputerButton();

    await computerPage.page.waitForTimeout(1000);
    await expect(computerPage.isElementVisible('#name')).toBeTruthy();
    await expect(computerPage.isElementVisible('#introduced')).toBeTruthy();
    await expect(computerPage.isElementVisible('#discontinued')).toBeTruthy();
    await expect(computerPage.isElementVisible('#company')).toBeTruthy();
  });

  test('Enter valid information and submit', async () => {
    await computerPage.navigateToComputersPage();
    await computerPage.clickAddComputerButton();
    await computerPage.fillComputerForm('Test Computer', '2022-01-01', '2023-01-01', 'Apple Inc.');
    await computerPage.clickCreateComputerButton();
    expect(await computerPage.isElementVisible("//strong[normalize-space()='Done !']")).toBeTruthy();
  });

  // test('Enter invalid information and submit', async () => {
  //   await computerPage.navigateToComputersPage();
  //   await computerPage.clickAddComputerButton();
  //   await computerPage.fillComputerForm('Test Computer', '2022-01-01', '2023-01-01', 'Apple Inc.');
  
  //   // Instead of using isElementVisible directly, use waitForFunction
  //   await computerPage.page.waitForFunction(
  //     () => document.querySelector("span:contains('Discontinued date is before introduction date')") !== null,
  //     { timeout: 30000 }
  //   );
  
    // Validation for the error message 'Discontinued date is before introduction date'
  //   expect(await computerPage.isElementVisible("span:contains('Discontinued date is before introduction date')")).toBeTruthy();
  // });

  test('Cancel the operation', async () => {
    await computerPage.navigateToComputersPage();
    await computerPage.clickAddComputerButton();
    await computerPage.clickCancelButton();
    expect(await computerPage.isElementVisible('text=Add a new computer')).toBeTruthy();
  });

  test('Check for proper error handling', async () => {
    await computerPage.navigateToComputersPage();
    await computerPage.clickAddComputerButton();
    await computerPage.fillComputerForm('Test Computer', '2022-01-01', '2022-01-01', 'Apple Inc.');
    await computerPage.clickCreateComputerButton();
    expect(await computerPage.isElementVisible('text=Discontinued date is before introduction date')).toBeTruthy();
  });

  test('Verify visibility of the added computer in search', async () => {
    await computerPage.navigateToComputersPage();
    await computerPage.searchComputerByName('ACE');
    
    await computerPage.page.waitForTimeout(1000);
  
    expect(await computerPage.isComputerVisibleInSearch('ACE')).toBeTruthy();
  });


// Filtering Computers by name - user Story 2

test('Presence of "Filter by name" button and input field', async () => {
  await computerPage.navigateToComputersPage();
  expect(await computerPage.isElementVisible('#searchsubmit')).toBeTruthy();
  expect(await computerPage.isElementVisible('#searchbox')).toBeTruthy();
});

test('Entering a valid computer name and clicking "Filter by name" and validate', async () => {
  await computerPage.navigateToComputersPage();
  await computerPage.fillFilterByName('Amiga');
  await computerPage.page.waitForTimeout(2000);
  expect(await computerPage.isComputerVisibleInSearch('Amiga')).toBeTruthy();
});

test('Entering an invalid computer name and clicking "Filter by name" and validate', async () => {
  await computerPage.navigateToComputersPage();
  await computerPage.fillFilterByName('InvalidComputerName');
  await computerPage.page.waitForTimeout(2000);
  expect(await computerPage.isComputerVisibleInSearch('InvalidComputerName')).toBeFalsy();
});

test('Filtering with case sensitivity and validate', async () => {
  await computerPage.navigateToComputersPage();
  await computerPage.fillFilterByName('ace');
  await computerPage.page.waitForTimeout(2000);
  expect(await computerPage.isComputerVisibleInSearch('ace')).toBeTruthy();
});

test('Multiple filters and validate', async () => {
  await computerPage.navigateToComputersPage();
  await computerPage.fillFilterByName('ACR');
  await computerPage.fillFilterByName('Amiga');
  await computerPage.page.waitForTimeout(2000);
  expect(await computerPage.isComputerVisibleInSearch('ACR')).toBeFalsy();
  expect(await computerPage.isComputerVisibleInSearch('Amiga')).toBeTruthy();
});


// Editing computer 
test('Presence of clickable computer names', async () => {
  await computerPage.navigateToComputersPage();
  const computerName = 'ACE';
  await expect(computerPage.isElementVisible(`//a[normalize-space()="${computerName}"]`)).toBeTruthy();
});

test('Clicking on a computer name to edit', async () => {
  await computerPage.navigateToComputersPage();
  const computerName = 'ACE';
  await computerPage.clickComputerNameLink(computerName);
  await expect(await computerPage.getHeaderText('Edit computer')).toContain('Edit computer');
});


test('Verify the pre-population of computer information for editing', async () => {
  await computerPage.navigateToComputersPage();
  const computerName = 'ACE';
  await computerPage.clickComputerNameLink(computerName);
  const preFilledName = await computerPage.getAttributeValue('#name', 'value');
  await expect(preFilledName).toBeTruthy();
});

test('Editing and saving valid changes', async () => {
  await computerPage.navigateToComputersPage();
  const computerName = 'ACE';
  await computerPage.clickComputerNameLink(computerName);
  await computerPage.fillEditFormAndSave('ACE 50', '', '', '');
  await expect(await computerPage.getAlertMessage()).toContain('Done !');
});

test('Editing and canceling changes', async () => {
  await computerPage.navigateToComputersPage();
  const computerName = 'ACE';
  await computerPage.clickComputerNameLink(computerName);
  const originalName = await computerPage.getAttributeValue('#name', 'value');
  await computerPage.fillEditFormAndCancel('ACE 50', '', '', '');
  expect(await computerPage.isElementVisible('text=Add a new computer')).toBeTruthy();
});

test('Verify computer can be deleted', async () => {
  await computerPage.navigateToComputersPage();
  const computerName = 'ACE';
  await computerPage.clickComputerNameLink(computerName);
  await expect(await computerPage.isElementVisible('.btn.danger')).toBeTruthy();
  await computerPage.clickDeleteButton();
});

//Filetering ASC & DESC order
test('Presence of clickable columns', async () => {
  await expect(computerPage.isColumnClickable('Introduced')).toBeTruthy();
  await expect(computerPage.isColumnClickable('Discontinued')).toBeTruthy();
  await expect(computerPage.isColumnClickable('Company')).toBeTruthy();
});

test('Validate ASC order for Introduced column', async () => {
  await computerPage.navigateToComputersPage();
  await computerPage.validateColumnOrderASC('Introduced', 'ASC');
});

test('Validate DESC order for Introduced column', async () => {
  await computerPage.navigateToComputersPage();
  await computerPage.validateColumnOrderDESC('Introduced', 'DESC');
});

test('Validate ASC order for Discontinued column', async () => {
  await computerPage.navigateToComputersPage();
  await computerPage.validateColumnOrderASC('Discontinued', 'ASC');
});

test('Validate DESC order for Discontinued column', async () => {
  await computerPage.navigateToComputersPage();
  await computerPage.validateColumnOrderDESC('Discontinued', 'DESC');
});

test('Validate ASC order for Company column', async () => {
  await computerPage.navigateToComputersPage();
  await computerPage.validateColumnOrderASCCom('Company', 'ASC');
});

test('Validate DESC order for Company column', async () => {
  await computerPage.navigateToComputersPage();
  await computerPage.validateColumnOrderDESCCom('Company', 'DESC');
});


// Navigation button and Scenarios

test('Presence of "Next" button', async () => {
  await computerPage.navigateToComputersPage();
  const isNextButtonPresent = await computerPage.isNextButtonPresent();
  await expect(isNextButtonPresent).toBeTruthy();
});

test('Clicking "Next →" button to navigate to the next page', async () => {
  await computerPage.navigateToComputersPage();
  await computerPage.clickNextButton();
  const isPreviousButtonPresent = await computerPage.isPreviousButtonPresent();
  await expect(isPreviousButtonPresent).toBeTruthy();
});


test('Functionality of "Next" button with a large dataset', async () => {
  await computerPage.navigateToComputersMultPage(1, 400);
  await computerPage.clickNextButton();
  const isNextButtonPresent = await computerPage.isNextButtonPresent();
  await expect(isNextButtonPresent).toBeTruthy();
});

test('Impact of items per page on "Next" button', async () => {
  await computerPage.navigateToComputersMultPage(1, 5);
  const isNextButtonPresent = await computerPage.isNextButtonPresent();
  await expect(isNextButtonPresent).toBeTruthy();
});


test('Proper handling of concurrent requests', async () => {
  await computerPage.navigateToComputersNavPage(1);
  await computerPage.clickNextButton();
  const isNextButtonPresent = await computerPage.isNextButtonPresent();
  await expect(isNextButtonPresent).toBeTruthy();
});


test('Presence of "Previous" button', async () => {
  await computerPage.navigateToComputersNavPage(2);
  const isPreviousButtonPresent = await computerPage.isPreviousButtonPresent();
  await expect(isPreviousButtonPresent).toBeTruthy();
});

});
