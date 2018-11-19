(function () {

    Math.avg = (values) => values.reduce((a, v) => a + v, 0) / values.length;

    Math.stdev = (values) => {
        let avg = Math.avg(values);

        return Math.sqrt(Math.avg(values.map(value => Math.pow(value - avg, 2))));
    }

    const round = Math.round;
    Math.round = (number, digits) => {
        let decimals = Math.pow(10, digits);
        
        return round(number * decimals) / decimals
    }
})()