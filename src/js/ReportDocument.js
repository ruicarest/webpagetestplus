var ReportDocument = function (report) {

    let stdevData
    let averageData;

    const steps = function () {
        let result = [];
        let runs = report.runs;
        for (let run in runs) {
            let cachedViews = runs[run];
            for (let cachedView in cachedViews) {
                let test = cachedViews[cachedView];
                if (test.steps) {
                    for (let i = 0; i < test.steps.length; i++) {
                        var step = test.steps[i]
                        result.push(createStep.bind(this)(step, run, cachedView, i + 1));
                    }
                }
                else {
                    result.push(createStep.bind(this)(test, run, cachedView, 1));
                }
            }
        }

        return result;
    }

    const aggregations = function (aggregationType, filters) {
        if (!stdevData || !averageData) {
            stdevData = _aggregations('standardDeviation');
            averageData = _aggregations('average');
        }

        let data;
        if (aggregationType == 'standardDeviation') {
            data = stdevData;
        } else {
            data = averageData;
        }

        if (filters) {
            return data.filter(step => step.accept(filters));
        }

        return data;
    }

    const _aggregations = function (aggregationType) {
        let result = [];
        let cachedViews = report[aggregationType];
        for (let cachedView in cachedViews) {
            let test = cachedViews[cachedView];
            if (test.steps) {
                for (let i = 0; i < test.steps.length; i++) {
                    var step = test.steps[i]
                    result.push(createStep.bind(this)(step, 0, cachedView, i));
                }
            }
            else {
                result.push(createStep.bind(this)(test, 0, cachedView, 1));
            }
        }

        return result;
    }

    const createStep = function (stepObj, run, cachedView, step) {
        stepObj.report = report;
        stepObj.run = run;
        stepObj.cachedView = cachedView;
        stepObj.step = step;

        return new ReportStep(this, stepObj);
    }

    return {
        steps,
        aggregations
    }
}