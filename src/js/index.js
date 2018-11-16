var Index = (function () {

    const generate = async function () {
        let wptEndpoint = getInputTextValue('wptEndpoint');
        let testCodes = getInputTextValue('testCode').split(',');
        let reportDocument = new ReportDocument(wptEndpoint);

        let tasks = testCodes.map(testCode => {
            return reportDocument
                .get(testCode)
                .catch((status) => {
                    console.log(status);
                });
        })

        Promise.all(tasks).then(reports => {
            setResult(reportDocument.exportCsv(reports, getExportMetrics(), getFilters()));
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

        let cached = getCheckBoxValues('cached', true);
        if (cached.length) {
            filters.cached = cached.map(i => parseInt(i));
        }

        let steps = getInputTextValue('steps')
            .split(',')
            .filter(s => s);
        if (steps.length) {
            filters.steps = steps.map(s => parseInt(s));
        }

        return filters;
    }

    const getInputTextValue = function (inputName) {
        let inputText = getInput(inputName)

        return inputText ? inputText.value : '';
    }

    const getCheckBoxValues = function (inputName, checked) {
        let checkboxes = Array.from(getInputs(inputName))

        if (checked != undefined) {
            checkboxes = checkboxes.filter(c => c.checked == checked);
        }

        return checkboxes.map(c => c.value);
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

        metricCongig.list().forEach(metric => {
            metricSelector.insertAdjacentHTML('beforeend', Template.render('metricSelector', metric));
        });
    }

    renderMetricsSelector();

    return {
        generate,
        copyToClipboard,
    };
})()