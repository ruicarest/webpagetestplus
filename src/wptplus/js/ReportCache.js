var ReportCache = function () {

    const memory = {};

    const get = function (endpoint, testCode, getCallback) {
        return new Promise(
            (resolve, reject) => {
                let reportDoc = memory[endpoint + testCode];
                if (reportDoc) {
                    resolve(reportDoc);
                    return;
                }

                Promise.all([getCallback()])
                    .then(resultCallback => {
                        reportDoc = resultCallback[0];
                        if (reportDoc) {
                            set(endpoint, testCode, reportDoc);
                            resolve(reportDoc);
                        } else {
                            reject(reportDoc);
                        }
                    });
            })
    }

    const set = function (endpoint, testCode, reportDoc) {
        memory[endpoint + testCode] = reportDoc;
    }

    return {
        get,
        set
    };
}