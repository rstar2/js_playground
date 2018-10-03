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

# Deploy as Google Function (NEED TO HAVE gcloud INSTALLED)

1. Create a project in the Google console, for instance 'browser-test-jest'
2. Deploy with
```
$ gcloud functions deploy browserTest --trigger-http --runtime nodejs8 --memory 1024MB --timeout 540s --project browser-test-jest
```
Note!!! - gcloud functions API expects the 'index.js' to export a function named 'browserTest' or at least named 'function', e.g.
```
index.js:
module.exports.browserTest = function () {
    ...
}
```
or 
```
index.js:
module.exports.function = function () {
    ...
}
```

Timeout is by default 60s (1min), but cannot be set ot more than 540s (9 mins)
Result should be similar to:
```
...
httpsTrigger:
  url: https://us-central1-browser-test-jest.cloudfunctions.net/browserTest
```  
 

3. Test it:
```
$ gcloud functions call browserTest --project browser-test-jest
```

If there are is normal success output then all is OK, if not debug it with:
```
$ gcloud functions logs read --project browser-test-jest
```
