var MetricHelper = (function () {

    const appSettings = new AppSettings();

    const formatNumberDigits = () => parseInt(appSettings.get('formatNumberDigits'))
    const formatNumberDigitSeparator = () => appSettings.get('formatNumberDigitSeparator');

    const name = function (metric) {
        if (typeof metric == "string") {
            return metric;
        }

        if (isValid(metric)) {
            return metric.name;
        }

        return;
    }

    const value = function (metric, stepObj) {
        if (isValid(metric)) {
            return metric.evaluate(stepObj);
        }

        return;
    }

    const format = function (metric, value) {
        if (!isValid(metric)) {
            return value;
        }

        [value] = convertMeasureUnit(metric, value);

        switch (metric.dataType) {
            case 'string':
                return defaultString(value);

            case 'number':
                return formatNumber(value)

            default:
                return value;
        }
    }

    const object = function (metric, metricConfig) {
        if (isValid(metric)) {
            return metric;
        }

        if (typeof metric == "string" && metricConfig && metricConfig.get) {
            return metricConfig.get(metric);
        }

        return;
    }

    const isValid = function (metric) {
        if (typeof metric == "object") {
            if (metric.name &&
                metric.description &&
                metric.expression &&
                metric.evaluate &&
                metric.type &&
                metric.dataType) {
                return true;
            }
        }

        return false;
    }

    const convertMeasureUnit = function (metric, value) {
        if (isValid(metric)) {
            switch (metric.measureUnit) {
                case 'ms':
                    return [miliToSeconds(value), 's'];

                case 'B':
                    return [bytesToKilobytes(value), 'KB'];

                default:
                    return [value, metric.measureUnit];
            }
        }

        return [value, undefined]
    }

    const miliToSeconds = (time) => time / 1000;

    const bytesToKilobytes = (time) => time / 1024;

    const formatNumber = (value, digits, defaultValue = 0) =>
        Math.round(!value ? defaultValue : value, digits == undefined ? formatNumberDigits() : digits)
            .toString()
            .replace('.', formatNumberDigitSeparator());

    const defaultString = (value, defaultValue = 'n/a') => !value ? defaultValue : value;

    return {
        name,
        value,
        format,
        object,
        isValid,
        converters: {
            miliToSeconds,
            bytesToKilobytes,
            formatNumber,
            defaultString
        }
    };
})()