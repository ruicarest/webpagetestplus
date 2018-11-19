var Index = (function () {

    const onAggregationChange = function (aggregationInput) {
        let aggretateTypeInputs = getInputs("aggregateType"),
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

    const generateCsv = async function () {
        let wptEndpoint = getInputValue('wptEndpoint');
        let testCodes = getInputValue('testCode').split(',');
        let reportDocument = new ReportDocument(wptEndpoint);

        let tasks = testCodes.map(testCode => {
            return reportDocument
                .get(testCode)
                .catch((status) => {
                    console.log(status);
                });
        })

        Promise.all(tasks).then(reports => {
            setResult(reportDocument.exportCsv(reports, { metrics: getExportMetrics(), filters: getFilters(), aggregate: getAggregation() }));
        })
    }

    const copyToClipboard = function () {
        let csvInput = getInput('resultCsv');
        csvInput.select();
        document.execCommand("copy");
    }

    const getExportMetrics = function () {
        let metricInputs = getInputs('metrics');

        return Array.from(metricInputs).filter((i) => i.checked).map((i) => i.value);
    }

    const getFilters = function () {
        let filters = {};

        let cachedView = getCheckedInputValues('cachedView');
        if (cachedView.length) {
            filters.cachedView = cachedView;
        }

        let steps = getInputValue('steps')
            .split(',')
            .filter(s => s);
        if (steps.length) {
            filters.steps = steps.map(s => parseInt(s));
        }

        return filters;
    }

    const getAggregation = function () {
        let aggregateValue = getCheckedInputValue("aggregate");
        let aggregate = {};
        if (aggregateValue == "1") {
            let aggregateType = getCheckedInputValue("aggregateType");
            aggregate.type = aggregateType;
        }

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

    const setResult = function (text) {
        let csvInput = getInput('resultCsv');
        csvInput.innerText = text;
    }

    const renderMetricsSelector = function () {
        let metricCongig = new ReportMetricConfig();
        let metricSelector = document.getElementById('metricSelector');

        metricCongig.list()
            .filter(metric => metric.visible)
            .forEach(metric => metricSelector.insertAdjacentHTML('beforeend', Template.render('metricSelector', metric)));
    }

    renderMetricsSelector();

    return {
        onAggregationChange,
        generateCsv,
        copyToClipboard
    };
})()