async function retry(fn, retries = 3, delay = 1000) {
    try {
        return await fn();
    } catch (err) {
        if (retries === 0) throw err;
        await new Promise(resolve => setTimeout(resolve, delay));
        return retry(fn, retries - 1, delay);
    }
}

function isValidJSON(jsonString) {
    try {
        JSON.parse(jsonString);
    } catch (e) {
        // console.log(e);
        return false;
    }
    return true;
}

function parseJson(jsonString) {
    // Use unicode escape to avoid invalid character errors
    return JSON.parse(unicodeEscape(jsonString));
}

function unicodeEscape(str) {
    return str.replace(/[\u00A0-\u9999<>\&]/g, function(i) {
        return '\\u' + ('000' + i.charCodeAt(0).toString(16)).slice(-4);
    });
}

module.exports = {
    retry,
    isValidJSON,
    parseJson
};