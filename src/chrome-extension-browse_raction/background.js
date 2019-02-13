'use strict';

chrome.browserAction.onClicked.addListener(tab => {
    console.log('Extension clicked');


    chrome.tabs.create({
        // Global URL if there's proper schema
        // url: 'html://tab.html'

        // local URL inside the extension (both are the same)
        // url: 'tab.html',
        url: chrome.extension.getURL('tab.html')

    });

});