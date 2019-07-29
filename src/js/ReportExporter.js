var ReportExporter = function (endpoint, cache = undefined) {
    const appSettings = new AppSettings();
    const endpointQuery = 'jsonResult.php?test=';
    const metricConfig = new ReportMetricConfig();

    let rowSeparator, columnSeparator;

    const getRaw = function (testCode) {
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

    const emptyReport = function () {
        const report = { header: [], rows: [] };
        report.exportCsv = () => exportCsv.bind(this)(report);

        return report;
    }

    const getReport = function (reports, options) {
        let report = emptyReport();
        if (options.filters.header) {
            report.header = headerData(options.metrics);
        }

        // from
        let reportsSteps = reports.reduce((reportSteps, report) => {
            let reportDocument = new ReportDocument(report);
            for (let step of reportDocument.steps()) {
                reportSteps.push(step);
            }

            return reportSteps
        }, []);

        // where
        reportsSteps = reportsSteps.filter(reportStep => reportStep.accept(options.filters));
        let rows = reportsSteps;

        // group by
        let reportStepsByGroup;
        if (options.aggregate.type) {
            reportStepsByGroup = reportsSteps.groupBy(options.aggregate.mergeTest ? pageKeyGetter : pageKeyGetterByTest);
            reportStepsByGroup.forEach((groupSteps, groupKey, group) => {
                group.set(groupKey, new ReportStepGroup(groupSteps, options.aggregate.type))
            });

            if (options.aggregate.type == 'median') {
                const medianMetric = appSettings.get('medianMetric') || 'plt';
                for (let [group, stepGroup] of reportStepsByGroup) {
                    let items = stepGroup.steps().sort((a, b) => a.getValue(medianMetric) - b.getValue(medianMetric));
                    var medianIndex = Math.round(items.length / 2) - 1;
                    reportStepsByGroup.set(group, items[medianIndex]);
                }
            }

            rows = [...reportStepsByGroup.values()];
        }

        // select
        var metricNames = options.metrics.map(m => m.name);
        report.rows = rows.map(r => r.formatedValues(metricNames));

        // summary
        if (options.aggregate.type && options.aggregate.summary && !options.aggregate.mergeTest) {
            let summaryGroup = reportsSteps.groupBy(pageKeyGetter);
            let summaryRows = [];

            for (let [sKey, sSteps] of summaryGroup) {
                var sStepsByTest = sSteps.groupBy(pageKeyGetterByTest);
                let sGroupSteps = [];
                sStepsByTest.forEach((testSteps, testKey) => {
                    sGroupSteps.push(reportStepsByGroup.get(testKey));
                });

                let absGroup = new ReportStepGroup(sGroupSteps, 'absoluteDiff');
                summaryRows.push(absGroup.formatedValues(metricNames));

                // TODO: Refactor the metrics configuration to format in %
                let relGroup = new ReportStepGroup(sGroupSteps, 'relativeDiff');
                summaryRows.push(relGroup.formatedValues(metricNames));
            }

            report.summary = summaryRows;
        }

        return report;
    }

    const exportCsv = function (data) {
        let csv = [];

        if (data && data.header && data.header.length) {
            csv.push(data.header.reduce(csvColumnReducer, ''));
        }

        if (data && data.rows && data.rows.length) {
            data.rows.forEach(row => csv.push(row.reduce(csvColumnReducer, '')));
        }

        if (data && data.summary && data.summary.length) {
            data.summary.forEach(row => csv.push(row.reduce(csvColumnReducer, '')));
        }

        return csv.reduce(csvRowReducer, '');
    }

    const headerData = function (exportMetrics) {
        return exportMetrics.map(metric => metricConfig.get(metric.name).description);
    }

    const pageKeyGetterByTest = function (step) {
        return step.formatedValues(['testId', 'cachedView', 'step'])
            .join('_');
    }

    const pageKeyGetter = function (step) {
        return step.formatedValues(['cachedView', 'step'])
            .join('_');
    }

    const processResponseOk = function (response) {
        return response.response.data;
    }

    const processResponseFail = function (response) {
        return new Error(response.statusText);
    }

    const csvColumnReducer = function (line, value) {
        return (line ? line + columnSeparator : '') + value;
    }

    const csvRowReducer = function (csv, line) {
        return (csv ? csv + rowSeparator : '') + line;
    }

    const getJsonResultUrl = function (testCode) {
        return new URL(endpointQuery + testCode, endpoint).href;
    }

    const tranformSettingValue = (value) =>
        !value ? value : value
            .replace("\\t", '\t')
            .replace("\\r", '\r')
            .replace("\\n", '\n');

    const init = function () {
        rowSeparator = tranformSettingValue(appSettings.get('csvRowSeparator'));
        columnSeparator = tranformSettingValue(appSettings.get('csvColumnSeparator'));
    }

    init();

    return {
        emptyReport,
        getRaw,
        getReport,
        exportCsv
    }
}