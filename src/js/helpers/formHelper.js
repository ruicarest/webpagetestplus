var FormHelper = (function () {

    const getInput = function (inputName) {
        return getInputs(inputName)[0]
    }

    const getInputs = function (inputName) {
        return document.getElementsByName(inputName)
    }

    const getInputValue = function (inputName) {
        let inputText = getInput(inputName)

        return inputText ? inputText.value : '';
    }

    const getCheckedInputValue = function (inputName, checked = true) {
        return getCheckedInputValues(inputName, checked)[0];
    }

    const getCheckedInputValues = function (inputName, checked = true) {
        let checkboxes = Array.from(getInputs(inputName))

        if (checked != undefined) {
            checkboxes = checkboxes.filter(c => c.checked == checked);
        }

        return checkboxes.map(c => c.value);
    }

    return {
        getInput,
        getInputs,
        getInputValue,
        getCheckedInputValue,
        getCheckedInputValues
    };
})()