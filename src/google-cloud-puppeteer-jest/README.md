# With the Jest v22+

## If there's a preset installed:
```
$ npm i jest-puppeteer
```
and Jest configuration is :
```
{
  "preset": "jest-puppeteer"
}
```

Then the *page* and *browser* instances (classes) are automatically exposed,
so we can write tests immediately
```
describe('Google', () => {
  beforeAll(async () => {
    await page.goto('https://google.com');
  });

  it('should display "google" text on page', async () => {
    await expect(page).toMatch('google');
  });
});
```

## With the existence of *jest-puppeteer.config.js* the Puppeteer instance can be configured