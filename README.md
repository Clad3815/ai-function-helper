# AI Function Helper

![npm version](https://img.shields.io/npm/v/ai-function-helper.svg)
![npm downloads](https://img.shields.io/npm/dm/ai-function-helper.svg)
![License](https://img.shields.io/npm/l/ai-function-helper.svg)
![Node.js Version](https://img.shields.io/node/v/ai-function-helper.svg)

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Basic Usage](#basic-usage)
- [API Reference](#api-reference)
- [Advanced Features](#advanced-features)
- [Examples](#examples)
- [Best Practices](#best-practices)
- [FAQ](#faq)
- [Contributing](#contributing)
- [Tests](#tests)
- [License](#license)

## Introduction

AI Function Helper is a powerful Node.js module that simplifies the integration of OpenAI's GPT models into your applications. It provides a structured way to interact with AI models, ensuring consistent and formatted responses.

### Key Features

- Easy integration with OpenAI API
- Structured input and output using JSON schemas
- Support for various AI models (GPT-3.5, GPT-4, etc.)
- Function-like interface for AI interactions
- Built-in error handling and retries
- Support for streaming responses
- Protection against prompt hijacking
- Customizable with tools and prompt variables

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
  model: 'gpt-3.5-turbo',
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

To use AI Function Helper, you first need to create an instance with your OpenAI API key:

```javascript
const { createAiFunctionInstance } = require('ai-function-helper');
const aiFunction = createAiFunctionInstance('your_api_key_here');
```

You can also use a custom endpoint URL:

```javascript
const aiFunction = createAiFunctionInstance('your_api_key_here', 'https://api.openai.com/v1');
```

Alternatively, you can use an existing OpenAI instance:

```javascript
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: 'your_api_key_here' });
const aiFunction = createAiFunctionInstance(openai);
```

Once you have an instance, you can call AI functions by providing options:

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

## API Reference

The `aiFunction` takes an options object with the following properties:

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `functionName` | string | Name of the AI function | `'custom_function'` |
| `args` | object/string | Arguments for the function | - |
| `description` | string | Description of the function's purpose | - |
| `outputSchema` | object | Expected return type (JSON Schema or Zod schema) | - |
| `strictReturn` | boolean | Enforce strict return type validation | `true` |
| `showDebug` | boolean | Print debug information to console | `false` |
| `debugLevel` | number | Level of debug information (0-2) | `0` |
| `temperature` | number | Sampling temperature for the AI model | `0.6` |
| `frequency_penalty` | number | Frequency penalty for the AI model | `0` |
| `presence_penalty` | number | Presence penalty for the AI model | `0` |
| `model` | string | AI model to use | `'gpt-3.5-turbo'` |
| `largeModel` | string | Model to use if context length is exceeded | `'gpt-4-o'` |
| `max_tokens` | number | Maximum number of tokens to generate | `1000` |
| `top_p` | number | Top p value for the AI model | `null` |
| `blockHijack` | boolean | Prevent prompt hijacking | `false` |
| `blockHijackThrowError` | boolean | Throw error on hijack attempt | `false` |
| `tools` | array | Helper functions to use within the main function | `[]` |
| `stream` | boolean | Enable response streaming | `false` |
| `streamCallback` | function | Callback for streamed responses | `null` |
| `promptVars` | object | Variables to use in the prompt | `{}` |
| `imagePrompt` | string/array | Image URL(s) for vision models | `null` |
| `imageQuality` | string | Quality of image for vision models | `'low'` |
| `minifyJSON` | boolean | Minify JSON output | `false` |
| `history` | array | Conversation history for context | `[]` |
| `forceJsonMode` | boolean | Force JSON mode for non-JSON models | `false` |
| `timeout` | number | Timeout for API calls (in milliseconds) | `120000` |
| `maxRetries` | number | Maximum number of retries for API calls | `0` |

### Key Concepts

- **outputSchema**: Defines the expected structure of the AI function's output using JSON Schema or Zod schema. This ensures that the AI model returns data in the format your application expects.

- **tools**: An array of helper functions that can be used within the main AI function. Each tool is an object with `name`, `function_call`, `description`, and `parameters` properties.

- **blockHijack**: When enabled, this feature prevents the AI model from following instructions in user messages that attempt to override the function's intended behavior.

- **promptVars**: Allows you to define variables that will be replaced in the function description, providing more flexibility in prompt engineering.

- **imagePrompt**: Enables the use of image inputs for vision-capable models, expanding the types of tasks the AI can perform.

## Advanced Features

### Streaming

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

### Using Stream with StreamCallback

The streaming feature allows you to process AI responses in real-time, which can be particularly useful for long-running tasks or when you want to provide immediate feedback to users. Here's an example of how to use the `stream` option with a `streamCallback`:

```javascript
const { createAiFunctionInstance } = require('ai-function-helper');
const aiFunction = createAiFunctionInstance('your_api_key_here');

async function generateStory() {
  let story = '';

  const options = {
    functionName: 'generate_story',
    model: 'gpt-4o',
    args: {
      theme: 'space exploration',
      length: 'short'
    },
    description: 'Generate a short story about space exploration.',
    // We don't use 'outputSchema' to return a text instead of a JSON
    stream: true,
    streamCallback: (chunk) => {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        story += content;
        console.log('Received chunk:', content);
        // You can update your UI here with the new content
      }
    }
  };

  try {
    const result = await aiFunction(options);
    // The result here will be the complete response
    console.log('Final story:', story);
    return story;
  } catch (error) {
    console.error('Error generating story:', error);
  }
}

generateStory();
```

In this example:

1. We set `stream: true` in the options to enable streaming.
2. We provide a `streamCallback` function that receives chunks of the response as they arrive.
3. The callback function accumulates the story content and logs each chunk (you could update a UI element here instead).
4. After the streaming is complete, we log the final story.

This approach allows you to handle the AI's response in real-time, which can be beneficial for:

- Providing immediate feedback to users
- Handling long-running tasks without timeouts
- Implementing typewriter-like effects in user interfaces
- Processing partial results as they become available

Remember that when using streaming, the final result returned by `aiFunction` will be the complete response, so you can still use it if needed.

### Tools (Helper Functions)

Define helper functions to use within your main AI function:

```javascript
const options = {
  // ... other options ...
  tools: [
    {
      name: "generate_password",
      function_call: ({ length = 5, passwordCount = 1 }) => {
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

Enable protection against prompt hijacking:

```javascript
const options = {
  // ... other options ...
  blockHijack: true,
  blockHijackThrowError: true // Optional: throw error instead of returning a message
};
```

### Using Image Inputs

For vision-capable models, you can include image inputs:

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

## Examples

Here are some engaging examples that showcase the versatility and power of the `aiFunction` module:

### 1. Generate a Quiz

```javascript
const options = {
  functionName: 'generate_quiz',
  model: 'gpt-4o',
  args: { topic: 'space exploration', difficulty: 'medium', num_questions: 2 },
  description: 'Generate a quiz with multiple-choice questions on the given topic.',
  outputSchema: {
    type: "array",
    items: {
      type: "object",
      properties: {
        question: { type: "string" },
        options: { 
          type: "array",
          items: { type: "string" },
          minItems: 4,
          maxItems: 4
        },
        correct_answer: { type: "string" }
      },
      required: ["question", "options", "correct_answer"]
    }
  }
};

const quiz = await aiFunction(options);
console.log(JSON.stringify(quiz, null, 2));
```

Expected output:
```json
[
  {
    "question": "Which space agency launched the first artificial satellite, Sputnik 1?",
    "options": [
      "NASA",
      "Soviet Union",
      "European Space Agency",
      "China National Space Administration"
    ],
    "correct_answer": "Soviet Union"
  },
  {
    "question": "What year did the Apollo 11 mission successfully land humans on the Moon?",
    "options": [
      "1967",
      "1969",
      "1971",
      "1973"
    ],
    "correct_answer": "1969"
  }
]
```

### 2. Create a Recipe (using Zod)

```javascript
const { z } = require('zod');

const options = {
  functionName: 'create_recipe',
  model: 'gpt-4o',
  args: { cuisine: 'Italian', main_ingredient: 'pasta', dietary_restriction: 'vegetarian' },
  description: 'Create a recipe based on the given cuisine, main ingredient, and dietary restriction.',
  outputSchema: z.object({
    name: z.string(),
    ingredients: z.array(z.string()),
    instructions: z.array(z.string()),
    prep_time: z.string(),
    cook_time: z.string(),
    servings: z.number().int()
  })
};

const recipe = await aiFunction(options);
console.log(JSON.stringify(recipe, null, 2));
```

Expected output:
```json
{
  "name": "Vegetarian Pasta Primavera",
  "ingredients": [
    "12 oz penne pasta",
    "2 cups mixed vegetables (bell peppers, zucchini, carrots)",
    "1/4 cup olive oil",
    "3 cloves garlic, minced",
    "1/2 cup grated Parmesan cheese",
    "1/4 cup fresh basil, chopped",
    "Salt and pepper to taste"
  ],
  "instructions": [
    "Cook pasta according to package instructions. Reserve 1/2 cup pasta water.",
    "In a large skillet, heat olive oil over medium heat. Add minced garlic and sauté for 1 minute.",
    "Add mixed vegetables to the skillet and cook for 5-7 minutes until tender-crisp.",
    "Drain pasta and add it to the skillet with vegetables. Toss to combine.",
    "Add Parmesan cheese, basil, and pasta water as needed to create a light sauce.",
    "Season with salt and pepper to taste. Serve hot."
  ],
  "prep_time": "15 minutes",
  "cook_time": "20 minutes",
  "servings": 4
}
```

### 3. Analyze Sentiment of Customer Reviews

```javascript
const options = {
  functionName: 'analyze_reviews',
  model: 'gpt-4o',
  args: {
    reviews: [
      "The product exceeded my expectations. Great value for money!",
      "Disappointed with the quality. Wouldn't recommend.",
      "Average product, nothing special but does the job."
    ]
  },
  description: 'Analyze the sentiment of customer reviews and categorize them.',
  outputSchema: {
    type: "array",
    items: {
      type: "object",
      properties: {
        review: { type: "string" },
        sentiment: { type: "string", enum: ["positive", "neutral", "negative"] },
        score: { type: "number", minimum: 0, maximum: 1 }
      },
      required: ["review", "sentiment", "score"]
    }
  }
};

const sentiment_analysis = await aiFunction(options);
console.log(JSON.stringify(sentiment_analysis, null, 2));
```

Expected output:
```json
[
  {
    "review": "The product exceeded my expectations. Great value for money!",
    "sentiment": "positive",
    "score": 0.9
  },
  {
    "review": "Disappointed with the quality. Wouldn't recommend.",
    "sentiment": "negative",
    "score": 0.2
  },
  {
    "review": "Average product, nothing special but does the job.",
    "sentiment": "neutral",
    "score": 0.5
  }
]
```

### 4. Generate a Travel Itinerary (using Zod)

```javascript
const { z } = require('zod');

const options = {
  functionName: 'create_travel_itinerary',
  model: 'gpt-4o',
  args: { destination: 'Tokyo', duration: 3, interests: ['technology', 'culture', 'food'] },
  description: 'Create a daily travel itinerary for the specified destination and duration, considering the traveler\'s interests.',
  outputSchema: z.object({
    destination: z.string(),
    duration: z.number().int(),
    daily_plans: z.array(z.object({
      day: z.number().int(),
      activities: z.array(z.object({
        time: z.string(),
        activity: z.string(),
        description: z.string()
      }))
    }))
  })
};

const itinerary = await aiFunction(options);
console.log(JSON.stringify(itinerary, null, 2));
```

Expected output:
```json
{
  "destination": "Tokyo",
  "duration": 3,
  "daily_plans": [
    {
      "day": 1,
      "activities": [
        {
          "time": "09:00",
          "activity": "Visit Akihabara",
          "description": "Explore the technology and electronics district, known for its gadgets and anime culture."
        },
        {
          "time": "13:00",
          "activity": "Lunch at a Robot Restaurant",
          "description": "Experience a unique dining experience with robot performances."
        },
        {
          "time": "15:00",
          "activity": "Tour the Miraikan Science Museum",
          "description": "Discover cutting-edge technology and scientific innovations at this interactive museum."
        }
      ]
    },
    {
      "day": 2,
      "activities": [
        {
          "time": "10:00",
          "activity": "Visit Senso-ji Temple",
          "description": "Explore Tokyo's oldest Buddhist temple and experience traditional Japanese culture."
        },
        {
          "time": "14:00",
          "activity": "Tea Ceremony in Hamarikyu Gardens",
          "description": "Participate in a traditional Japanese tea ceremony in a beautiful garden setting."
        },
        {
          "time": "18:00",
          "activity": "Dinner at Tsukiji Outer Market",
          "description": "Enjoy fresh sushi and local delicacies at the world-famous fish market area."
        }
      ]
    },
    {
      "day": 3,
      "activities": [
        {
          "time": "09:00",
          "activity": "Visit teamLab Borderless",
          "description": "Immerse yourself in a digital art museum that blends technology and creativity."
        },
        {
          "time": "13:00",
          "activity": "Ramen Tour in Shinjuku",
          "description": "Sample various styles of ramen at some of Tokyo's best ramen shops."
        },
        {
          "time": "16:00",
          "activity": "Shopping in Ginza",
          "description": "Explore high-end technology stores and experience Japanese retail innovation."
        }
      ]
    }
  ]
}
```

### 5. Analyze Stock Market Data

```javascript
const options = {
  functionName: 'analyze_stock',
  model: 'gpt-4o',
  args: { symbol: 'AAPL', timeframe: '1 year' },
  description: 'Analyze the stock performance and provide insights based on the given symbol and timeframe.',
  outputSchema: {
    type: "object",
    properties: {
      symbol: { type: "string" },
      currentPrice: { type: "number" },
      yearlyPerformance: { type: "number" },
      technicalIndicators: {
        type: "object",
        properties: {
          RSI: { type: "number" },
          MACD: {
            type: "object",
            properties: {
              value: { type: "number" },
              signal: { type: "number" },
              histogram: { type: "number" }
            },
            required: ["value", "signal", "histogram"]
          }
        },
        required: ["RSI", "MACD"]
      },
      recommendation: { type: "string", enum: ["Buy", "Hold", "Sell"] }
    },
    required: ["symbol", "currentPrice", "yearlyPerformance", "technicalIndicators", "recommendation"]
  }
};

const stockAnalysis = await aiFunction(options);
console.log(JSON.stringify(stockAnalysis, null, 2));
```

Expected output:
```json
{
  "symbol": "AAPL",
  "currentPrice": 178.25,
  "yearlyPerformance": 0.35,
  "technicalIndicators": {
    "RSI": 62.5,
    "MACD": {
      "value": 2.1,
      "signal": 1.8,
      "histogram": 0.3
    }
  },
  "recommendation": "Buy"
}
```

These examples demonstrate how to use the AI Function Helper for various tasks, from content generation to data analysis. Each example includes a detailed `outputSchema` schema (alternating between JSON Schema and Zod formats), ensuring structured and validated output from the AI model.


## Best Practices

1. **Use Specific Function Names**: Choose clear and descriptive function names to help the AI understand the context.

2. **Provide Detailed Descriptions**: The more context you provide in the description, the better the AI can understand and perform the task.

3. **Define Precise Return Schemas**: Use detailed `outputSchema` schemas to ensure you get the exact data structure you need.

4. **Utilize Tools for Complex Tasks**: For tasks that require specific calculations or external data, define custom tools to handle these aspects.

5. **Handle Errors Gracefully**: Use try-catch blocks and consider setting appropriate timeout and retry values for robust error handling.

6. **Optimize for Token Usage**: Be mindful of the length of your prompts and consider using `minifyJSON` for large outputs to reduce token consumption.

7. **Use Streaming for Long Responses**: For tasks that may generate long responses, consider using the streaming option to process the response in real-time.

8. **Leverage Conversation History**: For multi-turn interactions, use the `history` option to provide context from previous exchanges.

## FAQ

**Q: Can I use this module with other AI providers?**
A: Currently, AI Function Helper is designed to work with OpenAI's models. Support for other providers may be added in future versions.

**Q: How can I debug if I'm not getting the expected output?**
A: Enable debugging by setting `showDebug: true` and adjusting the `debugLevel`. This will provide more information about the API calls and responses.

**Q: Is this module suitable for production use?**
A: Yes, but always ensure you have proper error handling and respect rate limits set by OpenAI.

**Q: Can I use this for streaming large amounts of data?**
A: Yes, you can use the `stream` option for handling large responses efficiently.

**Q: How does the module handle API keys securely?**
A: The module does not handle API key storage or security. It's your responsibility to securely manage and provide the API key when creating an instance.

## Tests

We have conducted extensive tests on various AI models to evaluate their ability to generate JSON outputs of varying complexity while adhering to specified formats. These tests help demonstrate the versatility and reliability of the AI Function Helper module across different AI models.

### Test Methodology

To ensure comprehensive testing across a wide range of AI models, including those not directly provided by OpenAI, we utilized [LiteLLM](https://github.com/BerriAI/litellm) as a proxy. LiteLLM is a powerful tool that provides a unified interface for various AI providers and local models (via Ollama), offering an OpenAI-compatible endpoint URL. This approach allowed us to seamlessly integrate and test multiple AI models with our AI Function Helper, demonstrating its flexibility and broad compatibility.

### Test Summary

| Model | Success Rate | Average Duration |
|-------|--------------|------------------|
| fireworks/llama-v3p1-405b-instruct | 100.00% | 16887.67ms |
| groq/llama-3.1-70b-versatile | 100.00% | 2154.89ms |
| claude-3-haiku-20240307 | 100.00% | 3175.72ms |
| gpt-3.5-turbo | 88.89% | 3398.67ms |
| gpt-4o-mini | 100.00% | 5699.72ms |
| gpt-4o | 100.00% | 5673.00ms |
| claude-3-5-sonnet-20240620 | 100.00% | 5940.50ms |
| gemini-1.5-flash | 88.89% | 5150.00ms |
| gemini-1.5-pro | 100.00% | 10066.06ms |
| gemma2:9b (ollama) | 100.00% | 13368.94ms |

### Test Categories

The tests cover a wide range of functionalities, from simple calculations to complex data generation and analysis. Some of the test categories include:

1. Basic operations (e.g., complex calculations, prime number generation)
2. Text processing (e.g., grammar correction, language detection)
3. Data generation (e.g., fake people generation, quiz creation)
4. Complex data analysis (e.g., stock market analysis, social media campaign analysis)
5. Creative tasks (e.g., recipe creation, short story generation)
6. Complex JSON generation (e.g., nested structures, arrays of objects)

### Detailed Results

For detailed results of each test case and model performance, please refer to the following files:

- [API Responses](https://github.com/Clad3815/ai-function-helper/blob/master/tests/api_responses.md)
- [Test Results](https://github.com/Clad3815/ai-function-helper/blob/master/tests/test_results.md)

### Running the Tests

If you want to run the tests yourself or contribute to improving them, you can find the test script in our GitHub repository:

- [Test Script](https://github.com/Clad3815/ai-function-helper/blob/master/tests/test_ai_function.js)

These tests demonstrate the AI Function Helper's capability to work with various AI models and handle a wide range of task complexities. They also showcase the module's ability to enforce structured outputs, making it easier to integrate AI-generated content into your applications.

Some tests are "stupidly" complex and are designed to push the limits of the AI models. These tests are not meant to be practical but rather to demonstrate the AI Function Helper's ability to handle challenging scenarios. Most of the failed tests can be successfully completed by giving the AI model more context or refining the input prompts.

By leveraging LiteLLM, we've expanded the compatibility of our AI Function Helper beyond OpenAI models, allowing users to work with a diverse array of AI providers and local models while maintaining a consistent interface. This approach not only broadens the applicability of our tool but also provides users with greater flexibility in choosing the AI models that best suit their specific needs and constraints.

## Contributing

Contributions are welcome! If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

## License

AI Function Helper is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).