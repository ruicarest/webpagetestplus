Template.add('metricSelector', Template.create`
<label>
    <input class="uk-checkbox" type="checkbox" name="metrics" id="checkbox_${'name'}" value="${'name'}" ${'checked ? "checked" : ""'}> ${'description'}
</label>`);

