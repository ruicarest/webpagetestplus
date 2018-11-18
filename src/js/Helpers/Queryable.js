var Queryable = function (arr) {
    "use strict";
    return {
        [Symbol.iterator]: arr[Symbol.iterator].bind(arr),
        map: function (f) {
            return Queryable({
                [Symbol.iterator]: function* () {
                    var x;
                    for (x of arr) {
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
                    var x;
                    for (x of arr) {
                        yield x;
                    }
                    for (x of other) {
                        yield x;
                    }
                }
            });
        },
        toArray: function () {
            return [...arr];
        }
    }
}