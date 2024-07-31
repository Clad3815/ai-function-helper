// 6_conversation_history.js
const { createAiFunctionInstance } = require('ai-function-helper');

const aiFunction = createAiFunctionInstance('your_api_key_here');

async function haveConversation() {
  const conversationHistory = [];

  async function chat(userMessage) {
    const options = {
      functionName: 'chat_response',
      model: 'gpt-4o-mini',
      args: { userMessage },
      description: 'Respond to the user message in the context of the ongoing conversation.',
      outputSchema: {
        type: "object",
        properties: {
          response: { type: "string" }
        },
        required: ["response"]
      },
      history: conversationHistory
    };

    const result = await aiFunction(options);
    conversationHistory.push({ role: "user", content: userMessage });
    conversationHistory.push({ role: "assistant", content: result.response });
    return result.response;
  }

  try {
    console.log("AI: Hello! How can I assist you today?");
    
    let response = await chat("Can you tell me about the benefits of exercise?");
    console.log("Human: Can you tell me about the benefits of exercise?");
    console.log("AI:", response);

    response = await chat("What's a good exercise for beginners?");
    console.log("Human: What's a good exercise for beginners?");
    console.log("AI:", response);
    

    response = await chat("How often should I do this exercise?");
    console.log("Human: How often should I do this exercise?");
    console.log("AI:", response);

  } catch (error) {
    console.error("Error in conversation:", error);
  }
}

haveConversation();

// This example shows how to use conversation history to maintain context
// across multiple interactions. The AI's responses take into account
// the previous messages, allowing for more coherent and context-aware
// conversations. This is crucial for building chatbots or any
// multi-turn interaction systems.
