const readline = require('readline');
const aiFunction = require('../src/aiFunction');
const chalk = require('chalk'); // Import chalk


const enableDebug = false; // Set to true to enable debug mode

let choosenLanguage = '';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function getUserInput(prompt, translate = false) {
    if (translate) prompt = await TranslateText(prompt);
    return new Promise((resolve) => {
        rl.question(prompt, (input) => {
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
        temperature: 0,
    });
    console.log(chalk.red(`####################`));

    console.log(chalk.green(`HP: ${aiData.hp}/${aiData.max_hp}`));
    console.log(chalk.green(`Mana: ${aiData.mana}/${aiData.max_mana}`));
    console.log(chalk.green(`Gold: ${aiData.gold}`));
    console.log(chalk.green(`Attributes: ${aiData.attributes_list}`));
    console.log(chalk.red(`####################`));
    return aiData;
}

async function generateValidClass(gameState, playerDescription) {
    aiData = await aiFunction({
        args: {
            gameSettings: gameState.gameSettings,
            playerDescription: playerDescription,
        },
        functionName: "generate_player_class",
        description: "Generate 4 possible classes for the player to choose from based on the game settings and the player description of his character. Use the gameSettings to modify game aspects like language (The output text must match the language selected+), difficulty, game environment (cyberpunk, medieval, fantasy, etc.), and other settings.",
        funcReturn: "list[str]",
        showDebug: enableDebug,
        convertToJson: true,
        temperature: 0,
    });
    // console.log(chalk.green(`AI: ${aiData}`));
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
    const username = await getUserInput('Choose your player username: ', true);
    const gameEnvironment = await getUserInput('Choose the environment of the game (cyberpunk, medieval, fantasy, etc.): ', true);
    const gameDifficulty = await getUserInput('Choose the difficulty of the game (easy, medium, hard, etc.): ', true);

    // const playerClass = await getValidClass();
    const description = await getUserInput('Choose the description of your character and all his traits: ', true);

    let player = {
        username,
        playerDescription: description,
    };
    let Welcome = await TranslateText(`Welcome, ${username} ! The game is about to start. Enjoy! `);
    console.log(chalk.green(Welcome));

    let gameState = {
        previous_choices: [],
        current_choice: 'Start the Game',
        last_text: Welcome,
        inventory: [],
        exp: 0,
        level: 1,
        gameSettings: {
            gameEnvironment: gameEnvironment,
            gameDifficulty: gameDifficulty,
            gameLanguage: gameLanguage
        },
    };

    possible_classes = await generateValidClass(gameState, description);
    // console.log(possible_classes);
    const playerClass = await getValidClass(possible_classes);
    player = {
        username,
        class: playerClass,
        playerDescription: description,
        ...await initializePlayerAttributes(gameState, playerClass),
    };

    gameState = {
        previous_choices: [],
        current_choice: 'Start the Game',
        last_text: Welcome,
        inventory: [],
        hp: player.hp,
        max_hp: player.max_hp,
        gold: player.gold,
        mana: player.mana,
        max_mana: player.max_mana,
        exp: 0,
        level: 1,
        playerClass: player.class,
        playerName: player.username,
        playerDescription: player.playerDescription,
        playerSpecialAttributes: player.attributes_list,
        gameSettings: {
            gameEnvironment: gameEnvironment,
            gameDifficulty: gameDifficulty,
            gameLanguage: gameLanguage
        },
    };


    while (true) {
        let aiData;
        try {
            let description = `
			Progress through a text-based adventure game based on the user's previous choices and the current choice. The model should manage all game values, such as hp, gold, exp, level and inventory, and return the results. The output should include possible_choices (options the user can select to continue the adventure), text, game_over (true or false), inventory (add any new item to it), exp, level hp, max_hp, gold, mana, and max_mana.
			Always add "See Inventory" and "See Stats" to the possible_choices list if they are not inside the list.
   			Use the gameSettings to modify game aspects like language (The output text must match the language selected+), difficulty, game environment (cyberpunk, medieval, fantasy, etc.), and other settings. Use the previous_choices list to understand the user's past decisions and the current_choice parameter to know the user's current selection. The last_text parameter represents the most recent text sent to the user based on their current choice.
				`;
            aiData = await aiFunction({
                args: gameState,
                functionName: "text_based_adventure_game",
                description: description.split('\n').map(line => line.trim()).join('\n'),
                funcReturn: "dict",
                showDebug: enableDebug,
                showDebug: true,
                convertToJson: true,
                temperature: 1,
            });
            if (enableDebug) console.log(aiData);
            console.log(aiData);
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
        gameState.previous_choices.push(gameState.current_choice);

        if (gameState.previous_choices.length > 15) {
            gameState.previous_choices.shift();
        }

        console.log(' ');

        if (aiData.game_over) {
            break;
        }
    }

    rl.close();
}

main();