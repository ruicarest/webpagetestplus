window.addEvent("domready", function () {

    var settings = new FancySettings("WPT Plus Settings", "../icons/icon24.png");
    var appSettings = new AppSettings();

    // SERVER
    settings.create({
        tab: i18n.get("server"),
        group: i18n.get("server"),
        name: "endpoint",
        type: "text",
        label: i18n.get("endpoint"),
        text: i18n.get("url")
    });

    settings.create({
        tab: i18n.get("server"),
        group: i18n.get("cache"),
        name: "useReportCache",
        type: "checkbox",
        label: i18n.get("useReportCache"),
    });

    // METRICS
    settings.create({
        tab: i18n.get("metrics"),
        group: i18n.get("aggregation"),
        name: "medianMetric",
        type: "radioButtons",
        label: i18n.get("medianMetric"),
        options: [
            { value: 'plt', text: i18n.get("pageLoadTime") },
            { value: 'speedIndex', text: i18n.get("speedIndex") }
        ]
    });

    let resetMetricOrderButton = settings.create({
        tab: i18n.get("metrics"),
        group: i18n.get("order"),
        name: "resetMetricOrder",
        type: "button",
        text: i18n.get("resetOrder")
    });

    let resetMetricCheckedButton = settings.create({
        tab: i18n.get("metrics"),
        group: i18n.get("checked"),
        name: "resetMetricChecked",
        type: "button",
        text: i18n.get("resetChecked")
    })

    // EXPORT
    settings.create({
        tab: i18n.get("export"),
        group: i18n.get("formatNumber"),
        name: "formatNumberDigits",
        type: "text",
        label: i18n.get("digits"),
        text: i18n.get("digits")
    });

    settings.create({
        tab: i18n.get("export"),
        group: i18n.get("formatNumber"),
        name: "formatNumberDigitSeparator",
        type: "text",
        label: i18n.get("digitSeparator"),
        text: i18n.get("digitSeparator")
    });

    settings.create({
        tab: i18n.get("export"),
        group: i18n.get("csv"),
        name: "csvColumnSeparator",
        type: "text",
        label: i18n.get("columnSeparator"),
        text: i18n.get("separator")
    });

    settings.create({
        tab: i18n.get("export"),
        group: i18n.get("csv"),
        name: "csvRowSeparator",
        type: "text",
        label: i18n.get("rowSeparator"),
        text: i18n.get("separator")
    });

    resetMetricOrderButton.addEvent('action', function () {
        appSettings.set('metricOrder', undefined);
    });

    resetMetricCheckedButton.addEvent('action', function() {
        appSettings.set('metricChecked', undefined);
    });
});
