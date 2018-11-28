const ReportHelper = (function () {

    const getUrlInfo = function (url) {
        let urlInfo =
            url.match(/(https?:\/\/([^:\/]+).*\/)result\/(\w+_\w+_\w+)/) ||
            url.match(/(https?:\/\/([^:\/]+).*\/).*test=(\w+_\w+_\w+)/);

        if (!urlInfo) {
            return {
                url: url,
                isValid: false
            }
        }

        return {
            url: url,
            endpoint: urlInfo[1],
            host: urlInfo[2],
            testCode: urlInfo[3],
            isValid: true
        }
    }

    return {
        getUrlInfo
    };
})()