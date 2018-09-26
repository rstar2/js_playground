Feature('GitHub');

Scenario('search for CodeceptJS on GitHub', async (I) => {
    I.amOnPage('http://github.com');
    I.see('Built for developers', 'h1');
    I.retry().fillField('Search GitHub', 'CodeceptJS');
    I.pressKey('Enter');
    I.waitForText('repository results');
    I.retry(2).see('CodeceptJS');
    I.see('Modern Era Acceptance Testing Framework for NodeJS')
});