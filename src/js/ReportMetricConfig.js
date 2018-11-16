var ReportMetricConfig = function () {

    const metrics = [
        {
            name: 'runIndex',
            description: 'Run',
            getter: '_run',
        },
        {
            name: 'cached',
            description: 'Cached',
            getter: '_cached',
        },
        {
            name: 'stepNumber',
            description: 'Step',
            getter: '_step',
        },
        {
            name: 'firstByteTime',
            description: 'TTFB',
            getter: '_TTFB',
            transform: (time) => miliToSeconds(time)
        },
        {
            name: 'startRenderTime',
            description: 'Start Render',
            getter: '_render',
            transform: (time) => miliToSeconds(time)
        },
        {
            name: 'userTime',
            description: 'User Time',
            getter: '_userTime',
            transform: (time) => miliToSeconds(time)
        },
        {
            name: 'speedIndex',
            description: 'Speed Index',
            getter: '_SpeedIndex',
            transform: (time) => miliToSeconds(time)
        },
        {
            name: 'firstInteractiveTime',
            description: 'TTI',
            getter: '_LastInteractive',
            transform: (time) => miliToSeconds(time)
        },
        {
            name: 'onLoadTime',
            description: 'PLT',
            getter: '_docTime',
            transform: (time) => miliToSeconds(time)
        },
        {
            name: 'onLoadRequests',
            description: 'Document Requests',
            getter: '_requestsDoc',
        },
        {
            name: 'onLoadBytes',
            description: 'Document Bytes In',
            getter: '_bytesInDoc',
            transform: (size) => bytesToKilobytes(size)
        },
        {
            name: 'fullyTime',
            description: 'Fully Loaded',
            getter: '_fullyLoaded',
            transform: (time) => miliToSeconds(time)
        },
        {
            name: 'fullyRequests',
            description: 'Fully Requests',
            getter: '_requestsFull',
            transform: null
        },
        {
            name: 'fullyBytes',
            description: 'Fully Bytes In',
            getter: '_bytesIn',
            transform: (size) => bytesToKilobytes(size)
        },
    ];

    const get = (name) => metrics.filter((metric) => metric.name == name)[0];

    const list = () => metrics;

    const miliToSeconds = (time) => time / 1000;

    const bytesToKilobytes = (time) => time / 1024;

    return {
        get,
        list
    }
}