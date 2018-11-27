window.addEvent("domready", function () {

    var settings = new FancySettings("WPT Plus Settings", "../icons/icon19.png");

    settings.create({
        "tab": i18n.get("server"),
        "group": i18n.get("server"),
        "name": "endpoint",
        "type": "text",
        "label": i18n.get("endpoint"),
        "text": i18n.get("url")
    });

    settings.create({
        "tab": i18n.get("lastTab"),
        "group": i18n.get("wptResult"),
        "name": "lastTabEndpoint",
        "type": "text",
        "label": i18n.get("endpoint"),
        "text": i18n.get("url")
    });

    settings.create({
        "tab": i18n.get("lastTab"),
        "group": i18n.get("wptResult"),
        "name": "lastTabTestCode",
        "type": "text",
        "label": i18n.get("testCode"),
        "text": i18n.get("code")
    });
});
