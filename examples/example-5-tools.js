// 5_using_tools.js
const { createAiFunctionInstance } = require('ai-function-helper');

const aiFunction = createAiFunctionInstance('your_api_key_here');

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function playNumberGuessingGame() {
  const options = {
    functionName: 'number_guessing_game',
    model: 'gpt-4o-mini',
    args: { maxAttempts: 5 },
    description: 'Play a number guessing game. Use the provided tool to generate a random number between 1 and 100, then guide the player to guess it.',
    outputSchema: {
      type: "object",
      properties: {
        gameLog: { type: "array", items: { type: "string" } },
        secretNumber: { type: "number" },
        guessedCorrectly: { type: "boolean" }
      },
      required: ["gameLog", "secretNumber", "guessedCorrectly"]
    },
    tools: [
      {
        name: "generate_random_number",
        function_call: generateRandomNumber,
        description: "Generate a random number between two values",
        parameters: {
          type: "object",
          properties: {
            min: { type: "number" },
            max: { type: "number" }
          },
          required: ["min", "max"]
        }
      }
    ]
  };

  try {
    const result = await aiFunction(options);
    console.log("Game Log:");
    result.gameLog.forEach((log, index) => {
      console.log(`Turn ${index + 1}: ${log}`);
    });
    console.log(`Secret Number: ${result.secretNumber}`);
    console.log(`Guessed Correctly: ${result.guessedCorrectly}`);
  } catch (error) {
    console.error("Error playing game:", error);
  }
}

playNumberGuessingGame();

// This example demonstrates the use of tools (helper functions).
// It implements a number guessing game where the AI uses a provided
// function to generate a random number, then simulates the game.
// This shows how to extend the AI's capabilities with custom functions.
