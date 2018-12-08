var ReportStepGroup = function (stepObjs, aggregateOp) {

    const metricConfig = new ReportMetricConfig();

    const accept = function (filters) {
        return stepObjs.reduce((isAccept, stepObj) => isAccept && stepObj.accept(filters), false);
    }

    const getValue = function (metricName) {
        let [value] = get(metricName);

        return value;
    }

    const getFormat = function (metricName) {
        let [value, metric] = get(metricName);

        return metric.format ? metric.format(value) : value;
    }

    const get = function (metricName) {
        let metric = metricConfig.get(metricName),
            metricValues = stepObjs.map(stepObj => stepObj.getValue(metricName));

        return [(metric.aggregate || aggregateOp)(metricValues), metric];
    }

    const values = function (metricNames) {
        return metricNames.map(metricName => getFormat(metricName));
    }

    return {
        accept,
        values,
        getValue,
        getFormat
    }
}