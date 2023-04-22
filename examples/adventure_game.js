const readline = require('readline');
const aiFunction = require('../src/aiFunction');
const chalk = require('chalk'); // Import chalk


const enableDebug = false; // Set to true to enable debug mode

let choosenLanguage = '';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function getUserInput(prompt, translate = false, defaultInput = '') {
    if (translate) prompt = await TranslateText(prompt);
    if (defaultInput != '') prompt = prompt + ` (${defaultInput})`;
    return new Promise((resolve) => {
        rl.question(prompt, (input) => {
            // Check if default input is set and if so, return it if the user input is empty
            if (defaultInput != '' && input == '') {
                input = defaultInput;
            }
            resolve(input);
        });
    });
}

let possible_classes = [];

async function TranslateText(text) {
    if (choosenLanguage == '') {
        return text;
    }
    let aiData = await aiFunction({
        args: {
            text: text,
            to: choosenLanguage,
        },
        functionName: "translate_text",
        description: "Translate text from one language to another. Use the to arguments to specify destination language. The text is from a game user interface",
        funcReturn: "str",
        showDebug: enableDebug,
        temperature: 0,
    });
    return aiData;
}

async function initializePlayerAttributes(gameState, playerClass) {
    console.log(chalk.green(`Generating player attributes...`));
    aiData = await aiFunction({
        args: {
            gameSettings: gameState.gameSettings,
            playerClass: playerClass,
        },
        functionName: "generate_player_attribut",
        description: "Generate random attributes (hp, max_hp, mana, max_mana, gold, attribute_list) for the player based on the game settings and the player class. The specials attribute must match the playerClass and gameSettings, like \"smart\" or stuff like that (up to 5). Use the gameSettings to modify game aspects like difficulty, game environment (cyberpunk, medieval, fantasy, etc.), and other settings.",
        funcReturn: "dict[hp, max_hp, mana, max_mana, gold, attributes_list]",
        showDebug: enableDebug,
        convertToJson: true,
        temperature: 0.3,
    });
    if (aiData == null) {
        console.log(chalk.red(`####################`));
        console.log(chalk.red(`Error: ${aiData}`));
        console.log(chalk.red(`####################`));
        return [];
    }
    console.log(chalk.red(`####################`));

    console.log(chalk.green(`HP: ${aiData.hp}/${aiData.max_hp}`));
    console.log(chalk.green(`Mana: ${aiData.mana}/${aiData.max_mana}`));
    console.log(chalk.green(`Gold: ${aiData.gold}`));
    console.log(chalk.green(`Attributes: ${aiData.attributes_list}`));
    console.log(chalk.red(`####################`));
    return aiData;
}

async function generateValidClass(gameState, playerDescription, playerSex) {
    aiData = await aiFunction({
        args: {
            gameSettings: gameState.gameSettings,
            playerDescription: playerDescription,
            playerSex: playerSex,
        },
        functionName: "generate_player_class",
        description: "Generate 4 possible classes for the player to choose from based on the game settings and the player description of his character and the character sex. Use the gameSettings to modify game aspects like language (The output text must match the language selected+), difficulty, game environment (cyberpunk, medieval, fantasy, etc.), and other settings.",
        funcReturn: "list[str]",
        showDebug: enableDebug,
        convertToJson: true,
        temperature: 0.4,
    });
    // console.log(chalk.green(`AI: ${aiData}`));
    if (aiData == null) {
        console.log(chalk.red(`####################`));
        console.log(chalk.red(`Error: ${aiData}`));
        console.log(chalk.red(`####################`));
        return [];
    }
    return aiData;
}

async function generateStartInventory(gameState, playerDescription, playerSex) {
    aiData = await aiFunction({
        args: {
            gameSettings: gameState.gameSettings,
            playerDescription: playerDescription,
            playerSex: playerSex,
        },
        functionName: "generate_player_inventory",
        description: "Generate starter player inventory based on the game settings and the player description of his character and the character sex. Use the gameSettings to modify game aspects like language (The output text must match the language selected+), difficulty, game environment (cyberpunk, medieval, fantasy, etc.), and other settings. ",
        funcReturn: "list[str]",
        showDebug: enableDebug,
        convertToJson: true,
        temperature: 0.2,
    });
    // console.log(chalk.green(`AI: ${aiData}`));
    console.log(chalk.red(`####################`));
    console.log(chalk.yellow(`Inventory:`));
    aiData.forEach((item) => {
        console.log(chalk.green(`- ${item}`));
    });
    console.log(chalk.red(`####################`));
    return aiData;
}

