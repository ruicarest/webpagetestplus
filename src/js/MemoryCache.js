var MemoryCache = function (cacheKeyGenerator) {

    const memory = {};

    const getAsync = function () {
        return new Promise(
            (resolve, reject) => {
                var result = get(...arguments);
                if (result) {
                    resolve(result);
                } else {
                    reject(result);
                }
            });
    }

    const get = function (cacheKeyObj, callback, isExpiredCallback) {
        let cacheKey = cacheKeyBuild(cacheKeyObj);

        let obj = memory[cacheKey];
        if (obj && (!isExpiredCallback || !isExpiredCallback(obj))) {
            return obj;
        } 

        obj = callback();
        set(cacheKey, obj);

        return obj;
    }

    const set = function (cacheKey, obj) {
        if (obj) {
            memory[cacheKey] = obj;
        }
    }

    const cacheKeyBuild = function (cacheKeyObj) {
        if (typeof cacheKeyObj == 'object' && Array.isArray(cacheKeyObj)) {
            return cacheKeyObj.join('_')
        }

        return cacheKeyObj;
    }

    return {
        getAsync,
        get,
        set
    };
}