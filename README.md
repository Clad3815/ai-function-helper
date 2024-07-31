# AI Function Helper

![npm version](https://img.shields.io/npm/v/ai-function-helper.svg)
![npm downloads](https://img.shields.io/npm/dm/ai-function-helper.svg)
![License](https://img.shields.io/npm/l/ai-function-helper.svg)

AI Function Helper is a powerful Node.js module that simplifies the integration of OpenAI's GPT models into your applications. It provides a structured way to interact with AI models, ensuring consistent and formatted responses.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Basic Usage](#basic-usage)
- [Advanced Features](#advanced-features)
  - [Streaming Responses](#streaming-responses)
  - [Include Thinking Process](#include-thinking-process)
  - [Tools (Helper Functions)](#tools-helper-functions)
  - [Prompt Hijack Protection](#prompt-hijack-protection)
  - [Image Inputs](#image-inputs)
  - [Conversation History](#conversation-history)
- [API Reference](#api-reference)
- [Best Practices](#best-practices)
- [Performance Considerations](#performance-considerations)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Features

- 🚀 Easy integration with OpenAI API
- 📊 Structured input and output using JSON schemas
- 🔄 Support for various AI models (GPT-3.5, GPT-4, etc.)
- 🛠️ Function-like interface for AI interactions
- 🔒 Built-in error handling and retries
- 📡 Support for streaming responses
- 🛡️ Protection against prompt hijacking
- 🎛️ Customizable with tools and prompt variables
- 🧠 Optional "thinking" process for complex tasks
- 🖼️ Support for image inputs (vision models)
- 🔍 Detailed debugging options

## Installation

Install AI Function Helper using npm:

```bash
npm install ai-function-helper
```

## Quick Start

Here's a simple example to get you started:

```javascript
const { createAiFunctionInstance } = require('ai-function-helper');

// Create an instance with your OpenAI API key
const aiFunction = createAiFunctionInstance('your_api_key_here');

// Define your function
const options = {
  functionName: 'generate_haiku',
  model: 'gpt-4o-mini',
  args: { topic: 'spring' },
  description: 'Generate a haiku about the given topic.',
  outputSchema: {
    type: "object",
    properties: {
      haiku: { type: "string" }
    },
    required: ["haiku"]
  }
};

// Call the function
aiFunction(options)
  .then(result => console.log(result.haiku))
  .catch(error => console.error(error));
```

## Basic Usage

To use AI Function Helper, first create an instance with your OpenAI API key:

```javascript
const { createAiFunctionInstance } = require('ai-function-helper');
const aiFunction = createAiFunctionInstance('your_api_key_here');
```

You can also use a custom endpoint URL:

```javascript
const aiFunction = createAiFunctionInstance('your_api_key_here', 'https://api.openai.com/v1');
```

Or use an existing OpenAI instance:

```javascript
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: 'your_api_key_here' });
const aiFunction = createAiFunctionInstance(openai);
```

Once you have an instance, call AI functions by providing options:

```javascript
const result = await aiFunction({
  functionName: 'example_function',
  model: 'gpt-4o',
  args: { param1: 'value1', param2: 'value2' },
  description: 'This is an example function.',
  outputSchema: {
    type: "object",
    properties: {
      result: { type: "string" }
    },
    required: ["result"]
  }
});
```

## Advanced Features

### Streaming Responses

Enable streaming to process responses in real-time:

```javascript
const options = {
  // ... other options ...
  stream: true,
  streamCallback: (chunk) => {
    console.log('Received chunk:', chunk);
  }
};
```

### Include Thinking Process

Capture the AI's thought process for complex tasks:

```javascript
const options = {
  functionName: 'complex_calculation',
  args: { expression: '15*87 + ( 129/ (48*0.5) ) +12' },
  description: 'Perform a complex mathematical calculation and show the steps.',
  outputSchema: {
    type: "object",
    properties: {
      result: { type: "number" }
    },
    required: ["result"]
  },
  model: 'gpt-4o-mini',
  includeThinking: true,
  showDebug: true
};
```

This will show the AI's step-by-step reasoning in the debug output.

### Tools (Helper Functions)

Define helper functions for your AI to use:

```javascript
const options = {
  // ... other options ...
  tools: [
    {
      name: "generate_password",
      function_call: ({ length = 8, passwordCount = 1 }) => {
        // Password generation logic here
      },
      description: "Generate a random password",
      parameters: {
        type: "object",
        properties: {
          length: { type: "integer" },
          passwordCount: { type: "integer" }
        }
      }
    }
  ]
};
```

### Prompt Hijack Protection

Prevent unintended behavior changes:

```javascript
const options = {
  // ... other options ...
  blockHijack: true,
  blockHijackThrowError: true // Optional: throw error instead of returning a message
};
```

### Image Inputs

For vision-capable models, include image inputs:

```javascript
const options = {
  // ... other options ...
  imagePrompt: 'https://example.com/image.jpg',
  imageQuality: 'high'
};
```

### Conversation History

Provide context from previous interactions:

```javascript
const options = {
  // ... other options ...
  history: [
    { role: "user", content: "What's the weather like?" },
    { role: "assistant", content: "I'm sorry, but I don't have access to real-time weather information. Is there anything else I can help you with?" }
  ]
};
```

## API Reference

For a complete list of options and their descriptions, see the [API Reference](#api-reference) section in the full documentation.

## Best Practices

1. **Use Specific Function Names**: Choose clear and descriptive function names to help the AI understand the context.
2. **Provide Detailed Descriptions**: The more context you provide, the better the AI can understand and perform the task.
3. **Define Precise Return Schemas**: Use detailed `outputSchema` schemas to ensure you get the exact data structure you need.
4. **Utilize Tools for Complex Tasks**: For tasks that require specific calculations or external data, define custom tools.
5. **Handle Errors Gracefully**: Use try-catch blocks and consider setting appropriate timeout and retry values.
6. **Optimize for Token Usage**: Be mindful of your prompts' length and consider using `minifyJSON` for large outputs.
7. **Use Streaming for Long Responses**: For tasks that may generate long responses, use the streaming option.
8. **Leverage Conversation History**: For multi-turn interactions, use the `history` option to provide context.

## Performance Considerations

- Use the appropriate model for your task. `gpt-4o-mini` is faster and cheaper for simpler tasks.
- Implement caching for repetitive queries to reduce API calls and improve response times.
- Use `maxTokens` to limit response length and reduce processing time for large outputs.
- Consider batch processing for large numbers of similar requests.

## Security

- Never expose your API key in client-side code.
- Use `blockHijack` to prevent malicious prompt injections.
- Validate and sanitize user inputs before passing them to the AI function.
- Implement rate limiting to prevent abuse of your application.

## Troubleshooting

- Enable debugging with `showDebug: true` and adjust `debugLevel` for more information.
- Check the OpenAI status page for any ongoing issues with the API.
- Ensure your API key has the necessary permissions for the models you're using.
- For context length errors, try using a larger model or breaking your task into smaller chunks.
