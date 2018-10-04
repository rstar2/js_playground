const timeout = 5000;


describe('Google',
    () => {
        beforeAll(async () => {
            console.log('Browser opening');
            await page.goto('https://google.com');
            console.log('Browser opened');
        });

        it('should display "google" text on page', async () => {
            console.log('Check');
            await expect(page).toMatch('google');
        });
    },
    timeout);