var ReportMetricConfig = function () {
    const METRICS_STATE_KEY = 'metricsState';

    const appSettings = new AppSettings();

    let formatNumberDigits, formatNumberDigitSeparator;

    const miliToSeconds = (time) => formatNumber(time / 1000);

    const bytesToKilobytes = (time) => formatNumber(time / 1024);

    const formatNumber = (value, digits, defaultValue = 0) => 
        Math.round(!value ? defaultValue : value, digits == undefined ? formatNumberDigits : digits)
            .toString()
            .replace('.', formatNumberDigitSeparator);

    const defaultString = (value, defaultValue = 'n/a') => !value ? defaultValue : value;

    const firstValue = (values) => values[0];

    const count = (values) => values.length || 0;

    const metrics = [
        {
            name: 'summaryUrl',
            description: 'Report Url',
            expression: 'report.summary',
            format: defaultString,
            aggregate: firstValue,
            visible: true
        },
        {
            name: 'testId',
            description: 'Report Id',
            expression: 'report.id',
            format: defaultString,
            aggregate: firstValue,
            visible: true
        },
        {
            name: 'location',
            description: 'Location',
            expression: 'report.location',
            format: defaultString,
            aggregate: firstValue,
            visible: true
        },
        {
            name: 'label',
            description: 'Label',
            expression: 'report.label',
            format: defaultString,
            aggregate: firstValue,
            visible: true
        },
        {
            name: 'browser',
            description: 'Browser',
            expression: 'browser_name',
            format: defaultString,
            aggregate: firstValue,
            checked: true,
            visible: true
        },
        {
            name: 'connectivity',
            description: 'Connectivity',
            expression: 'report.connectivity',
            format: defaultString,
            aggregate: firstValue,
            checked: true,
            visible: true
        },
        {
            name: 'run',
            description: 'Run',
            expression: 'run',
            format: formatNumber,
            aggregate: count,
            checked: true,
            visible: true
        },
        {
            name: 'cachedView',
            description: 'Cached View',
            expression: 'cachedView',
            format: defaultString,
            aggregate: firstValue,
            checked: true,
            visible: true
        },
        {
            name: 'step',
            description: 'Step',
            expression: '$number(step)',
            format: formatNumber,
            aggregate: firstValue,
            checked: true,
            visible: true
        },
        {
            name: 'plt',
            description: 'PLT',
            expression: 'docTime',
            format: miliToSeconds,
            checked: true,
            visible: true,
            tooltip: 'Page load time (docTime)'
        },
        {
            name: 'ttfb',
            description: 'TTFB',
            expression: 'TTFB',
            format: miliToSeconds,
            checked: true,
            visible: true,
            tooltip: 'Time to first byte (TTFB)'
        },
        {
            name: 'render',
            description: 'Start Render',
            expression: 'render',
            format: miliToSeconds,
            checked: true,
            visible: true,
            tooltip: 'Start render (render)'
        },
        {
            name: 'userTime',
            description: 'User Time',
            expression: 'userTime',
            format: miliToSeconds,
            checked: true,
            visible: true,
            tooltip: 'User time (userTime)'
        },
        {
            name: 'speedIndex',
            description: 'Speed Index',
            expression: 'SpeedIndex',
            format: miliToSeconds,
            checked: true,
            visible: true,
            tooltip: 'Speed index (SpeedIndex)'
        },
        {
            name: 'domContentLoadedEventStart',
            description: 'DOM Content Loaded',
            expression: 'domContentLoadedEventStart',
            format: miliToSeconds,
            checked: true,
            visible: true,
            tooltip: 'Start time of document load event (domContentLoadedEventStart)'
        },
        {
            name: 'fi',
            description: 'First Interactive',
            expression: '$max([firstContentfulPaint, firstMeaningfulPaint, domInteractive, domContentLoadedEventEnd, FirstInteractive])',
            format: miliToSeconds,
            checked: true,
            visible: true,
            tooltip: 'Custom TTI (max[firstContentfulPaint, firstMeaningfulPaint, domInteractive, domContentLoadedEventEnd, FirstInteractive])'
        },
        {
            name: 'lastInteractive',
            description: 'Last Interactive',
            expression: '$reverse(interactivePeriods)[0][0]',
            format: miliToSeconds,
            checked: true,
            visible: true,
            tooltip: 'Custom TTI - Start time of last period of interactivity (interactivePeriods.Last.StartTime)'
        },
        {
            name: 'tti',
            description: 'TTI',
            expression: 'TimeToInteractive',
            format: miliToSeconds,
            checked: true,
            visible: true,
            tooltip: 'Custom TTI (TimeToInteractive)'
        },
        {
            name: 'requestsDoc',
            description: 'Document Requests',
            expression: 'requestsDoc',
            format: formatNumber,
            checked: true,
            visible: true,
            tooltip: 'Total requests until the document load event (requestsDoc)'
        },
        {
            name: 'bytesInDoc',
            description: 'Document Bytes In',
            expression: 'bytesInDoc',
            format: bytesToKilobytes,
            checked: true,
            visible: true,
            tooltip: 'Total bytes downloaded until the document load event (bytesInDoc)'
        },
        {
            name: 'pageSize',
            description: 'Page Size',
            expression: 'requests[0].objectSizeUncompressed',
            format: bytesToKilobytes,
            checked: true,
            visible: true,
            tooltip: 'Size of the first request (request[0].objectSizeUncompressed)'
        },
        {
            name: 'fullyTime',
            description: 'Fully Loaded',
            expression: 'fullyLoaded',
            format: miliToSeconds,
            checked: true,
            visible: true,
            tooltip: 'Total time of the run (fullyLoaded)'
        },
        {
            name: 'fullyRequests',
            description: 'Fully Requests',
            expression: 'requestsFull',
            format: formatNumber,
            checked: true,
            visible: true,
            tooltip: 'Total requests during the run (requestsFull)'
        },
        {
            name: 'fullyBytes',
            description: 'Fully Bytes In',
            expression: 'bytesIn',
            format: bytesToKilobytes,
            checked: true,
            visible: true,
            tooltip: 'Total bytes downloaded during the run (bytesIn)'
        }
    ];

    const init = function () {
        metrics.forEach(metric => {
            if (typeof metric.expression === "function") {
                const expression = (exp, obj) => jsonata(exp).evaluate(obj);
                metric.evaluate = obj => metric.expression(exp => expression(exp, obj));
            } else if (typeof metric.expression === "string") {
                metric.evaluate = jsonata(metric.expression).evaluate;
            } else {
                metric.evaluate = () => 0;
            }
        });
        setState();

        formatNumberDigits = parseInt(appSettings.get('formatNumberDigits'))
        formatNumberDigitSeparator = appSettings.get('formatNumberDigitSeparator');
    }

    const get = (name) => metrics.filter((metric) => metric.name == name)[0];

    const list = () => metrics;

    const setMetricsState = function (metricState) {
        appSettings.set(METRICS_STATE_KEY, metricState);
        setState(metricState);
    }

    const setState = function (metricState) {
        metricState = metricState || appSettings.get(METRICS_STATE_KEY);
        metricState && metrics.sort((m1, m2) => {
            let mi1 = metricState.findIndex(e => e.name === m1.name),
                mi2 = metricState.findIndex(e => e.name === m2.name);

            return (mi1 < 0 ? 9999 : mi1)  - (mi2 < 0 ? 9999 : mi1);
        });

        metricState && metrics.forEach((metric, index) => {
            if (metric && metricState[index]) {
                metric.checked = metricState[index].selected;
            }
        });
    }

    init();

    return {
        get,
        list,
        setMetricsState,
    }
}