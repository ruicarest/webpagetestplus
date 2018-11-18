var ReportMetricConfig = function () {

    const metrics = [
        {
            name: 'testId',
            description: 'Id',
            expression: 'report.id',
            visible: true
        },
        {
            name: 'location',
            description: 'Location',
            expression: 'report.location',
            visible: true
        },
        {
            name: 'label',
            description: 'Label',
            expression: 'report.label',
            visible: true
        },
        {
            name: 'browser',
            description: 'Browser',
            expression: 'browser_name',
            checked: true,
            visible: true
        },
        {
            name: 'connectivity',
            description: 'Connectivity',
            expression: 'report.connectivity',
            checked: true,
            visible: true
        },
        {
            name: 'run',
            description: 'Run',
            expression: 'run',
            checked: true,
            visible: true
        },
        {
            name: 'cachedView',
            description: 'Cached View',
            expression: 'cachedView',
            checked: true,
            visible: true
        },
        {
            name: 'step',
            description: 'Step',
            expression: 'step',
            checked: true,
            visible: true
        },
        {
            name: 'ttfb',
            description: 'TTFB',
            expression: 'TTFB',
            transform: (time) => miliToSeconds(time),
            checked: true,
            visible: true
        },
        {
            name: 'render',
            description: 'Start Render',
            expression: 'render',
            transform: (time) => miliToSeconds(time),
            checked: true,
            visible: true
        },
        {
            name: 'userTime',
            description: 'User Time',
            expression: 'userTime',
            transform: (time) => miliToSeconds(time),
            checked: true,
            visible: true
        },
        {
            name: 'speedIndex',
            description: 'Speed Index',
            expression: 'SpeedIndex',
            transform: (time) => miliToSeconds(time),
            checked: true,
            visible: true
        },
        {
            name: 'tti',
            description: 'TTI',
            expression: 'TimeToInteractive',
            transform: (time) => miliToSeconds(time),
            checked: true,
            visible: true
        },
        {
            name: 'plt',
            description: 'PLT',
            expression: 'docTime',
            transform: (time) => miliToSeconds(time),
            checked: true,
            visible: true
        },
        {
            name: 'requestsDoc',
            description: 'Document Requests',
            expression: 'requestsDoc',
            checked: true,
            visible: true
        },
        {
            name: 'bytesInDoc',
            description: 'Document Bytes In',
            expression: 'bytesInDoc',
            transform: (size) => bytesToKilobytes(size),
            checked: true,
            visible: true
        },
        {
            name: 'fullyTime',
            description: 'Fully Loaded',
            expression: 'fullyLoaded',
            transform: (time) => miliToSeconds(time),
            checked: true,
            visible: true
        },
        {
            name: 'fullyRequests',
            description: 'Fully Requests',
            expression: 'requestsFull',
            transform: null,
            checked: true,
            visible: true
        },
        {
            name: 'fullyBytes',
            description: 'Fully Bytes In',
            expression: 'bytesIn',
            transform: (size) => bytesToKilobytes(size),
            checked: true,
            visible: true
        },
    ];
    metrics.forEach(metric => metric.expression = jsonata(metric.expression));

    const get = (name) => metrics.filter((metric) => metric.name == name)[0];

    const list = () => metrics;

    const miliToSeconds = (time) => time / 1000;

    const bytesToKilobytes = (time) => time / 1024;

    return {
        get,
        list
    }
}