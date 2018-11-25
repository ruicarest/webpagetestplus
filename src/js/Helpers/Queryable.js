var Queryable = function (arr) {
    "use strict";
    return {
        [Symbol.iterator]: arr[Symbol.iterator].bind(arr),
        map: function (f) {
            return Queryable({
                [Symbol.iterator]: function* () {
                    var item;
                    for (item of arr) {
                        yield f(x);
                    }
                }
            });
        },
        filter: function (predicate) {
            return Queryable({
                [Symbol.iterator]: function* () {
                    var item;
                    for (item of arr) {
                        if (predicate(item)) {
                            yield item;
                        }
                    }
                }
            });
        },
        some: function (predicate) {
            var item;
            for (item of arr) {
                if (predicate(item)) {
                    return true;
                }
            }

            return false;
        },
        first: function (predicate) {
            var item;
            for (item of arr) {
                if (!predicate || predicate(item)) {
                    return item;
                }
            }
        },
        forEach: function (action) {
            return Queryable({
                [Symbol.iterator]: function* () {
                    var item;
                    for (item of arr) {
                        action(item);
                        yield item;
                    }
                }
            });
        },
        concat: function (other) {
            return Queryable({
                [Symbol.iterator]: function* () {
                    var item;
                    for (item of arr) {
                        yield item;
                    }
                    for (item of other) {
                        yield item;
                    }
                }
            });
        },
        groupBy: function (keyGetter) {
            let map = new Map();
            let item;
            for (item of arr) {
                let key = keyGetter(item);
                let collection = map.get(key);
                if (!collection) {
                    map.set(key, [item]);
                } else {
                    collection.push(item);
                }
            };

            return map;
        },
        toArray: function () {
            return [...arr];
        }
    }
}