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

    const exportCsv = function (reports, exportMetrics, filters, header = true) {
        let csv = [];
        if (header) {
            csv.push(exportHeader(exportMetrics));
        }

        reports.forEach(report => {
            Queryable(metricExtractor.pages(report))
                .filter(page => metricExtractor.accept(page, filters))
                .forEach(page => {
                    let metrics = metricExtractor.values(page, exportMetrics);
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