Template.add('metricSelector', Template.create`
<div>
    <span uk-icon="icon: table; ratio: 0.5"></span>
    <label>
        <input class="uk-checkbox" type="checkbox" name="metrics" id="checkbox_${'name'}" value="${'name'}" ${'checked ? "checked" : ""'}> ${'description'}
    </label>
</div>
`);

