var RunPage = (function () {

    const init = function (endpoint) {
        let settings = new AppSettings();

        document.getElementById("runEndpoint").value = endpoint || settings.get('endpoint');

        bindEvents();
        refreshLocations();
    }

    const bindEvents = function () {
        document.getElementById('refreshLocations').addEventListener('click', refreshLocations);
        document.getElementById("location").addEventListener('change', refreshBrowsers);
        document.getElementById('emulate').addEventListener('change', onEmulateChange);
    }

    const refreshLocations = function () {
        let endpoint = FormHelper.getInputValue('runEndpoint');
        let locationSelect = FormHelper.getInput('location')
        let serverLocations = new ServerLocation(endpoint);

        serverLocations.getLocations()
            .then(function (locations) {
                locationSelect.innerHTML = Template.render('locationOptions', { items: locations.groupBy(l => l.group) });
                var location = locations.filter(l => l.default)[0];
                renderBrowsers(location);
            });
    }

    const refreshBrowsers = function () {
        let locationName = this.value;
        let endpoint = FormHelper.getInputValue('runEndpoint');
        let serverLocations = new ServerLocation(endpoint);

        serverLocations.getLocations()
            .then(function (locations) {
                var location = locations.filter(l => l.location == locationName)[0];
                renderBrowsers(location);
            });
    }

    const renderBrowsers = function (location) {
        let runBrowsers = document.getElementById('runBrowsers')
        HtmlHelper.clearInner(runBrowsers);
        if (location) {
            runBrowsers.innerHTML = Template.render('checkboxBrowser', location);
        }
    }

    const onEmulateChange = function () {
        let emulateInput = this,
            emulateInputs = document.getElementsByName("emulateBrowser"),
            disabledAttr = 'disabled';

        Array.from(emulateInputs).forEach(i => {
            if (emulateInput.checked) {
                i.removeAttribute(disabledAttr);
            }
            else {
                i.setAttribute(disabledAttr, disabledAttr);
            }
        });
    }

    return {
        init,
        refreshLocations
    };
})()