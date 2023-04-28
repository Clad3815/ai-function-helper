const {
    Configuration,
    OpenAIApi
} = require('openai');

const getType = require('./getType');
const convertArgs = require('./convertArgs');
const {
    formatArg,
    formatObjectArgs
} = require('./formatArg');
const {
    retry,
    isValidJSON,
    parseJson
} = require('./utils');

const chalk = require('chalk');

let openai;

function createAiFunctionInstance(apiKey) {
    if (!apiKey) {
        throw new Error('You must provide an OpenAI API key');
    }
    const configuration = new Configuration({
        apiKey: apiKey
    });
    openai = new OpenAIApi(configuration);

    async function aiFunction(options) {
        let {
            functionName = "custom_function",
                args,
                description,
                showDebug = false,
                funcArgs = null,
                funcReturn = "dict",
                temperature = 0.8,
                frequency_penalty = 0,
                presence_penalty = 0,
                model = 'gpt-3.5-turbo',
                autoConvertReturn = true,
                max_tokens = null,
        } = options;
        let funcReturnString = funcReturn;
        let argsString = '';

        if (Array.isArray(args)) {
            let objectArgs = {};
            for (let i = 0; i < args.length; i++) {
                objectArgs[String.fromCharCode(97 + i)] = args[i];
            }
            args = objectArgs;
        } else if (getType(args) !== 'dict') {
            args = {
                s: args
            };
        }
        argsString = formatObjectArgs(args);

        if (getType(argsString) === 'str') {
            argsString = argsString.replace(/true/g, 'True').replace(/false/g, 'False');
            // Replace all line break by \n
            argsString = argsString.replace(/(\r\n|\n|\r)/gm, "\\n");
        }



        if (!funcArgs) {
            funcArgs = convertArgs(args);
        }

        let isJson = '';
        if (autoConvertReturn === true) {
            isJson = ' converted into a valid JSON string adhering to UTF-8 encoding using the python json.dumps() function';
        }

        if (funcReturnString === 'str') {
            isJson = ' without surrounding quotes';
        }

        const messages = [{
                role: 'user',
                content: `
            Current time: ${new Date().toISOString()}
            You are to assume the role of the following Python function:
            \`\`\`
            def ${functionName}(${funcArgs}) -> ${funcReturnString}:
            """
            ${description}
            """
            \`\`\`
            Only respond with your \`return\` value${isJson}. Do not include any other explanatory text in your response.
            
            `.split('\n').map(line => line.trim()).join('\n'),
            },
            {
                role: 'user',
                content: `${argsString}`,
            },
        ];
        if (showDebug) {
            console.log(chalk.yellow('####################'));
            console.log(chalk.blue.bold('Using AI function: '));
            console.log(chalk.yellow('####################'));
            console.log(chalk.green(messages[0]['content']));
            console.log(chalk.yellow('####################'));
            console.log(chalk.magenta('With arguments: ') + chalk.green(messages[1]['content'].trim()));
            console.log(chalk.yellow('####################'));
        }
        const gptResponse = await retry(() => openai.createChatCompletion({
            model: model,
            messages: messages,
            temperature: temperature,
            frequency_penalty: frequency_penalty,
            presence_penalty: presence_penalty,
            max_tokens: max_tokens,
            // top_p: 1,
        }));

        let answer = gptResponse.data.choices[0]['message']['content'];

        if (autoConvertReturn === true) {
            if (answer.startsWith("```python") && answer.endsWith("```")) {
                answer = answer.substring(9, answer.length - 3);
            } else if (answer.startsWith("```json") && answer.endsWith("```")) {
                answer = answer.substring(7, answer.length - 3);
            } else if (answer.startsWith("`'") && answer.endsWith("'`")) {
                answer = answer.substring(2, answer.length - 2);
            } else if (answer.startsWith("`\"") && answer.endsWith("\"`")) {
                answer = answer.substring(2, answer.length - 2);
            } else if (answer.startsWith("```") && answer.endsWith("```")) {
                answer = answer.substring(3, answer.length - 3);
            } else if (answer.startsWith("``") && answer.endsWith("``")) {
                answer = answer.substring(2, answer.length - 2);
            } else if (answer.startsWith("`") && answer.endsWith("`")) {
                answer = answer.substring(1, answer.length - 1);
            } else if (answer.startsWith('""') && answer.endsWith('""')) {
                answer = answer.substring(2, answer.length - 2);
            } else if (answer.startsWith('"') && answer.endsWith('"')) {
                answer = answer.substring(1, answer.length - 1);
            } else if (answer.startsWith("'") && answer.endsWith("'")) {
                answer = answer.substring(1, answer.length - 1);
            }

            if (answer.startsWith("return json.dumps(") && answer.endsWith(")")) {
                answer = answer.substring(18, answer.length - 1);
            }

            if (funcReturnString === 'str') {
                if (showDebug) {
                    console.log(chalk.yellow('####################'));
                    console.log(chalk.blue('Returning brut answer: ' + answer));
                    console.log(chalk.yellow('####################'));
                }
                return answer;
            }
            if (isValidJSON(answer)) {
                if (showDebug) {
                    console.log(chalk.green('####################'));
                    console.log(chalk.green('Valid JSON, returning it: ' + answer));
                    console.log(chalk.green('####################'));
                }
                return parseJson(answer);
            } else {
                if (showDebug) {
                    console.log(chalk.yellow('####################'));
                    console.log(chalk.red('Invalid JSON, trying to fix it: ' + answer));
                }
                let fixedAnswer = await fixBadJsonFormat(answer.trim(), showDebug);
                if (fixedAnswer !== "") {
                    return parseJson(fixedAnswer);
                } else {
                    if (showDebug) {
                        console.log(chalk.red('Could not fix JSON'));
                        console.log(chalk.yellow('####################'));
                    }
                }
            }
        } else {
            if (showDebug) {
                console.log(chalk.yellow('####################'));
                console.log(chalk.blue('Returning brut answer: ' + answer));
                console.log(chalk.yellow('####################'));
            }
        }
        return answer;
    }

    return aiFunction;
}
async function fixJsonString(pythonString) {
    // Trim the string
    pythonString = pythonString.trim();

    // Replace single quotes that are not preceded or followed by word characters with double quotes
    let jsonString = pythonString.replace(/(^|[^\\w])'($|[^\\w])/g, '$1"$2');

    // Check if the string start with "{" and end with "}," if yes delete the "," at the end
    if (jsonString.startsWith("{") && jsonString.endsWith("},")) {
        jsonString = jsonString.substring(0, jsonString.length - 1);
    }

    // Replace escaped single quotes with single quotes
    jsonString = jsonString.replace(/\\"/g, "'");

    // Fix unescaped double quotes within strings
    jsonString = jsonString.replace(/(\w)"(\w)/g, '$1\\"$2');

    // Replace all \' with '
    jsonString = jsonString.replace(/\\'/g, "'");

    // Replace all None with null
    jsonString = jsonString.replace(/None/g, 'null');

    // Replace all "True" with true and "False" with false
    jsonString = jsonString.replace(/True/g, 'true');
    jsonString = jsonString.replace(/False/g, 'false');

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

module.exports = {
    createAiFunctionInstance,
    fixBadJsonFormat
};