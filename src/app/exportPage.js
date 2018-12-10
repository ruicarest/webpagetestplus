var ExportPage = (function () {

    const settings = new AppSettings();
    const metricCongig = new ReportMetricConfig();
    const cache = settings.get('useReportCache') ? new MemoryCache() : undefined;

    const generateCsv = function () {
        let exportEndpoint = getInputValue('exportEndpoint');
        let testCodes = getInputValue('testCode').split(',');

        let reportExporter = new ReportExporter(exportEndpoint, cache);

        let tasks = testCodes.map(testCode => {
            return reportExporter
                .get(testCode)
                .catch((status) => {
                    console.log(status);
                });
        })

        Promise.all(tasks).then(reports => {
            setResult(reportExporter.exportCsv(reports, { metrics: getExportMetrics(), filters: getFilters(), aggregate: getAggregation() }));
        })
    }

    const copyToClipboard = function () {
        let csvInput = getInput('resultCsv');
        csvInput.select();
        document.execCommand("copy");
    }

    const onAggregationChange = function () {
        let aggregationInput = this,
            aggretateTypeInputs = getElementsByClassName("js-aggregationOption"),
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

    const onMetricMoved = function () {
        var metrics = getExportMetrics(i => true);

        metricCongig.setOrder(metrics);
    }

    const getExportMetrics = function (filterCallback) {
        let metricInputs = getInputs('metrics');

        filterCallback = filterCallback || (i => i.checked);

        return Array.from(metricInputs).filter(filterCallback).map((i) => i.value);
    }

    const getFilters = function () {
        let filters = {};

        let cachedView = getCheckedInputValues('exportCachedView');
        if (cachedView.length) {
            filters.cachedView = cachedView;
        }

        let steps = getInputValue('steps')
            .split(',')
            .filter(s => s);
        if (steps.length) {
            filters.steps = steps.map(s => parseInt(s));
        }

        let outliers = getCheckedInputValue('filterOutliers');
        if (outliers == '1') {
            filters.outliers = true;
        }

        let header = getCheckedInputValue('header');
        filters.header = (header == 'header');

        return filters;
    }

    const getAggregation = function () {
        let aggregate = {};

        let aggregateValue = getCheckedInputValue("aggregate");
        if (aggregateValue == '1') {
            let aggregateType = getCheckedInputValue("aggregateType");
            aggregate.type = aggregateType;
        }

        let mergeTestValue = getCheckedInputValue('mergeTest')
        aggregate.mergeTest = mergeTestValue == 'merge';

        return aggregate;
    }

    const getInputValue = function (inputName) {
        let inputText = getInput(inputName)

        return inputText ? inputText.value : '';
    }

    const getCheckedInputValues = function (inputName, checked = true) {
        let checkboxes = Array.from(getInputs(inputName))

        if (checked != undefined) {
            checkboxes = checkboxes.filter(c => c.checked == checked);
        }

        return checkboxes.map(c => c.value);
    }

    const getCheckedInputValue = function (inputName, checked = true) {
        return getCheckedInputValues(inputName, checked)[0];
    }

    const getInput = function (inputName) {
        return getInputs(inputName)[0]
    }

    const getInputs = function (inputName) {
        return document.getElementsByName(inputName)
    }

    const getElementsByClassName = function (className) {
        return document.getElementsByClassName(className)
    }

    const setResult = function (text) {
        let csvInput = getInput('resultCsv');
        csvInput.innerText = text;
    }

    const renderMetricsSelector = function () {
        let metricSelector = document.getElementById('metricSelector');

        metricCongig.list()
            .filter(metric => metric.visible)
            .forEach(metric => metricSelector.insertAdjacentHTML('beforeend', Template.render('metricSelector', metric)));
    }

    const bindEvents = function () {
        document.getElementById('btnResult').addEventListener('click', generateCsv);
        document.getElementById('btnCopyClipboard').addEventListener('click', copyToClipboard);
        document.getElementById('aggregate').addEventListener('change', onAggregationChange);

        UIkit.util.on('#metricSelector', 'moved', onMetricMoved);
    }

    const init = function (endpoint, testCode) {
        let settings = new AppSettings();

        document.getElementById("exportEndpoint").value = endpoint || settings.get('endpoint');
        document.getElementById("testCode").value = testCode;        
    }

    renderMetricsSelector();
    bindEvents();

    return {
        init,
        generateCsv,
        copyToClipboard
    };
})()