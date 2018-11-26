chrome.runtime.onInstalled.addListener(function () {
    let settings = new Store("settings");
    if (!settings.get('endpoint')) {
        settings.set('endpoint', 'https://www.webpagetest.org/');
    }
});

chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.create({ url: chrome.runtime.getURL('wptplus/index.html') }, function () { });
});