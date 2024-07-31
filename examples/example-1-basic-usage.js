// 1_basic_usage.js
const { createAiFunctionInstance } = require('ai-function-helper');

// Replace 'your_api_key_here' with your actual OpenAI API key
const aiFunction = createAiFunctionInstance('your_api_key_here');

async function generateHaiku() {
  const options = {
    functionName: 'generate_haiku',
    model: 'gpt-4o-mini', // Default model
    args: { topic: 'autumn' },
    description: 'Generate a haiku about the given topic.',
    outputSchema: {
      type: "object",
      properties: {
        haiku: { type: "string" }
      },
      required: ["haiku"]
    }
  };

  try {
    const result = await aiFunction(options);
    console.log("Generated Haiku:");
    console.log(result.haiku);
  } catch (error) {
    console.error("Error generating haiku:", error);
  }
}

generateHaiku();

// This example demonstrates the basic usage of AI Function Helper.
// It creates an instance of the aiFunction with your API key and
// uses it to generate a haiku about autumn. The output is structured
// using a simple schema to ensure we get a string response.
