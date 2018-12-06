var ReportDocument = function (wptEndpoint, cache = undefined) {

    const wptQuery = 'jsonResult.php?test=';
    const metricExtractor = new ReportMetricExtractor();

    const get = function (testCode) {
        if (cache) {
            return cache.get(wptEndpoint, testCode, () => getTest(testCode));
        }

        return getTest(testCode);
    }

    const getTest = function (testCode) {
        return new Promise(
            (resolve, reject) => {
                const request = new XMLHttpRequest();
                request.responseType = 'json';
                request.onload = function () {
                    if (this.status === 200) {
                        resolve(processResponseOk(this));
                    } else {
                        reject(processResponseFail(this));
                    }
                };
                request.onerror = function () {
                    reject(processResponseFail(this));
                };
                request.open('GET', wptEndpoint + wptQuery + testCode, true);
                request.send();
            });
    }

    const exportCsv = function (reports, options, header = true) {
        let csv = [];
        if (header) {
            csv.push(exportHeader(options.metrics));
        }

        reports.forEach(report => {
            let aggOperation;
            let metricExtractor = new ReportMetricExtractor(report);

            // from
            let pages = Queryable(metricExtractor.pages());

            // where
            pages = pages.filter(page => metricExtractor.accept(page, options.filters));

            // group by
            if (options.aggregate.type) {
                pages = pages.groupBy(pageKeyGetter);
                aggOperation = aggregateOperation(options.aggregate.type);
            } else {
                pages = pages.toArray();
            }

            // select
            pages.forEach(pageElem => {
                let metrics = metricExtractor.values(pageElem, options.metrics, aggOperation);
                csv.push(metrics.reduce(csvColumnReducer, ''))
            });
        });

        return csv.reduce(csvRowReducer, '');
    }

    const exportHeader = function (exportMetrics) {
        return metricExtractor
            .headers(exportMetrics)
            .reduce(csvColumnReducer, '');
    }

    const pageKeyGetter = function (page) {
        return metricExtractor
            .values(page, ['cachedView', 'step'])
            .join('_');
    }

    const aggregateOperation = function (aggregateType) {
        switch (aggregateType) {
            case 'average':
                return Math.avg;

            case 'median':
                return Math.median;

            case 'standardDeviation':
                return Math.stdev;

            default:
                return;
        }
    }

    const processResponseOk = function (response) {
        return response.response.data;
    }

    const processResponseFail = function (response) {
        return new Error(response.statusText);
    }

    const csvColumnReducer = function (line, value) {
        return (line ? line + '\t' : '') + value;
    }

    const csvRowReducer = function (csv, line) {
        return (csv ? csv + '\n' : '') + line;
    }

    return {
        get,
        exportCsv,
        exportHeader
    }
}