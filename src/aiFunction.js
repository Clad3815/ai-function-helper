const getType = require('./getType');
const convertArgs = require('./convertArgs');
const {
    formatArg,
    formatObjectArgs
} = require('./formatArg');
const fixBadJsonFormat = require('./fixBadJsonFormat');
const {
    retry,
    openai,
    isValidJSON,
    parseJson
} = require('./utils');

const chalk = require('chalk');


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
            autoConvertReturn = true
    } = options;
    let funcReturnString = funcReturn;
    let argsString = '';
    if (getType(args) === 'dict') {
        argsString = formatObjectArgs(args);
    } else if (Array.isArray(args)) {
        argsString = args.map(arg => formatArg(arg)).join(', ');
    } else {
        argsString = formatArg(args);
    }

    if (getType(argsString) === 'str') {
        argsString = argsString.replace(/true/g, 'True').replace(/false/g, 'False');
    }

    if (!funcArgs) {
        funcArgs = convertArgs(args);
    }

    let isJson = '';
    if (autoConvertReturn === true) {
        isJson = ' converted into a valid JSON string with UTF-8 encoding';
    }

    if (funcReturnString === 'str') {
        isJson = ' without surrounding quotes';
    }

    const messages = [{
            role: 'user',
            content: `
            Current time: ${new Date().toISOString()}
            You are now the following python function: 
            \`\`\`
            def ${functionName}(${funcArgs}) -> ${funcReturnString}:
            """
            ${description}
            """
            \`\`\`
            Only respond with your \`return\` value${isJson}. Do not include any other explanatory text in your response.`.split('\n').map(line => line.trim()).join('\n'),
        },
        {
            role: 'user',
            content: `${functionName}(${argsString})`,
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
        top_p: 1,
    }));

    let answer = gptResponse.data.choices[0]['message']['content'];

    if (autoConvertReturn === true) {
        if (answer.startsWith("```json") && answer.endsWith("```")) {
            answer = answer.substring(7, answer.length - 3);
        } else if (answer.startsWith("```") && answer.endsWith("```")) {
            answer = answer.substring(3, answer.length - 3);
        } else if (answer.startsWith("``") && answer.endsWith("``")) {
            answer = answer.substring(2, answer.length - 2);
        } else if (answer.startsWith("`") && answer.endsWith("`")) {
            answer = answer.substring(1, answer.length - 1);
        } else if (answer.startsWith('"') && answer.endsWith('"')) {
            answer = answer.substring(1, answer.length - 1);
        } else if (answer.startsWith("'") && answer.endsWith("'")) {
            answer = answer.substring(1, answer.length - 1);
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

module.exports = aiFunction;