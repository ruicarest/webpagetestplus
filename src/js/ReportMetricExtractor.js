var ReportMetricExtractor = function() {
    
    const metricConfig = new ReportMetricConfig();

    const accept = function(page, filters) {
        if (filters.cached && filters.cached.indexOf(get(page, 'cached')) == -1) {
            return false;
        }

        if (filters.steps && filters.steps.indexOf(get(page, 'stepNumber')) == -1) {
            return false;
        }

        return true;
    }

    const headers = function(metricNames) {
        return metricNames.map(headerDescription)
    }

    const values = function(page, metricNames) {
        return metricNames.map((metricName) => get(page, metricName));
    }

    const get = function(page, metricName) {
        let metric = metricConfig.get(metricName);
        let getter = metric.getter.split('.');
        let value = getter.reduce((obj, getter) => obj[getter], page);
        
        return metric.transform ? metric.transform(value) : value;
    }

    const headerDescription = function(metricName) {
        return metricConfig.get(metricName).description;
    }

    return {
        accept,
        headers,
        values,
        get
    }
}