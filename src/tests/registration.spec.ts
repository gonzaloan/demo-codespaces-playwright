import { test, expect } from '@playwright/test';  
import { HomePage } from '@pages/HomePage';  
import { RegistrationPage } from '@pages/RegistrationPage';  
import registrationData from '../data/registration.json';  
  
test.describe('User Registration', () => {  
  
    test('register with valid data', async ({ page }) => {  
        const homePage = new HomePage(page);  
        const registrationPage = new RegistrationPage(page);  
  
        const uniqueEmail = registrationData.email.replace(  
            '{{timestamp}}',  
            Date.now().toString()  
        );  
  
        await homePage.navigate();  
        await homePage.clickRegister();  
  
        await registrationPage.selectGender(registrationData.gender);  
  
        await registrationPage.fillPersonalDetails({  
            firstName: registrationData.firstName,  
            lastName: registrationData.lastName,  
            company: registrationData.company,  
        });  
  
        await registrationPage.fillCredentials(  
            uniqueEmail,  
            registrationData.password,  
            registrationData.confirmPassword  
        );  
  
        await registrationPage.clickRegister();  
  
        const message = await registrationPage.getResultMessage();  
        expect(message).toContain('Your registration completed');  
    });  
  
});