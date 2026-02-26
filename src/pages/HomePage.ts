import { Page, Locator } from '@playwright/test';

export class HomePage {
    private readonly page: Page;
    private readonly registerLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.registerLink = page.getByRole('link', { name: 'Register' });
    }

    async navigate(): Promise<void> {
        await this.page.goto('/');
    }

    async clickRegister(): Promise<void> {
        await this.registerLink.click();
    }
}