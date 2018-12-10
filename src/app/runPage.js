var RunPage = (function () {
    
    const locationQuery = "getLocations.php?f=json";

    const init = function (endpoint) {
        let settings = new AppSettings();

        document.getElementById("runEndpoint").value = endpoint || settings.get('endpoint');
    }

    return {
        init
    };
})()