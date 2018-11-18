var Template = (function () {

    const templates = {};

    const create = function (strings, ...keys) {
        let evalKeys = keys.map(k => [k, jsonata(k)]) 
        return (function (...values) {
            let dict = values[values.length - 1] || {};
            let result = [strings[0]];
            evalKeys.forEach(function ([key, evalKey], i) {
                var value = Number.isInteger(key) ? values[key] : evalKey.evaluate(dict);
                result.push(value, strings[i + 1]);
            });
            return result.join('');
        });
    }

    const add = function (name, templateFunc) {
        templates[name] = templateFunc
    }

    const render = function (name, data) {
        return templates[name](data);
    }

    return {
        add,
        create,
        render,
        templates
    }
})()