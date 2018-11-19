var ReportDocument = function (wptUrl) {

    const wptQuery = 'jsonResult.php?test=';
    const metricExtractor = new ReportMetricExtractor();

    const get = async function (testCode) {
        return new Promise(
            (resolve, reject) => {
                const request = new XMLHttpRequest();
                request.responseType = 'json';
                request.onload = function () {
                    if (this.status === 200) {
                        resolve(processResponseOk(this));
                    } else {
                        reject(processResponseFail(this));
                    }
                };
                request.onerror = function () {
                    reject(processResponseFail(this));
                };
                request.open('GET', wptUrl + wptQuery + testCode);
                request.send();
            });
    }

    const exportCsv = function (reports, options, header = true) {
        let csv = [];
        if (header) {
            csv.push(exportHeader(options.metrics));
        }

        reports.forEach(report => {
            let pages;
            if (options.aggregate.type) {
                pages = Queryable(metricExtractor.aggregation(report, options.aggregate.type));
            } else {
                pages = Queryable(metricExtractor.pages(report));
            }

            pages.filter(page => metricExtractor.accept(page, options.filters))
                .forEach(page => {
                    let metrics = metricExtractor.values(page, options.metrics);
                    csv.push(metrics.reduce(csvColumnReducer, ''))
                })
                .toArray();
        });

        return csv.reduce(csvRowReducer, '');
    }

    const exportHeader = function (exportMetrics) {
        return metricExtractor
            .headers(exportMetrics)
            .reduce(csvColumnReducer, '');
    }

    const processResponseOk = function (response) {
        return response.response.data;
    }

    const processResponseFail = function (response) {
        return new Error(response.statusText)
    }

    const csvColumnReducer = function (line, value) {
        return (line ? line + '\t' : '') + value;
    }

    const csvRowReducer = function (csv, line) {
        return (csv ? csv + '\n' : '') + line;
    }

    return {
        get,
        exportCsv,
        exportHeader
    }
}