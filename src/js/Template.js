var Template = (function () {

    const templates = {};

    const init = function () {
        let templates = document.querySelectorAll('script[type=template][id]');
        for (let template of templates) {
            add(template.id, compile(template.innerText));
        }
    }
    
    const add = function (name, templateRender) {
        templates[name] = templateRender;
    }
    
    const render = function (name, context) {
        return templates[name].render(context);
    }

    const compile = function (str) {
        return nunjucks.compile(str);
    } 

    init();

    return {
        add,
        render,
        compile,
        templates
    }
})()