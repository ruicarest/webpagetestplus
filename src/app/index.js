var Index = (function () {

    const init = function () {
        let settings = new AppSettings();

        let endpoint = settings.get('lastTabEndpoint') || settings.get('endpoint'),
            testCode = settings.get('lastTabTestCode');

        ExportPage.init(endpoint, testCode);
        RunPage.init(endpoint);
    
        UIkit.tab('#tabActions').show('actionExport');
    }

    init();

    return {
        runPage: RunPage,
        exportPage: ExportPage
    };
})()