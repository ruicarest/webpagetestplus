chrome.runtime.onInstalled.addListener(function () {
    let settings = new Store("settings");
    if (!settings.get('endpoint')) {
        settings.set('endpoint', 'https://www.webpagetest.org/');
    }

    if (!settings.get('formatNumberDigits')) {
        settings.set('formatNumberDigits', '2');
    }
});

chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.getSelected(null, function (tab) {
        let urlInfo = ReportHelper.getUrlInfo(tab.url);
        if (urlInfo.isValid) {
            let settings = new Store("settings");

            settings.set('lastTabEndpoint', urlInfo.endpoint);
            settings.set('lastTabTestCode', urlInfo.testCode);
        }

        chrome.tabs.create({ url: chrome.runtime.getURL('wptplus/index.html') });
    });
});