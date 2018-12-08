Array.prototype.groupBy = function (keyGetter) {
    let map = new Map();
    let item;
    for (item of this) {
        let key = keyGetter(item);
        let collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    };

    return map;
}