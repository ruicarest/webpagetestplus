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

    const firstValue = (values) => values && values.length ? values[0] : '';

    const count = (values) => values.length || 0;

    const inFlightRequests = (requests, periodStart, periodEnd) => {
        if (!requests) {
            return undefined;
        }

        return requests.filter(r => {
            const reqStart = Math.min(r.ttfb_start, r.all_start, r.load_start, r.download_start);
            const reqEnd = Math.max(r.ttfb_end, r.all_end, r.load_end, r.download_end);
            if (
                // request starts during period
                (periodStart <= reqStart && reqStart <= periodEnd) ||
                // request ends during period
                (periodStart <= reqEnd && reqEnd <= periodEnd) ||
                // requests runs during period
                (reqStart <= periodStart && periodEnd <= reqEnd)) {
                // GET requests (POSTs and failed requests are ignored)
                return r.method == "GET" && 200 <= r.responseCode && r.responseCode <= 399;
            }

            return false;
        });
    }

    const metrics = [
        {
            name: 'summaryUrl',
            description: 'Report Url',
            type: 'string',
            expression: 'report.summary',
            format: defaultString,
            aggregate: firstValue,
            visible: true
        },
        {
            name: 'testId',
            description: 'Report Id',
            type: 'string',
            expression: 'report.id',
            format: defaultString,
            aggregate: firstValue,
            visible: true
        },
        {
            name: 'location',
            description: 'Location',
            type: 'string',
            expression: 'report.location',
            format: defaultString,
            aggregate: firstValue,
            visible: true
        },
        {
            name: 'label',
            description: 'Label',
            type: 'string',
            expression: 'report.label',
            format: defaultString,
            aggregate: firstValue,
            visible: true
        },
        {
            name: 'browser',
            description: 'Browser',
            type: 'string',
            expression: 'browser_name',
            format: defaultString,
            aggregate: firstValue,
            checked: true,
            visible: true
        },
        {
            name: 'connectivity',
            description: 'Connectivity',
            type: 'string',
            expression: 'report.connectivity',
            format: defaultString,
            aggregate: firstValue,
            checked: true,
            visible: true
        },
        {
            name: 'run',
            description: 'Run',
            type: 'string',
            expression: 'run',
            format: formatNumber,
            aggregate: count,
            checked: true,
            visible: true
        },
        {
            name: 'cachedView',
            description: 'Cached View',
            type: 'string',
            expression: 'cachedView',
            format: defaultString,
            aggregate: firstValue,
            checked: true,
            visible: true
        },
        {
            name: 'step',
            description: 'Step',
            type: 'string',
            expression: '$number(step)',
            format: formatNumber,
            aggregate: firstValue,
            checked: true,
            visible: true
        },
        {
            name: 'plt',
            description: 'PLT',
            type: 'number',
            expression: 'docTime',
            format: miliToSeconds,
            checked: true,
            visible: true,
            tooltip: 'Page load time (docTime)'
        },
        {
            name: 'ttfb',
            description: 'TTFB',
            type: 'number',
            expression: 'TTFB',
            format: miliToSeconds,
            checked: true,
            visible: true,
            tooltip: 'Time to first byte (TTFB)'
        },
        {
            name: 'render',
            description: 'Start Render',
            type: 'number',
            expression: 'render',
            format: miliToSeconds,
            checked: true,
            visible: true,
            tooltip: 'Start render (render)'
        },
        {
            name: 'userTime',
            description: 'User Time',
            type: 'number',
            expression: 'userTime',
            format: miliToSeconds,
            checked: true,
            visible: true,
            tooltip: 'User time (userTime)'
        },
        {
            name: 'speedIndex',
            description: 'Speed Index',
            type: 'number',
            expression: 'SpeedIndex',
            format: miliToSeconds,
            checked: true,
            visible: true,
            tooltip: 'Speed index (SpeedIndex)'
        },
        {
            name: 'domContentLoadedEventStart',
            description: 'DOM Content Loaded',
            type: 'number',
            expression: 'domContentLoadedEventStart',
            format: miliToSeconds,
            checked: true,
            visible: true,
            tooltip: 'Start time of document load event (domContentLoadedEventStart)'
        },
        {
            name: 'fi',
            description: 'First Interactive',
            type: 'number',
            expression: '$max([firstMeaningfulPaint, domContentLoadedEventStart, $filter(interactivePeriods, function($v, $i, $a) { $v[0] > firstContentfulPaint })[0][0]])',
            format: miliToSeconds,
            checked: true,
            visible: true,
            tooltip: 'Custom TTI (max[firstContentfulPaint, firstMeaningfulPaint, domInteractive, domContentLoadedEventEnd, FirstInteractive])'
        },
        {
            name: 'lastInteractive',
            description: 'Last Interactive',
            type: 'number',
            expression: '$reverse(interactivePeriods)[0][0]',
            format: miliToSeconds,
            checked: true,
            visible: true,
            tooltip: 'Custom TTI - Start time of last period of interactivity (interactivePeriods.Last.StartTime)'
        },
        {
            name: 'tti',
            description: 'TTI',
            type: 'number',
            expression: 'TimeToInteractive',
            format: miliToSeconds,
            checked: true,
            visible: true,
            tooltip: 'Custom TTI (TimeToInteractive)'
        },
        {
            name: 'timeConsistentlyInteractive',
            description: 'Time to Consistently Interactive',
            type: 'number',
            expression: _ => {
                const data = _(`{ 
                    "firstContentfulPaint": firstContentfulPaint,
                    "interactivePeriods": interactivePeriods,
                    "requests": requests,
                    "firstMeaningfulPaint": firstMeaningfulPaint,
                    "domContentLoadedEventStart": domContentLoadedEventStart
                }`);

                if (!data.interactivePeriods || !data.requests) {
                    return 0;
                }

                const consistentlyInteractivePeriod =
                    data.interactivePeriods
                        // first interactive window
                        .find(p => {
                            // window after firstContentfulPaint
                            if (p[0] < data.firstContentfulPaint) {
                                return false
                            }

                            // period of 5 seconds fully contained
                            if (p[1] - p[0] < 5000) {
                                return false;
                            }

                            // no more than 2 in-flight requests
                            return inFlightRequests(data.requests, p[0], p[1]).length <= 2
                        }) || data.interactivePeriods.reverse()[0];

                //interactive window, first meaningful paint or DOM Content Loaded, whichever is later
                return Math.max(consistentlyInteractivePeriod[0], data.firstMeaningfulPaint, data.domContentLoadedEventStart);
            },
            format: miliToSeconds,
            checked: false,
            visible: true,
            tooltip: 'Time to Consistently Interactive is the start of the interactive window (first interactive window where there is a contiguous period of 5 seconds with no more than 2 in-flight requests), first meaningful paint or DOM Content Loaded, whichever is later'
        },
        {
            name: 'timeFirstInteractive',
            description: 'Time to First Interactive',
            type: 'number',
            expression: _ => {
                const data = _(`{ 
                    "firstContentfulPaint": firstContentfulPaint,
                    "interactivePeriods": interactivePeriods,
                    "requests": requests,
                    "firstMeaningfulPaint": firstMeaningfulPaint,
                    "domContentLoadedEventStart": domContentLoadedEventStart
                }`);

                if (!data.interactivePeriods || !data.requests) {
                    return 0;
                }

                const firstinteractivePeriod =
                    data.interactivePeriods
                        // first interactive window
                        .find(p => {
                            // window after firstContentfulPaint
                            if (p[0] < data.firstContentfulPaint) {
                                return false;
                            }

                            // interactive window (with no regard to in-flight requests)
                            return inFlightRequests(data.requests, p[0], p[1]).length == 0
                        }) || data.interactivePeriods.reverse()[0];

                // interactive window, first meaningful paint or DOM Content Loaded, whichever is later
                return Math.max(firstinteractivePeriod[0], data.firstMeaningfulPaint, data.domContentLoadedEventStart);
            },
            format: miliToSeconds,
            checked: false,
            visible: true,
            tooltip: 'First Interactive is the start of the interactive window (first interactive window after first contentful paint), first meaningful paint or DOM Content Loaded, whichever is later'
        },
        {
            name: 'requestsDoc',
            description: 'Document Requests',
            type: 'number',
            expression: 'requestsDoc',
            format: formatNumber,
            checked: true,
            visible: true,
            tooltip: 'Total requests until the document load event (requestsDoc)'
        },
        {
            name: 'bytesInDoc',
            description: 'Document Bytes In',
            type: 'number',
            expression: 'bytesInDoc',
            format: bytesToKilobytes,
            checked: true,
            visible: true,
            tooltip: 'Total bytes downloaded until the document load event (bytesInDoc)'
        },
        {
            name: 'pageSize',
            description: 'Page Size',
            type: 'number',
            expression: 'requests[0].objectSizeUncompressed',
            format: bytesToKilobytes,
            checked: true,
            visible: true,
            tooltip: 'Size of the first request (request[0].objectSizeUncompressed)'
        },
        {
            name: 'fullyTime',
            description: 'Fully Loaded',
            type: 'number',
            expression: 'fullyLoaded',
            format: miliToSeconds,
            checked: true,
            visible: true,
            tooltip: 'Total time of the run (fullyLoaded)'
        },
        {
            name: 'fullyRequests',
            description: 'Fully Requests',
            type: 'number',
            expression: 'requestsFull',
            format: formatNumber,
            checked: true,
            visible: true,
            tooltip: 'Total requests during the run (requestsFull)'
        },
        {
            name: 'fullyBytes',
            description: 'Fully Bytes In',
            type: 'number',
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
                const expression = (exp, obj) => cloneObject(returnSafe(() => jsonata(exp).evaluate(obj)));
                metric.evaluate = obj => metric.expression(exp => expression(exp, obj));
            } else if (typeof metric.expression === "string") {
                metric.evaluate = obj => cloneObject(returnSafe(() => jsonata(metric.expression).evaluate(obj)));
            } else {
                metric.evaluate = () => 0;
            }
        });
        setState();

        formatNumberDigits = parseInt(appSettings.get('formatNumberDigits'))
        formatNumberDigitSeparator = appSettings.get('formatNumberDigitSeparator');
    }

    const get = (name) => metrics.find((metric) => metric.name == name);

    const list = () => metrics;

    const setMetricsState = function (metricState) {
        if (!metricState) {
            return;
        }

        appSettings.set(METRICS_STATE_KEY, metricState);
        setState(metricState);
    }

    const setState = function (metricState) {
        metricState = metricState || appSettings.get(METRICS_STATE_KEY);
        metricState && metrics.sort((m1, m2) => {
            let mi1 = metricState.findIndex(e => e.name === m1.name),
                mi2 = metricState.findIndex(e => e.name === m2.name);

            return (mi1 < 0 ? 9999 : mi1) - (mi2 < 0 ? 9999 : mi1);
        });

        metricState && metrics.forEach((metric, index) => {
            if (metric && metricState[index]) {
                metric.checked = metricState[index].selected;
            }
        });
    }

    const cloneObject = function (obj) {
        if (typeof obj === 'object') {
            return JSON.parse(JSON.stringify(obj));
        }

        return obj;
    }

    const returnSafe = function (callback) {
        try {
            return callback()
        } catch (error) {
            console.error(error);
            return 0;
        }
    }

    init();

    return {
        get,
        list,
        setMetricsState,
    }
}