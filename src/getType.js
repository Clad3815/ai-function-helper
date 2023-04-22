function getType(value) {
    const type = Object.prototype.toString.call(value);

    if (type === '[object Array]') {
        return 'list';
    } else if (type === '[object Object]') {
        return 'dict';
    } else if (type === '[object String]') {
        return 'str';
    } else if (type === '[object Number]' && value % 1 !== 0) {
        return 'float';
    } else if (type === '[object Number]') {
        return 'int';
    } else if (type === '[object Boolean]') {
        return 'bool';
    } else {
        return 'unknown';
    }
}

module.exports = getType;