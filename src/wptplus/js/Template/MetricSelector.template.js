Template.add('metricSelector', Template.create`
<label class="form-checkbox form-inline">
    <input type="checkbox" name="metrics" id="checkbox_${'name'}" value="${'name'}" ${'checked ? "checked" : ""'}>
    <i class="form-icon"></i>${'description'}
</label>`);

