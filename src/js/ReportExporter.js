var ReportExporter = function (endpoint, cache = undefined) {
    const appSettings = new AppSettings();
    const endpointQuery = 'jsonResult.php?test=';
    const metricConfig = new ReportMetricConfig();

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
        return { metrics: [], rows: [], summary: [] };
    }

    const getReport = function (reports, options) {
        let report = emptyReport();

        //columns
        report.metrics = options.metrics.filter(m => m.selected).map(metric => MetricHelper.object(metric.name, metricConfig));

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
        report.rows = rows;

        // summary
        if (options.aggregate.type && options.aggregate.summary && !options.aggregate.mergeTest) {
            let summaryGroup = reportsSteps.groupBy(pageKeyGetter);
            let summaryRows = [];

            for (let [sKey, sSteps] of summaryGroup) {
                let sStepsByTest = sSteps.groupBy(pageKeyGetterByTest);
                let sGroupSteps = [];
                sStepsByTest.forEach((testSteps, testKey) => {
                    sGroupSteps.push(reportStepsByGroup.get(testKey));
                });

                summaryRows.push(new ReportStepGroup(sGroupSteps, 'absoluteDiff'));
                summaryRows.push(new ReportStepGroup(sGroupSteps, 'relativeDiff'));
            }

            report.summary = summaryRows;
        }

        return report;
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

    const getJsonResultUrl = function (testCode) {
        return new URL(endpointQuery + testCode, endpoint).href;
    }

    return {
        emptyReport,
        getRaw,
        getReport
    }
}