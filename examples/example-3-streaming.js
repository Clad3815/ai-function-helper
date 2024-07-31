// 3_streaming_responses.js
const { createAiFunctionInstance } = require('ai-function-helper');

const aiFunction = createAiFunctionInstance('your_api_key_here');

async function streamStory() {
  const options = {
    functionName: 'generate_story',
    model: 'gpt-4o-mini',
    args: { genre: 'science fiction', length: 'short' },
    description: 'Generate a short science fiction story.',
    outputSchema: {
      type: "object",
      properties: {
        story: { type: "string" }
      },
      required: ["story"]
    },
    stream: true,
    streamCallback: (chunk) => {
      // Print each chunk as it arrives
      process.stdout.write(chunk.choices[0]?.delta?.content || '');
    }
  };

  try {
    await aiFunction(options);
    console.log("\n\nStory generation complete!");
  } catch (error) {
    console.error("Error generating story:", error);
  }
}

streamStory();

// This example demonstrates how to use streaming responses.
// It generates a short science fiction story and prints each chunk
// of the story as it's received, providing a real-time output experience.
// This is useful for long-form content generation or when you want to
// provide immediate feedback to the user.
