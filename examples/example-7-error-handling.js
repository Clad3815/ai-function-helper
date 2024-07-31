// 7_error_handling_and_retries.js
const { createAiFunctionInstance } = require('ai-function-helper');

const aiFunction = createAiFunctionInstance('your_api_key_here');

async function robustFunctionCall() {
  const options = {
    functionName: 'robust_function',
    model: 'gpt-4o-mini',
    args: { complexArg: "This is a complex argument that might cause issues." },
    description: 'Process the complex argument and return a result.',
    outputSchema: {
      type: "object",
      properties: {
        processedResult: { type: "string" }
      },
      required: ["processedResult"]
    },
    maxRetries: 3,
    timeout: 10000 // 10 seconds
  };

  try {
    const result = await aiFunction(options);
    console.log("Processed Result:", result.processedResult);
  } catch (error) {
    if (error.code === 'ETIMEDOUT') {
      console.error("The request timed out after 10 seconds.");
    } else if (error.code === 'MAX_RETRIES_REACHED') {
      console.error("Max retries reached. The operation failed consistently.");
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
}

robustFunctionCall();

// This example demonstrates robust error handling and the use of retries.
// It sets a maximum number of retries and a timeout for the API call.
// This approach helps in handling transient errors and ensures
// that your application degrades gracefully in case of persistent issues.
// The error handling distinguishes between different types of errors,
// allowing for more specific error messages and potential recovery strategies.
