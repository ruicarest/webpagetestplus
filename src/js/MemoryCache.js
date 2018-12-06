var MemoryCache = function (cacheKeyGenerator) {

    const memory = {};
    const cacheKeyFunc = cacheKeyGenerator || ((args) => args.join('_'));

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

    get = function () {
        let callback = getLastArgument([...arguments]),
            cacheKey = cacheKeyFunc(getCacheKeyArguments([...arguments]));

        let obj = memory[cacheKey];
        if (obj) {
            return obj;
        }

        obj = callback();
        if (obj) {
            set(cacheKey, obj);
            return obj;
        }
    }

    const set = function (cacheKey, obj) {
        memory[cacheKey] = obj;
    }

    const getCacheKeyArguments = function (args) {
        if (args.length > 1) {
            return args.slice(0, -1);
        }
    }

    const getLastArgument = function (args) {
        if (args.length > 1) {
            let callback = args.slice(-1)[0];
            if (typeof callback == 'function') {
                return callback;
            }
        }
    }

    return {
        getAsync,
        get,
        set
    };
}