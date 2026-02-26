import { Page, Locator } from '@playwright/test';

export class RegistrationPage {
    private readonly page: Page;

    private readonly genderMale: Locator;
    private readonly genderFemale: Locator;
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly emailInput: Locator;
    private readonly companyInput: Locator;
    private readonly passwordInput: Locator;
    private readonly confirmPasswordInput: Locator;
    private readonly registerButton: Locator;
    private readonly resultMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.genderMale = page.getByText('Male', { exact: true });
        this.genderFemale = page.getByRole('radio', { name: 'Female' });
        this.firstNameInput = page.getByRole('textbox', { name: 'First name:' });
        this.lastNameInput = page.getByRole('textbox', { name: 'Last name:' });
        this.emailInput = page.getByRole('textbox', { name: 'Email:' });
        this.companyInput = page.getByRole('textbox', { name: 'Company name:' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password:', exact: true });
        this.confirmPasswordInput = page.getByRole('textbox', { name: 'Confirm password:' });
        this.registerButton = page.getByRole('button', { name: 'Register' });
        this.resultMessage = page.locator('.result');
    }

    async selectGender(gender: string): Promise<void> {
        if (gender === 'male') {
            await this.genderMale.click();
        } else {
            await this.genderFemale.check();
        }
    }

    async fillPersonalDetails(data: {
        firstName: string;
        lastName: string;
        company: string;
    }): Promise<void> {
        await this.firstNameInput.fill(data.firstName);
        await this.lastNameInput.fill(data.lastName);
        await this.companyInput.fill(data.company);
    }

    async fillCredentials(email: string, password: string, confirmPassword: string): Promise<void> {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.confirmPasswordInput.fill(confirmPassword);
    }

    async clickRegister(): Promise<void> {
        await this.registerButton.click();
    }

    async getResultMessage(): Promise<string> {
        return await this.resultMessage.innerText();
    }
}