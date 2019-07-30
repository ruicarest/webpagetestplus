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
            return convertMeasureUnit(metric, metric.evaluate(stepObj));
        }

        return;
    }

    const format = function (metric, value, options) {
        if (!isValid(metric)) {
            return value;
        }

        switch (metric.dataType) {
            case 'string':
                return defaultString(value);

            case 'number':
                return formatNumber(value) + (options && options.measureUnit && metric.measureUnit ? metric.measureUnit : '') 

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

    const convertMeasureUnit = function (metric, value, options) {
        if (isValid(metric)) {
            switch (metric.originalMeasureUnit) {
                case 'ms':
                    return miliToSeconds(value);

                case 'B':
                    return bytesToKilobytes(value);
            }
        }

        return value
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