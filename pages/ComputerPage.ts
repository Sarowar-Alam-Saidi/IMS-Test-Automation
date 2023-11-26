import { Page, selectors } from '@playwright/test';

export class ComputerPage {
  constructor(public page: Page) {}

  async navigateToComputersPage() {
    await this.page.goto('https://computer-database.gatling.io/computers');
  }

  async isElementVisible(selector: string) {
    try {
      await this.page.waitForSelector(selector, { state: 'visible' });
      return true;
    } catch {
      return false;
    }
  }

  async clickAddComputerButton() {
    await this.page.click('#add');
  }

  async getPageTitleText() {
    const pageTitleLocator = await this.page.locator('xpath=//h1[normalize-space()="Add a computer"]');
    await pageTitleLocator.waitFor();
    return await pageTitleLocator.innerText();
  }


  async fillComputerForm(name: string, introduced: string, discontinued: string, company: string) {
    await this.page.fill('#name', name);
    await this.page.fill('#introduced', introduced);
    await this.page.fill('#discontinued', discontinued);
    await this.page.selectOption('//select[@id="company"]', { label: company });
  }

  async clickCreateComputerButton() {
    await this.page.click('//input[@value="Create this computer"]');
  }

  async clickCancelButton() {
    await this.page.click("//a[normalize-space()='Cancel']");
  }

  async searchComputerByName(name: string) {
    await this.page.fill('#searchbox', name);
    await this.page.click('#searchsubmit');
  }

  // Filtering story

  async isComputerVisibleInSearch(name: string) {
    return await this.page.isVisible(`text=${name}`);
  }


  async fillFilterByName(name: string) {
  await this.page.fill('#searchbox', name);
  await this.page.click('#searchsubmit');
}

// Editing computer name and info
async clickComputerNameLink(name: string) {
  const computerNameLink = `//a[normalize-space()="${name}"]`;
  await this.page.click(computerNameLink);
}

async getHeaderText(expectedText: string) {
  const selector = `//h1[normalize-space()='${expectedText}']`;
  return await this.page.$eval(selector, el => el.textContent);
}


async getAttributeValue(selector: string, attribute: string) {
  const element = await this.page.$(selector);
  if (!element) {
    throw new Error(`Element with selector '${selector}' not found.`);
  }

  return await element.getAttribute(attribute);
}

async fillEditFormAndSave(name: string, introduced: string, discontinued: string, company: string) {
  await this.page.fill('#name', name);
  await this.page.fill('#introduced', introduced);
  await this.page.fill('#discontinued', discontinued);
  
  // // dropdown visibility
  // await this.page.waitForSelector("//select[@id='company']", { state: 'visible' });
  
  // // dropdown option select
  // await this.page.selectOption("//select[@id='company']", { label: company }, {timeout: 5000});

  await this.page.click("//input[@value='Save this computer']");
}

async fillEditFormAndCancel(name: string, introduced: string, discontinued: string, company: string) {
  await this.page.fill('#name', name);
  await this.page.fill('#introduced', introduced);
  await this.page.fill('#discontinued', discontinued);
  await this.page.waitForSelector('//a[normalize-space()="Cancel"]', { state: 'visible' });
  await this.page.click('//a[normalize-space()="Cancel"]');
}

async getAlertMessage() {
  return await this.page.$eval('.alert-message.warning', el => el.textContent);
}

async clickDeleteButton() {
  const deleteButton = await this.page.$('.btn.danger');
  await deleteButton?.click();
}

async isErrorVisible() {
  try {
    await this.page.locator('className=help-inline').waitFor({ state: 'visible', timeout: 60000 });
    console.log('Error element found.');
    return true;
  } catch (error) { //for debugging purpose
    console.error('Error element not found or timeout exceeded.');
    throw error;
  }
}


//Filtering ASC & DESC order

async clickColumnHeader(columnName: string) {
  await this.page.click(`text=${columnName}`);
}

async validateColumnOrderASC(columnName: string, order: 'ASC' | 'DESC') {
  const columnHeaderLocator = `text=${columnName}`;
  await this.page.click(columnHeaderLocator);

  const expectedURL = `https://computer-database.gatling.io/computers?p=0&s=${columnName.toLowerCase()}&d=${order.toLowerCase()}`;
  await this.page.waitForURL(expectedURL, { timeout: 50000 });
}

async validateColumnOrderASCCom(columnName: string, order: 'ASC' | 'DESC') {
  const columnHeaderLocator = `text=${columnName}`;
  await this.page.click(columnHeaderLocator);

  const expectedURL = `https://computer-database.gatling.io/computers?p=0&s=${columnName.toLowerCase()}Name&d=${order.toLowerCase()}`;
  await this.page.waitForURL(expectedURL, { timeout: 50000 });
}

async validateColumnOrderDESC(columnName: string, order: 'ASC' | 'DESC') {
  const columnHeaderLocator = `text=${columnName}`;
  
  // Click for ASC order
  await this.page.click(columnHeaderLocator, { timeout: 30000 });
  await this.page.waitForTimeout(1000); // Add a delay (adjust the duration as needed)

  if (order === 'ASC') {
    await this.page.waitForSelector(`a[href='/computers?p=0&s=${columnName.toLowerCase()}&d=asc']`, { timeout: 30000 });
  } else if (order === 'DESC') {
    // Click for DESC order
    await this.page.click(columnHeaderLocator, { timeout: 30000 });

    const expectedUrl = `https://computer-database.gatling.io/computers?p=0&s=${columnName.toLowerCase()}&d=desc`;
    await this.page.waitForURL(expectedUrl, { timeout: 30000 });
  }
}

async validateColumnOrderDESCCom(columnName: string, order: 'ASC' | 'DESC') {
  const columnHeaderLocator = `text=${columnName}`;
  
  // Click for ASC order
  await this.page.click(columnHeaderLocator, { timeout: 30000 });
  await this.page.waitForTimeout(1000); // Add a delay (adjust the duration as needed)

  if (order === 'ASC') {
    await this.page.waitForSelector(`a[href='/computers?p=0&s=${columnName.toLowerCase()}&d=asc']`, { timeout: 30000 });
  } else if (order === 'DESC') {
    // Click for DESC order
    await this.page.click(columnHeaderLocator, { timeout: 30000 });

    const expectedUrl = `https://computer-database.gatling.io/computers?p=0&s=${columnName.toLowerCase()}Name&d=desc`;
    await this.page.waitForURL(expectedUrl, { timeout: 30000 });
  }
}


async isColumnClickable(columnName: string) {
  try {
    const columnElement = await this.page.$(`text=${columnName}`);
    return columnElement !== null;
  } catch (error) {
    console.error(`Error checking if column ${columnName} is clickable:`, error);
    return false;
  }
}

//Navigation button and scenarios

async navigateToComputersNavPage(pageNumber: number) {
  await this.page.goto(`https://computer-database.gatling.io/computers?p=${pageNumber}`);
}

async navigateToComputersMultPage(pageNumber: number = 1, itemsPerPage: number = 10) {
  await this.page.goto(`https://computer-database.gatling.io/computers?p=${pageNumber}&n=${itemsPerPage}`);
}

async isNextButtonPresent() {
  return (await this.page.$('text=Next →')) !== null;
}

async isNextButtonDisabled() {
  const nextButton = await this.page.$('text=Next →');
  return (await nextButton?.getAttribute('disabled')) === 'true';
  //await expect(nextButton).toBeNull;
}

async clickNextButton() {
  await this.page.click('text=Next →');
}

async isPreviousButtonPresent() {
  const previousButton = await this.page.$('text=← Previous');
  return previousButton !== null;
}



}
