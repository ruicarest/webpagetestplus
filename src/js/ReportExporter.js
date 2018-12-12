var ReportExporter = function (endpoint, cache = undefined) {

    const endpointQuery = 'jsonResult.php?test=';
    const metricConfig = new ReportMetricConfig();

    const get = function (testCode) {
        if (cache) {
            return cache.get(endpoint, testCode, () => getTest(testCode));
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
                request.open('GET', getJsonResultUrl(testCode), true);
                request.send();
            });
    }

    const exportCsv = function (reports, options) {
        let csv = [];
        if (options.filters.header) {
            csv.push(exportHeader(options.metrics));
        }

        // from
        let steps = reports.reduce((steps, report) => {
            let reportDocument = new ReportDocument(report);
            for (let step of reportDocument.steps()) {
                steps.push(step);
            }

            return steps
        }, []);

        // where
        steps = steps.filter(step => step.accept(options.filters));

        // group by
        if (options.aggregate.type) {
            let aggregateOp = aggregateOperation(options.aggregate.type);
            steps = steps.groupBy(options.aggregate.mergeTest ? pageKeyGetter : pageKeyGetterByTest);
            steps.forEach((v, k, m) => {
                m.set(k, new ReportStepGroup(v, aggregateOp))
            });

            if (options.aggregate.type == 'median') {
                for (let entry of steps) {
                    let [group, stepGroup] = entry;
                    let items = stepGroup.steps().sort((a, b) => a.getValue('plt') - b.getValue('plt'));
                    var medianIndex = Math.round(items.length / 2) - 1;
                    steps.set(group, items[medianIndex]);
                }

                steps = [...steps.values()];
            }
        }

        // select
        steps.forEach(step => {
            let metrics = step.values(options.metrics);
            csv.push(metrics.reduce(csvColumnReducer, ''))
        });

        return csv.reduce(csvRowReducer, '');
    }

    const exportHeader = function (exportMetrics) {
        return exportMetrics.map(metricName => metricConfig.get(metricName).description)
            .reduce(csvColumnReducer, '');
    }

    const pageKeyGetterByTest = function (step) {
        return step.values(['testId', 'cachedView', 'step'])
            .join('_');
    }

    const pageKeyGetter = function (step) {
        return step.values(['cachedView', 'step'])
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

    const getJsonResultUrl = function (testCode) {
        return new URL(endpointQuery + testCode, endpoint).href;
    }

    return {
        get,
        exportCsv,
        exportHeader
    }
}