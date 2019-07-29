(function () {

    Math.avg = function () {
        const values = [...arguments];
        if (values.length) {
            return values.reduce((a, v) => a + v, 0) / values.length;
        }

        return NaN;
    }

    Math.median = function () {
        let values = [...arguments];
        if (!values.length) {
            return NaN;
        }

        values.sort((a, b) => a - b);
        const mid = values.length / 2;

        return mid % 1 ? values[mid - 0.5] : (values[mid - 1] + values[mid]) / 2;
    }

    Math.stdev = function () {
        const values = [...arguments];
        if (values.length) {
            let avg = Math.avg(values);

            return Math.sqrt(Math.avg(values.map(value => Math.pow(value - avg, 2))));
        }

        return NaN;
    }

    const round = Math.round;
    Math.round = (number, digits = 0) => {
        let decimals = Math.pow(10, digits);

        return round(number * decimals) / decimals
    }
})()