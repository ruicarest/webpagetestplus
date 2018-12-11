var ServerLocationInstance = function (instanceData) {
    return {
        label: instanceData.Label,
        location: instanceData.location,
        browsers: instanceData.Browsers.split(','),
        status: instanceData.status,
        relayServer: instanceData.relayServer,
        relayLocation: instanceData.relayLocation,
        default: instanceData.default,
        group: instanceData.group
    }
}