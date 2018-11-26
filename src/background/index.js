chrome.runtime.onInstalled.addListener(function () {
    let settings = new Store("settings");
    if (!settings.get('endpoint')) {
        settings.set('endpoint', 'https://www.webpagetest.org/');
    }
});