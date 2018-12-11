var RunPage = (function () {

    const init = function (endpoint) {
        let settings = new AppSettings();

        document.getElementById("runEndpoint").value = endpoint || settings.get('endpoint');

        bindEvents();
        refreshLocations();
    }

    const bindEvents = function () {
        document.getElementById('refreshLocations').addEventListener('click', refreshLocations);
    }

    const refreshLocations = function () {
        let endpoint = FormHelper.getInputValue('runEndpoint');
        let locationSelect = FormHelper.getInput('location')
        let serverLocations = new ServerLocation(endpoint);

        serverLocations.getLocations()
            .then(function (locations) {
                HtmlHelper.clearInner(locationSelect);
                locations.forEach(location => {
                    HtmlHelper.insertBeforeEnd(locationSelect, Template.render('locationOption', location));
                });
            });
    }

    return {
        init,
        refreshLocations
    };
})()