(function () {

    Math.avg = values => values.reduce((a, v) => a + v, 0) / values.length;

    Math.stdev = values => {
        let avg = Math.avg(values);

        return Math.sqrt(Math.avg(values.map(value => Math.pow(value - avg, 2))));
    }

    const round = Math.round;
    Math.round = (number, digits = 0) => {
        let decimals = Math.pow(10, digits);

        return round(number * decimals) / decimals
    }

    Math.median = array => {
        array.sort((a, b) => a - b);
        let mid = array.length / 2;
        return mid % 1 ? array[mid - 0.5] : (array[mid - 1] + array[mid]) / 2;
    }
})()