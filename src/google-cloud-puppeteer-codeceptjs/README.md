# CodeceptJS

The dynamic config with *codecept.conf.js*
takes precedence over the static config *codecept.json*

The Puppeteer instance can be configured with the the config file.

# Deploy as Google Function

1. Create a project in the Google console, for instance 'browser-test-codeceptjs'
2. Deploy with
```
$ gcloud functions deploy browserTest --trigger-http --runtime nodejs8 --memory 1024MB --timeout 540s --project browser-test-codeceptjs
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
  url: https://us-central1-browser-test-codeceptjs.cloudfunctions.net/browserTest
```  
 

3. Test it:
```
$ gcloud functions call browserTest --project browser-test-codeceptjs
```

If there are is normal success output then all is OK, if not debug it with:
```
$ gcloud functions logs read --project browser-test-codeceptjs
```
