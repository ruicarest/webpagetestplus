var ReportStepGroup = function (reportSteps, aggregateType) {

    const metricConfig = new ReportMetricConfig();

    const steps = function () {
        return reportSteps;
    }

    const accept = function (filters) {
        if (!reportSteps) {
            return;
        }

        return reportSteps.reduce((isAccept, stepObj) => isAccept && stepObj.accept(filters), false);
    }

    const getValue = function (metric) {
        const [value] = get(metric);

        return value;
    }

    const getFormat = function (metric, options) {
        const [value, metricObj] = get(metric);

        if (metricObj.dataType == 'number' && aggregateType == 'relativeDiff') {
            return MetricHelper.converters.formatNumber(value)+'%';
        }

        return MetricHelper.format(metricObj, value, options);
    }

    const get = function (metric) {
        const metricObj = MetricHelper.object(metric, metricConfig);
        if (!metricObj) {
            return [];
        }

        const values = reportSteps.map(reportStep => reportStep.getValue(metricObj)),
              aggOp = aggregateOperation(metricObj, aggregateType);

        return [aggOp(...values), metricObj];
    }

    const formatedValues = function (metricNames, options) {
        if (!metricNames) {
            return [];
        }

        return metricNames.map(metricName => getFormat(metricName, options));
    }

    const aggregateOperation = function (metric) {
        const metricObj = MetricHelper.object(metric, metricConfig);

        switch (metricObj.dataType) {
            case 'number':
                switch (aggregateType) {
                    case 'average':
                        return Math.avg;

                    case 'median':
                        return Math.median;

                    case 'standardDeviation':
                        return Math.stdev;

                    case 'absoluteDiff':
                        return absoluteDiff;

                    case 'relativeDiff':
                        return relativeDiff;
                }

            default:
                if (aggregateType != 'median' && metricObj.name == 'run') {
                    return count;
                }

                return metricObj.type == 'step' ? joinString : firstString;
        }
    }

    const absoluteDiff = function (a, b) {
        if (typeof a == "number" && typeof b == "number") {
            return b - a;
        }

        return joinString(a, b);
    }

    const relativeDiff = function (a, b) {
        if (typeof a == "number" && typeof b == "number") {
            return ((b / a) - 1) * 100;
        }

        return joinString(a, b);
    }

    const joinString = function () {
        const values = [...arguments];

        if (values.length) {
            values.sort();
            return values.reduce((prev, curr) => prev == curr ? prev : prev + ',' + curr, values[0]);
        }

        return '';
    }

    const firstString = function () {
        return arguments && arguments.length ? arguments[0] : '';
    }

    const count = function ()  {
        return arguments.length || 0;
    }

    return {
        steps,
        accept,
        formatedValues,
        getValue,
        getFormat
    }
}