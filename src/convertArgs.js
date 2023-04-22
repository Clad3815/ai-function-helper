const getType = require('./getType');

function convertArgs(args) {
    let funcArgs = '';

    const type = getType(args);

    if (type === 'list') {
        for (let i = 0; i < args.length; i++) {
            const argType = getType(args[i]);
            funcArgs += `${String.fromCharCode(97 + i)}: ${argType}`;
            if (i < args.length - 1) {
                funcArgs += ', ';
            }
        }
    } else if (type === 'dict') {
        const keys = Object.keys(args);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const argType = getType(args[key]);
            funcArgs += `${key}: ${argType}`;
            if (i < keys.length - 1) {
                funcArgs += ', ';
            }
        }
        // Else if type is float or the string contain a valid float number
    } else if (type === 'float' || (type === 'str' && !isNaN(parseFloat(args)))) {
        funcArgs = 'f: float';
    } else if (type === 'str') {
        funcArgs = 's: str';
    } else if (type === 'int') {
        funcArgs = 'i: int';
    } else if (type === 'bool') {
        funcArgs = 'b: bool';

    } else {
        funcArgs = 'a: Anything';
    }

    return funcArgs;
}

module.exports = convertArgs;