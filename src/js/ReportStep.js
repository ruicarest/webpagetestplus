var ReportStep = function (reportDocument, stepObj) {

    const metricConfig = new ReportMetricConfig();

    const accept = function (filters) {
        if (filters.runs && filters.runs.indexOf(getValue('run')) == -1) {
            return false;
        }

        if (filters.cachedView && filters.cachedView.indexOf(getValue('cachedView')) == -1) {
            return false;
        }

        if (filters.steps.list && ((filters.steps.list.indexOf(getValue('step')) == -1) != filters.steps.exclude)) {
            return false;
        }

        if (filters.outliers) {
            let filters = {
                cachedView: getValue('cachedView'),
                steps: [getValue('step')]
            };
            let stdevStep = reportDocument.aggregations('standardDeviation', filters)[0];
            let averageStep = reportDocument.aggregations('average', filters)[0];

            let stdevValue = stdevStep.getValue('plt');
            let avgValue = averageStep.getValue('plt');
            let value = getValue('plt')

            if (value < avgValue - stdevValue || avgValue + stdevValue < value) {
                return false;
            }
        }

        return true;
    }

    const getValue = function (metric) {
        let [value] = get(metric);

        return value;
    }

    const getFormat = function (metric) {
        const [value, metricObj] = get(metric);

        return MetricHelper.format(metricObj, value);
    }

    const get = function (metric) {
        const metricObj = MetricHelper.object(metric, metricConfig);
        if (!metricObj) {
            return [];
        }

        return [MetricHelper.value(metricObj, stepObj), metricObj]
    }

    const formatedValues = function (metrics) {
        if (!metrics) {
            return;
        }

        return metrics.map(metric => getFormat(metric));
    }

    return {
        accept,
        formatedValues,
        getValue,
        getFormat
    }
}