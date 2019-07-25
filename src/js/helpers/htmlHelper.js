var HtmlHelper = (function () {

    const clearInner = function (elem) {
        elem.innerHTML = '';
    }

    function createElementFromHTML(htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();

        return div.firstChild;
    }

    const insertBeforeEnd = function (parent, html) {
        parent.insertAdjacentHTML('beforeend', html);
    }

    return {
        clearInner,
        createElementFromHTML,
        insertBeforeEnd
    };
})()