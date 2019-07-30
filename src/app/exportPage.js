var ExportPage = (function () {

    const appSettings = new AppSettings();
    const metricConfig = new ReportMetricConfig();
    const cache = appSettings.get('useReportCache') ? new MemoryCache() : undefined;
    let rowSeparator, columnSeparator;

    const init = function (endpoint, testCode) {
        let settings = new AppSettings();

        document.getElementById("exportEndpoint").value = endpoint || settings.get('endpoint');
        document.getElementById("testCode").value = testCode;

        renderMetricsSelector();
        renderTableResult();
        bindEvents();
    }

    const processResults = function () {
        let exportEndpoint = FormHelper.getInputValue('exportEndpoint');
        let testCodes = getTestCodes();

        let reportExporter = new ReportExporter(exportEndpoint, cache);
        let tasks = testCodes.map(testCode => {
            return reportExporter
                .getRaw(testCode)
                .catch((status) => {
                    console.log(status);
                });
        })

        Promise.all(tasks).then(testsRaw => {
            let options = { metrics: getExportMetrics(), filters: getFilters(), aggregate: getAggregation() };
            const report = reportExporter.getReport(testsRaw, options);
            renderCsvResult(report, options);
            renderTableResult(report, options);
        })
    }

    const copyToClipboard = function () {
        const switcherDataTypes = UIkit.switcher(document.getElementsByClassName('js-SwitcherDataTypes'));
        switcherDataTypes.show(1);

        let csvInput = FormHelper.getInput('resultCsv');
        csvInput.select();
        document.execCommand("copy");
    }

    const onAggregationChange = function () {
        let aggregationInput = this,
            aggretateTypeInputs = document.getElementsByClassName("js-aggregationOption"),
            disabledAttr = 'disabled';

        Array.from(aggretateTypeInputs).forEach(i => {
            if (aggregationInput.checked) {
                i.removeAttribute(disabledAttr);
            }
            else {
                i.setAttribute(disabledAttr, disabledAttr);
            }
        });
    }

    const onMetricMoved = () => {
        setMetricsState();
    }

    const onMetricChange = () => {
        setMetricsState();
    }

    const setMetricsState = () => {
        var metrics = getExportMetrics(i => true);

        metricConfig.setMetricsState(metrics);
    }

    const getTestCodes = function () {
        var testCodeInputValue = FormHelper.getInputValue('testCode');

        return (testCodeInputValue || '').split(',').filter(t => t);
    }

    const getExportMetrics = function (filterCallback) {
        let metricInputs = FormHelper.getInputs('metrics');

        filterCallback = filterCallback || (i => i.checked);

        return Array.from(metricInputs).filter(filterCallback).map((i) => {
            return { name: i.value, selected: i.checked }
        });
    }

    const getFilters = function () {
        let filters = {};

        let cachedView = FormHelper.getCheckedInputValues('exportCachedView');
        if (cachedView.length) {
            filters.cachedView = cachedView;
        }

        let steps = {
            raw: FormHelper.getInputValue('steps')
        };
        steps.exclude = steps.raw.startsWith("!");
        let stepList = (steps.exclude ? steps.raw.substring(1) : steps.raw).split(',').filter(s => s);
        if (stepList.length) {
            steps.list = stepList.map(s => parseInt(s));
        }
        filters.steps = steps;

        let outliers = FormHelper.getCheckedInputValue('filterOutliers');
        if (outliers == '1') {
            filters.outliers = true;
        }

        let header = FormHelper.getCheckedInputValue('header');
        filters.header = (header == 'header');

        return filters;
    }

    const getAggregation = function () {
        let aggregate = {};

        let aggregateValue = FormHelper.getCheckedInputValue("aggregate");
        if (aggregateValue == '1') {
            let aggregateType = FormHelper.getCheckedInputValue("aggregateType");
            aggregate.type = aggregateType;

            aggregate.summary = getTestCodes().length == 2;
        }

        let mergeTestValue = FormHelper.getCheckedInputValue('mergeTest')
        aggregate.mergeTest = mergeTestValue == 'merge';

        return aggregate;
    }

    const renderMetricsSelector = function () {
        let metricSelector = document.getElementById('metricSelector');

        metricConfig.list()
            .filter(metric => metric.visible)
            .forEach(metric => HtmlHelper.insertBeforeEnd(metricSelector, Template.render('metricCheckbox', metric)));
    }

    const renderCsvResult = function (report, options) {
        rowSeparator = tranformSettingValue(appSettings.get('csvRowSeparator'));
        columnSeparator = tranformSettingValue(appSettings.get('csvColumnSeparator'));

        let csvText = '';
        if (report && options) {
            let csv = [];
            let metricNames = report.metrics.map(m => m.name);
            if (options.filters.header && report.metrics && report.metrics.length) {
                csv.push(report.metrics.map(m => m.description).reduce(csvColumnReducer, ''));
            }

            if (report.rows && report.rows.length) {
                report.rows.forEach(row => csv.push(row.formatedValues(metricNames).reduce(csvColumnReducer, '')));
            }

            if (report.summary && report.summary.length) {
                report.summary.forEach(row => csv.push(row.formatedValues(metricNames).reduce(csvColumnReducer, '')));
            }
            csvText = csv.reduce(csvRowReducer, '');
        }

        let csvInput = FormHelper.getInput('resultCsv');
        csvInput.value = csvText;
    }

    const csvColumnReducer = function (line, value) {
        return (line ? line + columnSeparator : '') + value;
    }

    const csvRowReducer = function (csv, line) {
        return (csv ? csv + rowSeparator : '') + line;
    }

    const tranformSettingValue = (value) =>
        !value ? value : value
            .replace("\\t", '\t')
            .replace("\\r", '\r')
            .replace("\\n", '\n');

    const renderTableResult = function (report) {
        report = report || new ReportExporter().emptyReport();
        const metricNames = report.metrics.map(m => m.name);
        const formatOptions = { measureUnit: true };
        const data = {
            metrics: report.metrics.map(m => m.description),
            rows: report.rows.map(row => row.formatedValues(metricNames, formatOptions)),
            summary: report.summary.map(row => row.formatedValues(metricNames, formatOptions))
        };
        let tableResultPlaceholder = document.getElementById('exportTableResult');
        HtmlHelper.clearInner(tableResultPlaceholder);
        HtmlHelper.insertBeforeEnd(tableResultPlaceholder, Template.render('tableResult', data))
    }

    const bindEvents = function () {
        document.getElementById('btnResult').addEventListener('click', processResults);
        document.getElementById('btnCopyClipboard').addEventListener('click', copyToClipboard);
        document.getElementById('aggregate').addEventListener('change', onAggregationChange);

        UIkit.util.on('#metricSelector', 'moved', onMetricMoved);
        UIkit.util.on('#metricSelector', 'change', onMetricChange);
    }

    return {
        init
    };
})()