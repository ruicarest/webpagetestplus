var Template = (function() {

    const templates = {};

    const create = function(strings, ...keys) {
        return (function(...values) {
            var dict = values[values.length - 1] || {};
            var result = [strings[0]];
            keys.forEach(function(key, i) {
                var value = Number.isInteger(key) ? values[key] : dict[key];
                result.push(value, strings[i + 1]);
            });
            return result.join('');
        });
    }

    const add = function(name, templateFunc) {
        templates[name] = templateFunc
    }

    const render = function(name, data) {
        return templates[name](data);
    }

    return {
        add,
        create,
        render,
        templates
    }
})()