var ReportMetricConfig = function () {

    const miliToSeconds = (time) => formatNumber(time / 1000);

    const bytesToKilobytes = (time) => formatNumber(time / 1024);

    const formatNumber = (value, digits = 2, defaultValue = 0) => Math.round(!value ? defaultValue : value, digits);

    const defaultString = (value, defaultValue = 'n/a') => !value ? defaultValue : value;

    const metrics = [
        {
            name: 'testId',
            description: 'Id',
            expression: 'report.id',
            transform: defaultString,
            visible: true
        },
        {
            name: 'location',
            description: 'Location',
            expression: 'report.location',
            transform: defaultString,
            visible: true
        },
        {
            name: 'label',
            description: 'Label',
            expression: 'report.label',
            transform: defaultString,
            visible: true
        },
        {
            name: 'browser',
            description: 'Browser',
            expression: 'browser_name',
            transform: defaultString,
            checked: true,
            visible: true
        },
        {
            name: 'connectivity',
            description: 'Connectivity',
            expression: 'report.connectivity',
            transform: defaultString,
            checked: true,
            visible: true
        },
        {
            name: 'run',
            description: 'Run',
            expression: 'run',
            transform: formatNumber,
            checked: true,
            visible: true
        },
        {
            name: 'cachedView',
            description: 'Cached View',
            expression: 'cachedView',
            transform: defaultString,
            checked: true,
            visible: true
        },
        {
            name: 'step',
            description: 'Step',
            expression: 'step',
            transform: formatNumber,
            checked: true,
            visible: true
        },
        {
            name: 'ttfb',
            description: 'TTFB',
            expression: 'TTFB',
            transform: miliToSeconds,
            checked: true,
            visible: true
        },
        {
            name: 'render',
            description: 'Start Render',
            expression: 'render',
            transform: miliToSeconds,
            checked: true,
            visible: true
        },
        {
            name: 'userTime',
            description: 'User Time',
            expression: 'userTime',
            transform: miliToSeconds,
            checked: true,
            visible: true
        },
        {
            name: 'speedIndex',
            description: 'Speed Index',
            expression: 'SpeedIndex',
            transform: miliToSeconds,
            checked: true,
            visible: true
        },
        {
            name: 'tti',
            description: 'TTI',
            expression: 'TimeToInteractive',
            transform: miliToSeconds,
            checked: true,
            visible: true
        },
        {
            name: 'plt',
            description: 'PLT',
            expression: 'docTime',
            transform: miliToSeconds,
            checked: true,
            visible: true
        },
        {
            name: 'requestsDoc',
            description: 'Document Requests',
            expression: 'requestsDoc',
            transform: formatNumber,
            checked: true,
            visible: true
        },
        {
            name: 'bytesInDoc',
            description: 'Document Bytes In',
            expression: 'bytesInDoc',
            transform: bytesToKilobytes,
            checked: true,
            visible: true
        },
        {
            name: 'fullyTime',
            description: 'Fully Loaded',
            expression: 'fullyLoaded',
            transform: miliToSeconds,
            checked: true,
            visible: true
        },
        {
            name: 'fullyRequests',
            description: 'Fully Requests',
            expression: 'requestsFull',
            transform: formatNumber,
            checked: true,
            visible: true
        },
        {
            name: 'fullyBytes',
            description: 'Fully Bytes In',
            expression: 'bytesIn',
            transform: bytesToKilobytes,
            checked: true,
            visible: true
        },
    ];
    metrics.forEach(metric => metric.expression = jsonata(metric.expression));

    const get = (name) => metrics.filter((metric) => metric.name == name)[0];

    const list = () => metrics;

    return {
        get,
        list
    }
}