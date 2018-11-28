window.addEvent("domready", function () {

    var settings = new FancySettings("WPT Plus Settings", "../icons/icon24.png");
    
    // SERVER
    settings.create({
        tab: i18n.get("server"),
        group: i18n.get("server"),
        name: "endpoint",
        type: "text",
        label: i18n.get("endpoint"),
        text: i18n.get("url")
    });

    // FORMAT
    settings.create({
        tab: i18n.get("format"),
        group: i18n.get("number"),
        name: "formatNumberDigits",
        type: "text",
        label: i18n.get("digits"),
        text: i18n.get("digits")
    });

    // LAST TAB
    settings.create({
        tab: i18n.get("lastTab"),
        group: i18n.get("wptResult"),
        name: "lastTabEndpoint",
        type: "text",
        label: i18n.get("endpoint"),
        text: i18n.get("url")
    });

    settings.create({
        tab: i18n.get("lastTab"),
        group: i18n.get("wptResult"),
        name: "lastTabTestCode",
        type: "text",
        label: i18n.get("testCode"),
        text: i18n.get("code")
    });
});
