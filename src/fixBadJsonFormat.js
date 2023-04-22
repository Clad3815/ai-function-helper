const {
    retry,
    openai,
    isValidJSON
} = require('./utils');

const chalk = require('chalk');

async function fixJsonString(pythonString) {
    // Trim the string
    pythonString = pythonString.trim();

    // Replace single quotes that are not preceded or followed by word characters with double quotes
    let jsonString = pythonString.replace(/(^|[^\\w])'($|[^\\w])/g, '$1"$2');

    // Replace escaped single quotes with single quotes
    jsonString = jsonString.replace(/\\"/g, "'");

    // Fix unescaped double quotes within strings
    jsonString = jsonString.replace(/(\w)"(\w)/g, '$1\\"$2');

    // Replace all \' with '
    jsonString = jsonString.replace(/\\'/g, "'");

    // Replace all None with null
    jsonString = jsonString.replace(/None/g, 'null');

    // Delete all ` from the start and the end of the string (1 or more)
    jsonString = jsonString.replace(/^`+|`+$/g, '');

    // Delete all ' from the start and the end of the string (1 or more)
    jsonString = jsonString.replace(/^'+|'+$/g, '');

    return jsonString;
}


async function fixBadJsonFormat(jsonString, showDebug = false) {

    const tryFixJsonString = await fixJsonString(jsonString);
    if (tryFixJsonString !== jsonString) {
        if (isValidJSON(tryFixJsonString)) {
            if (showDebug) {
                console.log(chalk.green('Fixed JSON (by function): ' + tryFixJsonString));
                console.log(chalk.yellow('####################'));
            }
            return tryFixJsonString;
        }
    }
    let gptMessages = [];
    gptMessages.push({
        role: "system",
        content: "Your task is to fix a JSON string, answer just with the fixed string or the same string if it's already valid. In JSON, all keys and strings must be enclosed in double quotes. Additionally, boolean values must be in lowercase. You must fix also any escaped characters badly formatted."
    });
    gptMessages.push({
        role: "user",
        content: jsonString
    });
    const gptResponse = await retry(() => openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: gptMessages,
        temperature: 0,
    }));
    let answer = gptResponse.data.choices[0]['message']['content'];
    if (isValidJSON(answer)) {
        if (showDebug) {
            console.log(chalk.green('Fixed JSON (by AI): ' + answer));
            console.log(chalk.yellow('####################'));
        }
        return answer;
    } else {
        return "";
    }
}

module.exports = fixBadJsonFormat;