(function () {
    let settings = new AppSettings();

    chrome.runtime.onInstalled.addListener(function () {
        if (!settings.get('endpoint')) {
            settings.set('endpoint', 'https://www.webpagetest.org/');
        }

        if (!settings.get('formatNumberDigits')) {
            settings.set('formatNumberDigits', '2');
        }

        if (settings.get('formatNumberDigitSeparator') == undefined) {
            settings.set('formatNumberDigitSeparator', ',');
        }

        if (settings.get('useReportCache') == undefined) {
            settings.set('useReportCache', true);
        }

        if (settings.get('csvColumnSeparator') == undefined) {
            settings.set('csvColumnSeparator', '\\t');
        }

        if (settings.get('csvRowSeparator') == undefined) {
            settings.set('csvRowSeparator', '\\r\\n');
        }

        if (settings.get('medianMetric') == undefined) {
            settings.set('medianMetric', 'speedIndex');
        }
    });

    chrome.browserAction.onClicked.addListener(function () {
        chrome.tabs.getSelected(null, function (tab) {
            let urlInfo = ReportHelper.getUrlInfo(tab.url);

            settings.set('lastTabEndpoint', urlInfo.endpoint || '');
            settings.set('lastTabTestCode', urlInfo.testCode || '');

            chrome.tabs.create({ url: chrome.runtime.getURL('app/index.html') });
        });
    });
})()