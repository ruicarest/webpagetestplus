var ReportExporter = function (endpoint, cache = undefined) {
    const appSettings = new AppSettings();
    const endpointQuery = 'jsonResult.php?test=';
    const metricConfig = new ReportMetricConfig();

    const getTests = function (testCodes) {
        let tests = [];
        for (let testCode of testCodes) {
            tests.push(getTest(testCode));
        }

        return tests;
    }

    const getTest = function (testCode) {
        if (cache) {
            return cache.get([endpoint, testCode], () => requestTest(testCode), res => res && res.statusCode);
        }

        return getTest(testCode);
    }

    const requestTest = function (testCode) {
        const request = new XMLHttpRequest();
        // request.responseType = 'json';
        request.open('GET', getJsonResultUrl(testCode), false);
        request.send();
        if (request.status == 200) {
            return processResponseOk(request);
        } else {
            return processResponseFail(request);
        }
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

    const processResponseOk = function (request) {
        let [success, test] = tryParseResponse(request.response);

        return test.data;
    }

    const processResponseFail = function (request) {
        let [success, test] = tryParseResponse(request.response);

        if (success) {
            return new Error(test.statusText);
        } else {
            return new Error(request.status + ' ' + request.statusText);
        }
    }

    const tryParseResponse = function (response) {
        try {
            return [true, JSON.parse(response)];
        } catch {
            return [false];
        }
    }

    const getJsonResultUrl = function (testCode) {
        return new URL(endpointQuery + testCode, endpoint).href;
    }

    return {
        emptyReport,
        getTest,
        getTests,
        getReport
    }
}