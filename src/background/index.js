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

            let endpoint = urlInfo.endpoint || '';
            let testCode = urlInfo.testCode || '';

            let params = [];
            if (endpoint) {
                params.push('host=' + encodeURIComponent(endpoint));
            }

            if (testCode) {
                params.push('test=' + encodeURIComponent(testCode));
            }

            params = params.join('&');

            chrome.tabs.create({ 
                url: chrome.runtime.getURL('app/index.html' + (params ? '?' + params : ''))
            });
        });
    });
})()