var ReportMetricExtractor = function () {

    const metricConfig = new ReportMetricConfig();

    const pages = function* (report) {
        let runs = report.runs;
        for (let run in runs) {
            let cachedViews = runs[run];
            for (let cachedView in cachedViews) {
                let test = cachedViews[cachedView];
                if (test.steps) {
                    for (let i = 0; i < test.steps.length; i++) {
                        var step = test.steps[i]
                        setContext(step, report, run, cachedView, i);
                        yield step;
                    }
                }
                else {
                    setContext(test, report, run, cachedView, 1);
                    yield test;
                }
            }
        }
    }

    const aggregation = function* (report, aggregationType) {
        let cachedViews = report[aggregationType];
        for (let cachedView in cachedViews) {
            let test = cachedViews[cachedView];
            if (test.steps) {
                for (let i = 0; i < test.steps.length; i++) {
                    var step = test.steps[i]
                    setContext(step, report, 0, cachedView, i);
                    yield step;
                }
            }
            else {
                setContext(test, report, 0, cachedView, 1);
                yield test;
            }
        }
    }

    const accept = function (page, filters) {
        if (filters.cachedView && filters.cachedView.indexOf(get(page, 'cachedView')) == -1) {
            return false;
        }

        if (filters.steps && filters.steps.indexOf(get(page, 'step')) == -1) {
            return false;
        }

        return true;
    }

    const headers = function (metricNames) {
        return metricNames.map(headerDescription)
    }

    const values = function (page, metricNames) {
        return metricNames.map((metricName) => get(page, metricName));
    }

    const get = function (page, metricName) {
        let metric = metricConfig.get(metricName);
        let value = metric.expression.evaluate(page);

        return metric.transform ? metric.transform(value) : value;
    }

    const headerDescription = function (metricName) {
        return metricConfig.get(metricName).description;
    }

    const setContext = function (test, report, run, cachedView, step) {
        test.report = report;
        test.run = run;
        test.cachedView = cachedView;
        test.step = step;
    }

    return {
        pages,
        aggregation,
        accept,
        headers,
        values,
        get
    }
}