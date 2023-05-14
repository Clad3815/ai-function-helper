import {
    createAiFunctionInstance
} from '../src/aiFunction.js';

import * as dotenv from "dotenv";

dotenv.config();

const aiFunction = createAiFunctionInstance(process.env.OPENAI_API_KEY);

import readline from 'readline';
import chalk from 'chalk';


const enableDebug = false; // Set to true to enable debug mode
const enableAIDebug = true; // Set to true to enable debug mode for AI request/answer

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
        description: `Generate random attributes (hp, max_hp, mana, max_mana, gold, attributes_list) for the player based on the game settings and the player class. 
        
        Use the gameSettings to modify game aspects like language (The output text must match the language selected), difficulty, game environment (cyberpunk, medieval, fantasy, etc.), and other settings.
        The specials attribute (attributes_list) must match the player class and game settings (up to 5).
        Example: {"hp": 100, "max_hp": 100, "mana": 50, "max_mana": 50, "gold": 10, "attributes_list": ["smart", "night vision", "very strong", "good speaker", "charming"]}
        `,
        funcReturn: "dict[hp, max_hp, mana, max_mana, gold, attributes_list]",
        showDebug: enableDebug,
        // showDebug: true,
        autoConvertReturn: true,
        temperature: 0.7,
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
    console.log(chalk.green(`Generating player classes...`));
    aiData = await aiFunction({
        args: {
            gameSettings: gameState.gameSettings,
            playerDescription: playerDescription,
            playerSex: playerSex,
        },
        functionName: "generate_player_class",
        description: `Generate 4 possible classes for the player to choose from based on the game settings and the player description of his character and the character sex. 
        Use the gameSettings to modify game aspects like language (The output text must match the language selected), difficulty, game environment (cyberpunk, medieval, fantasy, etc.), and other settings. 
        The class name must match the sex of the player and the environment of the game (cyberpunk, medieval, fantasy, etc.). `,
        funcReturn: "list[str]",
        showDebug: enableDebug,
        // showDebug: true,
        autoConvertReturn: true,
        temperature: 0.7,
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

async function generateStartInventory(gameState, playerDescription, playerSex, playerClass) {
    console.log(chalk.green(`Generating player inventory...`));
    aiData = await aiFunction({
        args: {
            gameSettings: gameState.gameSettings,
            playerClass: playerClass,
            playerDescription: playerDescription,
            playerSex: playerSex,
        },
        functionName: "generate_player_inventory",
        description: `
        Generate an example of starter player inventory based on the game settings and the player description of his character and the character sex (if provided) for a text based game.
        Use the gameSettings to modify game aspects like language (The output text must match the language selected but variable name must always be in english), difficulty, game environment (cyberpunk, medieval, fantasy, etc.), and other settings.
        The inventory items must fit the world environment and the player class and description, you can generate any items you want as it's text based game and it's not need to fit any special format.
        Generate 5 items up to 15 possible items, depend on the game settings (difficulty, environment, etc.) and the player description. You are free to generate what you feel nice for a game starter pack
        Example of inventory items:
        {
            "items": [{
                "name": "Pistolet laser",
                "count": 1,
                "description": "Un pistolet laser de base",
                "type": "weapon",
                "value": 10
            }, {
                "name": "Combinaison de cuir",
                "count": 1,
                "description": "Une combinaison de cuir renforcé pour se protéger des ennemis",
                "type": "armor",
                "value": 20
            }, {
                "name": "Pilule de soin",
                "count": 3,
                "description": "Un médicament qui permet de récupérer de la santé",
                "type": "consumable",
                "value": 5
            }], ...
        }

        `,
        funcReturn: "dict",
        // showDebug: enableDebug,
        showDebug: true,
        temperature: 1,
    });
    // console.log(chalk.green(`AI: ${aiData}`));
    console.log(chalk.red(`############################################`));
    console.log(chalk.yellow(`Inventory:`));
    // Example: {"items": [{"name": "Puce de piratage", "count": 3, "description": "Une puce de piratage", "type": "outil", "value": 25}, {"name": "Pistolet à impulsion", "count": 1, "description": "Un pistolet à impulsion", "type": "arme", "value": 150}, {"name": "Combinaison de corps en kevlar", "count": 1, "description": "Une combinaison de corps en kevlar", "type": "armure", "value": 500}]}
    if (aiData && aiData.items) {
        aiData.items.forEach((item) => {
            console.log(chalk.red(`--------------------------------------------`));
            console.log(chalk.yellow(`Name: ${item.name}`));
            console.log(chalk.yellow(`Count: ${item.count}`));
            console.log(chalk.yellow(`Description: ${item.description}`));
            console.log(chalk.yellow(`Type: ${item.type}`));
            console.log(chalk.yellow(`Value: ${item.value}`));
        });
        console.log(chalk.red(`############################################`));
        return aiData.items;
    } else {
        aiData.forEach((item) => {
            console.log(chalk.red(`####################`));
            console.log(chalk.yellow(`Name: ${item.name}`));
            console.log(chalk.yellow(`Count: ${item.count}`));
            console.log(chalk.yellow(`Description: ${item.description}`));
            console.log(chalk.yellow(`Type: ${item.type}`));
            console.log(chalk.yellow(`Value: ${item.value}`));
            console.log(chalk.red(`####################`));
        });
        console.log(chalk.red(`############################################`));
        return aiData;
    }
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
    let Welcome = await TranslateText(`Welcome, ${username} ! The game is about to start. Have fun! `);
    console.log(chalk.green(Welcome));

    let gameState = {
        // previous_choices: [],
        current_choice: 'Start the Game',
        last_text: `Generating scenario for ${player.username}...`,
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
        last_text: `Generating scenario for ${player.username}...`,
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
    gameState.playerInventory = await generateStartInventory(gameState, description, playerSex, playerClass);
    while (true) {
        let aiData;
        try {
            let description = `
        Progress through a text-based adventure game based on the user's previous choices and the current choice. The model should manage all game values, such as hp, gold, exp, level, and playerInventory, and return the results. The output should include possible_choices (options the user can select to continue the adventure), text, game_over (true or false), playerInventory (add any new item to it), exp, level hp, max_hp, gold, mana, and max_mana.

        Use the gameSettings to modify game aspects like language (The output text must match the language selected+), difficulty, game environment (cyberpunk, medieval, fantasy, etc.), and other settings. Use the text_history list to understand the user's past decisions and the current_choice parameter to know the user's current selection. Each item in the text_history list contains the ai_text (the text sent by the AI) and the user_choice (the choice made by the user) for a single interaction. The last_text parameter represents the most recent text sent to the user based on their current choice.

        Your task is to generate a coherent response that aligns with the given context and provides a series of related options (possible_choices) for the user to choose from. You need to add as many choices as possible to make the game more dynamic. Ensure that the choices you provide match the context and content of the response. If the user selects a choice, make sure the following response corresponds to that choice and offers appropriate options for the user's next decision.
        `;
            console.log('[DEBUG] Sending request to AI: ' + JSON.stringify(gameState));
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
                autoConvertReturn: true,
                temperature: 1,
            });
            if (enableDebug) console.log(aiData);
            console.log('[DEBUG] Data got from AI: ' + JSON.stringify(aiData));
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