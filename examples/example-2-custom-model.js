// 2_custom_model.js
const { createAiFunctionInstance } = require('ai-function-helper');

const aiFunction = createAiFunctionInstance('your_api_key_here');

async function summarizeText() {
  const options = {
    functionName: 'summarize_text',
    model: 'gpt-4o', // Using a more advanced model for better summarization
    args: {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    description: 'Summarize the given text in one or two sentences.',
    outputSchema: {
      type: "object",
      properties: {
        summary: { type: "string" }
      },
      required: ["summary"]
    }
  };

  try {
    const result = await aiFunction(options);
    console.log("Text Summary:");
    console.log(result.summary);
  } catch (error) {
    console.error("Error summarizing text:", error);
  }
}

summarizeText();

// This example shows how to use a specific AI model (GPT-4 in this case)
// for a task that might benefit from more advanced capabilities.
// It summarizes a given text, demonstrating how to pass longer text
// inputs and receive structured outputs.
