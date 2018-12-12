var ReportStepGroup = function (stepsData, aggregateOp) {

    const metricConfig = new ReportMetricConfig();

    const steps = function () {
        return stepsData;
    }
    
    const accept = function (filters) {
        return stepsData.reduce((isAccept, stepObj) => isAccept && stepObj.accept(filters), false);
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
            metricValues = stepsData.map(stepObj => stepObj.getValue(metricName));

        return [(metric.aggregate || aggregateOp)(metricValues), metric];
    }

    const values = function (metricNames) {
        return metricNames.map(metricName => getFormat(metricName));
    }

    return {
        steps,
        accept,
        values,
        getValue,
        getFormat
    }
}