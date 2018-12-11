var HtmlHelper = (function () {

    const clearInner = function (elem) {
        elem.innerHTML = '';
    }

    const insertBeforeEnd = function (parent, html) {
        parent.insertAdjacentHTML('beforeend',  html);
    }

    return {
        clearInner,
        insertBeforeEnd
    };
})()