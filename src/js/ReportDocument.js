var ReportDocument = function (wptUrl) {

    const wptQuery = 'export.php?bodies=1&pretty=1&test=';
    const metricsExtractor = new ReportMetricExtractor();

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
            report.pages
                .filter(page => metricsExtractor.accept(page, filters))
                .forEach(page => {
                    let metrics = metricsExtractor.values(page, exportMetrics);
                    csv.push(metrics.reduce(csvColumnReducer, ''))
                });
        });

        return csv.reduce(csvRowReducer, '');
    }

    const exportHeader = function (exportMetrics) {
        return metricsExtractor
            .headers(exportMetrics)
            .reduce(csvColumnReducer, '');
    }

    const processResponseOk = function (response) {
        return response.response.log;
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