const getType = require('./getType');

function formatArg(arg) {
    const type = getType(arg);

    if (type === 'str' || type === 'int' || type === 'bool' || type === 'float') {
        return `"${arg}"`;
    } else if (type === 'list' || type === 'dict') {
        return JSON.stringify(arg);
    } else if (type === 'undefined' || type === 'null' || type === 'unknown') {
        return 'None';

    } else {
        console.log(`Warning: Unknown type ${type} for argument ${arg}`);
        return arg;
    }
}

function formatObjectArgs(obj) {
    const keys = Object.keys(obj);
    return keys.map(key => `${key}=${formatArg(obj[key])}`).join(', ');
}


module.exports = { formatArg, formatObjectArgs };