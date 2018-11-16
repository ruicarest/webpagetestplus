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
                    reject(processResponseFail(this.statusText));
                };
                request.open('GET', wptUrl + wptQuery + testCode);
                request.send();
            });
    }

    const exportCsv = function (report, exportMetrics, filters) {
        let csv = [];
        let headers = metricsExtractor.headers(exportMetrics);
        csv.push(headers.reduce(csvColumnReducer, ''));
        report.pages
            .filter(page => metricsExtractor.accept(page, filters))
            .forEach(page => {
                let metrics = metricsExtractor.values(page, exportMetrics);
                csv.push(metrics.reduce(csvColumnReducer, ''))
            });
        return csv.reduce(csvRowReducer, '');
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
        exportCsv
    }
}