async function getValidClass(validClasses) {
    let playerClass;
    do {
        playerClass = await getUserInput('Choose a class (' + validClasses.join(', ') + '): ', true);
    } while (!validClasses.includes(playerClass));

    return playerClass;
}
async function main() {
    console.log(chalk.red(`############################`));
    console.log(chalk.red(`## Generate Your Own Game ##`));
    console.log(chalk.red(`############################`));
    const gameLanguage = await getUserInput('Choose the language of the game (en, fr, etc.): ');
    choosenLanguage = gameLanguage;
    const username = await getUserInput('Choose your player username: ', true, 'Jack');
    const gameEnvironment = await getUserInput('Choose the environment of the game (cyberpunk, medieval, fantasy, etc.): ', true, 'cyberpunk');
    const gameDifficulty = await getUserInput('Choose the difficulty of the game (easy, medium, hard, etc.): ', true, 'easy');
    const playerSex = await getUserInput('Choose the sex of your character: ', true, 'male');
    const description = await getUserInput('Choose the description of your character and all his traits: ', true);

    let player = {
        username,
        playerDescription: description,
    };
    let Welcome = await TranslateText(`Welcome, ${username} ! The game is about to start. Enjoy! `);
    console.log(chalk.green(Welcome));

    let gameState = {
        // previous_choices: [],
        current_choice: 'Start the Game',
        last_text: '',
        playerInventory: [],
        exp: 0,
        level: 1,
        text_history: [],
        gameSettings: {
            gameEnvironment: gameEnvironment,
            gameDifficulty: gameDifficulty,
            gameLanguage: gameLanguage
        },
    };

    possible_classes = await generateValidClass(gameState, description, playerSex);
    const playerClass = await getValidClass(possible_classes);
    player = {
        username,
        class: playerClass,
        sex: playerSex,
        playerDescription: description,
        ...await initializePlayerAttributes(gameState, playerClass),
    };

    gameState = {
        // previous_choices: [],
        current_choice: 'Start the Game',
        last_text: await TranslateText(`You wake up in a dark room. You don't remember anything.`),
        hp: player.hp,
        max_hp: player.max_hp,
        gold: player.gold,
        mana: player.mana,
        max_mana: player.max_mana,
        exp: 0,
        level: 1,
        playerClass: player.class,
        playerSex: player.sex,
        playerName: player.username,
        playerDescription: player.playerDescription,
        playerSpecialAttributes: player.attributes_list,
        playerInventory: [],
        text_history: [],
        gameSettings: {
            gameEnvironment: gameEnvironment,
            gameDifficulty: gameDifficulty,
            gameLanguage: gameLanguage
        },
    };
    gameState.playerInventory = await generateStartInventory(gameState, description, playerSex);
    while (true) {
        let aiData;
        try {
            let description = `
        Progress through a text-based adventure game based on the user's previous choices and the current choice. The model should manage all game values, such as hp, gold, exp, level, and playerInventory, and return the results. The output should include possible_choices (options the user can select to continue the adventure), text, game_over (true or false), playerInventory (add any new item to it), exp, level hp, max_hp, gold, mana, and max_mana.

        Use the gameSettings to modify game aspects like language (The output text must match the language selected+), difficulty, game environment (cyberpunk, medieval, fantasy, etc.), and other settings. Use the text_history list to understand the user's past decisions and the current_choice parameter to know the user's current selection. Each item in the text_history list contains the ai_text (the text sent by the AI) and the user_choice (the choice made by the user) for a single interaction. The last_text parameter represents the most recent text sent to the user based on their current choice.

        Your task is to generate a coherent response that aligns with the given context and provides a series of related options (possible_choices) for the user to choose from. You need to add as many choices as possible to make the game more dynamic. Ensure that the choices you provide match the context and content of the response. If the user selects a choice, make sure the following response corresponds to that choice and offers appropriate options for the user's next decision.
        `;

            aiData = await aiFunction({
                args: {
                    ...gameState,
                    text_history: gameState.text_history,
                },
                functionName: "text_based_adventure_game",
                description: description.split('\n').map(line => line.trim()).join('\n'),
                funcReturn: "dict",
                showDebug: enableDebug,
                // showDebug: true,
                convertToJson: true,
                temperature: 1,
            });
            if (enableDebug) console.log(aiData);
            // console.log(aiData);
        } catch (error) {
            console.log(error);
            continue;
        }

        gameState = {
            ...gameState,
            ...aiData,
            last_text: aiData.text,
        };

        delete gameState.possible_choices;
        delete gameState.text;

        console.log(chalk.cyan(aiData.text));
        if (aiData.possible_choices.length === 0) {
            aiData.possible_choices.push("Continue");
        }

        aiData.possible_choices.forEach((choice, index) => {
            console.log(chalk.yellow(`${index + 1}: ${choice}`));
        });

        const userChoice = parseInt(await getUserInput(chalk.magenta('Choose an option (1, 2, ...): ')), 10);
        gameState.current_choice = aiData.possible_choices[userChoice - 1];
        // gameState.previous_choices.push(gameState.current_choice);

        gameState.text_history.push({
            ai_text: aiData.text,
            user_choice: gameState.current_choice,
        });

        if (gameState.text_history.length > 15) {
            gameState.text_history.shift();
        }

        console.log(' ');

        if (aiData.game_over) {
            break;
        }
    }

    rl.close();


}
main();