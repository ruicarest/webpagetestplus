var Index = (function () {

    const init = function () {
        let settings = new AppSettings();
        let urlParams = new URLSearchParams(window.location.search);
        let endpoint = urlParams.get('host') || settings.get('endpoint') || '',
            testCode = urlParams.get('test') || '';

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