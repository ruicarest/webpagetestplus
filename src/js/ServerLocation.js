var ServerLocation = function (endpoint, cache = undefined) {

    const locationQuery = "getLocations.php?f=json";

    const getLocations = function () {
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
                request.open('GET', getJsonResultUrl(), true);
                request.send();
            });
    }

    const processResponseOk = function (response) {
        let instances = [];
        let data = response.response.data;
        for (instanceName in data) {
            instances.push(new ServerLocationInstance(data[instanceName]));
        }

        return instances;
    }

    const processResponseFail = function (response) {
        return new Error(response.statusText);
    }

    const getJsonResultUrl = function () {
        return new URL(locationQuery, endpoint).href;
    }

    return {
        getLocations
    };
}