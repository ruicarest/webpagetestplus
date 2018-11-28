var ReportMetricConfig = function () {

    let numberFormatDigits;

    const miliToSeconds = (time) => formatNumber(time / 1000);

    const bytesToKilobytes = (time) => formatNumber(time / 1024);

    const formatNumber = (value, digits, defaultValue = 0) => Math.round(!value ? defaultValue : value, digits == undefined ? numberFormatDigits : digits);

    const defaultString = (value, defaultValue = 'n/a') => !value ? defaultValue : value;

    const firstValue = (values) => values[0];

    const count = (values) => values.length || 0;

    const metrics = [
        {
            name: 'testId',
            description: 'Id',
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
            expression: 'step',
            format: formatNumber,
            aggregate: firstValue,
            checked: true,
            visible: true
        },
        {
            name: 'ttfb',
            description: 'TTFB',
            expression: 'TTFB',
            format: miliToSeconds,
            checked: true,
            visible: true
        },
        {
            name: 'render',
            description: 'Start Render',
            expression: 'render',
            format: miliToSeconds,
            checked: true,
            visible: true
        },
        {
            name: 'userTime',
            description: 'User Time',
            expression: 'userTime',
            format: miliToSeconds,
            checked: true,
            visible: true
        },
        {
            name: 'speedIndex',
            description: 'Speed Index',
            expression: 'SpeedIndex',
            format: miliToSeconds,
            checked: true,
            visible: true
        },
        {
            name: 'tti',
            description: 'TTI',
            expression: 'TimeToInteractive',
            format: miliToSeconds,
            checked: true,
            visible: true
        },
        {
            name: 'plt',
            description: 'PLT',
            expression: 'docTime',
            format: miliToSeconds,
            checked: true,
            visible: true
        },
        {
            name: 'requestsDoc',
            description: 'Document Requests',
            expression: 'requestsDoc',
            format: formatNumber,
            checked: true,
            visible: true
        },
        {
            name: 'bytesInDoc',
            description: 'Document Bytes In',
            expression: 'bytesInDoc',
            format: bytesToKilobytes,
            checked: true,
            visible: true
        },
        {
            name: 'fullyTime',
            description: 'Fully Loaded',
            expression: 'fullyLoaded',
            format: miliToSeconds,
            checked: true,
            visible: true
        },
        {
            name: 'fullyRequests',
            description: 'Fully Requests',
            expression: 'requestsFull',
            format: formatNumber,
            checked: true,
            visible: true
        },
        {
            name: 'fullyBytes',
            description: 'Fully Bytes In',
            expression: 'bytesIn',
            format: bytesToKilobytes,
            checked: true,
            visible: true
        },
    ];
    metrics.forEach(metric => metric.evaluate = jsonata(metric.expression).evaluate);

    const settings = new Store('settings');
    numberFormatDigits = parseInt(settings.get('formatNumberDigits'))

    const get = (name) => metrics.filter((metric) => metric.name == name)[0];

    const list = () => metrics;

    return {
        get,
        list
    }
}