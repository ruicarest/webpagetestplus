chrome.runtime.onInstalled.addListener(function () {
    let settings = new Store("settings");
    if (!settings.get('endpoint')) {
        settings.set('endpoint', 'https://www.webpagetest.org/');
    }
});

chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.getSelected(null, function (tab) {
        let urlInfo = tab.url.match(/(https?:\/\/.*\/)result\/(\w+_\w+_\w+)\//);

        if (urlInfo) {
            let settings = new Store("settings");

            settings.set('lastTab', { endpoint: urlInfo[1], testCode: urlInfo[2] });
        }

        chrome.tabs.create({ url: chrome.runtime.getURL('wptplus/index.html') });
    });
});