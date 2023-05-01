# AI Function Module

Welcome to the AI Function Module, a powerful tool for integrating the capabilities of OpenAI's GPT-4 and GPT-3.5-turbo directly into your Python functions! With this module, you can simplify the process of getting precisely formatted responses from the OpenAI API, saving time and reducing complexity in your application development. This project is heavily inspired by Ask Marvin and [AI Functions from Torantulino](https://github.com/Torantulino/AI-Functions).

## Table of Contents

- [Why using this script instead of the normal OpenAI API?](#why-using-this-script-instead-of-the-normal-openai-api)
- [Installation](#installation)
- [Usage](#usage)
- [aiFunction(options)](#aifunctionoptions)
  - [funcReturn](#funcreturn)
  - [Using Dictionaries (dict) in funcReturn](#using-dictionaries-dict-in-funcreturn)
- [Examples](#examples)
- [Example Usage](#example-usage)
- [Tests](#tests)
  - [Test Results](#test-results)
- [Disclaimer](#disclaimer)


## Why using this script instead of the normal OpenAI API?

While the OpenAI API is powerful and versatile, it can sometimes be challenging to get the desired response format, especially when integrating the output directly into other functions within your application. Crafting the perfect prompt might require multiple iterations, and even then, the returned response may need additional processing.

The `aiFunction` script is designed to simplify this process and provide a more streamlined experience for developers. By using this script, you can:

1. **Get precise response formats**: `aiFunction` allows you to specify the exact format of the response, such as lists, dictionaries, or strings, which can be used directly by other functions within your application without the need for additional processing.

2. **Avoid complex prompt crafting**: With `aiFunction`, you don't need to spend time crafting complex prompts or over-explaining the desired output to the API. The script takes care of constructing the prompt based on the provided function name, arguments, and description.

3. **Simplify integration**: By leveraging `aiFunction`, you can seamlessly integrate AI-generated content into your application, reducing the amount of code needed to parse and process the API's response.

In summary, the `aiFunction` script offers a more efficient and convenient way of interacting with the OpenAI API, enabling you to focus on integrating AI-generated content into your application without worrying about prompt crafting and response formatting.


## Installation

To install the `aiFunction` module, simply run the following command:

```bash
npm install ai-function-helper
```

## Usage

First, create an instance of the `aiFunction` with your OpenAI API key:

```javascript
const { createAiFunctionInstance } = require('ai-function-helper');
const aiFunction = createAiFunctionInstance('your_api_key_here');
```

Now you can use the `aiFunction` without passing the API key every time.

You can also retreive the OpenAI instance (Useful to use the OpenAI API directly without setting up the API Key again in your script):

```javascript
const { createAiFunctionInstance, getOpenAI } = require('ai-function-helper');
const aiFunction = createAiFunctionInstance('your_api_key_here');
const openai = getOpenAI();

// Use the OpenAI API directly
const embedText = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: "Text to embed"
});

const moderateText = await openai.createModeration({
    input: "Text to moderate",
});

const chat = openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: gptMessages,
    temperature: 0.7,
    top_p: 0.9,
    presence_penalty: 0.6,
    frequency_penalty: 0.6,
});


```



## aiFunction(options)

The main function that takes a set of options as an input and returns the output from the AI model.

- options: An object containing the following keys:
  - `args`: The arguments to be passed to the custom function. Can be a string, number, list, dictionary, or a combination of these, the function will auto manage them.
  - `description`: A description of the function's purpose.
  - `funcReturn`: The expected return type of the custom function.
  - `functionName`: (optional): The name of the custom Python function to use. It's help to give context to the AI model. Default is `custom_function`.
  - `showDebug` (optional): If set to true, debug information will be printed to the console. Default is `false`.
  - `funcArgs` (optional): The function arguments formatted as a string based on `args`. If not provided, the module will attempt to convert the arguments automatically. Example: `s:str, n:int, l:list, d:dict`
  - `temperature` (optional): The sampling temperature for the AI model. Default is `0.8`
  - `frequency_penalty` (optional): The frequency penalty for the AI model. Default is `0`
  - `presence_penalty` (optional): The presence penalty for the AI model. Default is `0`
  - `model` (optional): The AI model to use. Default is `gpt-3.5-turbo`.
  - `autoConvertReturn` (optional): If set to true, the AI response will be converted to a Javascript Object or String instead of brut result. Default is `true`.
  - `max_tokens` (optional): The maximum number of tokens to generate.
  - `top_p` (optional): The top p value for the AI model.


### funcReturn

The `funcReturn` option is used to define the expected return type of the custom function. It is expressed in a Python-like format, and it can be used to specify complex data structures like lists and dictionaries.

For instance:

```javascript
funcReturn: "list[question:str, answers:list[str], correct_answer:str]"
```

This `funcReturn` specification translates into the following output format:

```javascript
[
  {
    "question": "sample question",
    "answers": ["answer 1", "answer 2", "answer 3"],
    "correct_answer": "correct answer"
  },
  // Additional entries...
]
```

In this case, the output is a list of dictionaries, where each dictionary represents a question and its associated answers. Each dictionary contains:

- `question`: a string representing the question.
- `answers`: a list of strings where each string represents a potential answer to the question.
- `correct_answer`: a string representing the correct answer to the question.


### Using Dictionaries (dict) in funcReturn

The `dict` keyword can also be used in `funcReturn` to specify that the function should return a dictionary. A dictionary is a collection of key-value pairs, where each key must be unique.

Here is an example:


```javascript
funcReturn: "dict[name:str, age:int, skills:list[str]]"
```

This `funcReturn` specification translates into the following output format:


```javascript
{
  "name": "sample name",
  "age": 25,
  "skills": ["skill1", "skill2", "skill3"]
}
```

In this case, the output is a dictionary with:

- `name`: a string representing the person's name.
- `age`: an integer representing the person's age.
- `skills`: a list of strings where each string represents a skill that the person has.


The `funcReturn` option is a powerful tool that allows you to customize the structure of the output you get from the `aiFunction`. By using Python-like syntax, you can define complex data structures to fit your specific needs.

You can also build complex output very easily by combining lists and dictionaries.

```javascript
funcReturn: "list[dict[category:str, items:list[dict[name:str, attributes:dict[color:str, size:int, tags:list[str]]]]]]"
```

This `funcReturn` specification translates into the following output format:

```javascript
[
  {
    "category": "Electronics",
    "items": [
      {
        "name": "Smartphone",
        "attributes": {
          "color": "Black",
          "size": 6,
          "tags": ["mobile", "gadget", "touchscreen"]
        }
      },
      {
        "name": "Laptop",
        "attributes": {
          "color": "Silver",
          "size": 15,
          "tags": ["computer", "portable", "keyboard"]
        }
      }
    ]
  },
  {
    "category": "Furniture",
    "items": [
      {
        "name": "Sofa",
        "attributes": {
          "color": "Blue",
          "size": 3,
          "tags": ["seating", "couch", "living room"]
        }
      },
      {
        "name": "Dining Table",
        "attributes": {
          "color": "Brown",
          "size": 4,
          "tags": ["eating", "furniture", "kitchen"]
        }
      }
    ]
  },
  // Additional entries...
]

```

In this example, the output is a list of dictionaries, where each dictionary represents a category and contains:

- `category`: a string representing the category name.
- `items`: a list of dictionaries where each dictionary represents an item in the category and contains:
  - `name`: a string representing the item's name.
  - `attributes`: a dictionary containing the item's attributes, such as:
    - `color`: a string representing the item's color.
    - `size`: an integer representing the item's size.
    - `tags`: a list of strings where each string represents a tag associated with the item.


This complex example demonstrates how you can use `funcReturn` to define deeply nested structures that can accommodate a wide variety of data types and relationships.




## Examples

The `exampleUsage.js` file contains example usage of the `aiFunction` for various tasks

## Example Usage

Here are some examples of how to use the `aiFunction`:

All examples was made using the `gpt-3.5-turbo` model, the `gpt-4` must return better results.

### 1. Generate a quiz

```javascript
const options = {
  functionName: 'generate_quiz',
  args: { topic: 'history', difficulty: 'medium', num_questions: 3 },
  description: 'Generate N quiz  questions with the topic and the difficulty given. Return a list of questions and 4 possible answers + the correct answer.',
  funcReturn: 'list[question:str, answers:list[str], correct_answer:str]',
  model: 'gpt-4',
};

const quiz = await aiFunction(options);
console.log(quiz);
/*
Output:
[
  {
    question: 'What event triggered the start of World War I?',
    answers: [
      'Assassination of Archduke Franz Ferdinand',
      'Invasion of Poland',
      'Bombing of Pearl Harbor',
      'Fall of the Berlin Wall'
    ],
    correct_answer: 'Assassination of Archduke Franz Ferdinand'
  },
  {
    question: 'Who was the first president of the United States?',
    answers: [
      'George Washington',
      'Thomas Jefferson',
      'John Adams',
      'Benjamin Franklin'
    ],
    correct_answer: 'George Washington'
  },
  {
    question: 'What year did the United States declare independence?',
    answers: [ '1776', '1783', '1791', '1800' ],
    correct_answer: '1776'
  }
]
*/
```

### 2. Suggest gift ideas based on hobbies and interests

```javascript
const options = {
  functionName: 'suggest_gifts',
  args: { hobbies: 'photography, cooking', interests: 'travel, fashion' },
  description: 'Suggest gift ideas for someone who loves the given hobbies and interests.',
  funcReturn: 'list[str]',
};

const giftIdeas = await aiFunction(options);
console.log(giftIdeas); // Output: [ 'camera', 'cookbook', 'travel guidebook', 'fashion magazine' ]
```

### 3. Analyze and moderate a list of messages

```javascript
const messages = [
  { id: 1, content: 'Hello, world!' },
  { id: 2, content: 'Offensive message here...' },
  { id: 3, content: 'Another friendly message.' },
];

const options = {
        functionName: 'moderate_messages',
        args: messages,
        description: 'Analyze and moderate a list of messages. Return a list of messages with the "content" field updated with bad words changed with "*" to indicate whether the message was flagged for moderation.',
        funcReturn: 'list[dict[id:int, content:str, flagged:bool]]]]',
    };

aiFunction(options).then(moderatedMessages => {
  console.log(moderatedMessages); /*
   Output:
    [
      { id: 1, content: 'Hello, world!', flagged: false },
      {
        id: 2,
        content: 'Offensive message here... I will **** you **',
        flagged: true
      },
      { id: 3, content: 'Another friendly message.', flagged: false }
    ]
   */
});
```

### 4. Translate a text

```javascript
let aiData = await aiFunction({
    args: {
        text: "Hello world !",
        to: "de",
    },
    functionName: "translate_text",
    description: "Translate text from one language to another. Use the to arguments to specify destination language. The text is from a game user interface. Return a string with the translated text",
    funcReturn: "str",
    showDebug: false,
    temperature: 0.7,
});
console.log(aiData); // Output: "Hallo Welt!"
```

### 5. Shorten a text

```javascript
let aiData = await aiFunction({
    args: {
        sentence: "I am a sentence that is too long and I need to be shorten. This is extra information that is not needed, and I want to remove it. Just keep the important information.",
    },
    functionName: "shorten_sentence",
    description: "Rewrite the sentence to a minimum of words without breaking the context or important data. If the sentence can't be shorten, it will return the same sentence.",
    funcReturn: "str",
    temperature: 1,
});
console.log(aiData); // Output: "I am a sentence that is too long and I need to be shortened. Just keep the important information."
```



## Tests

The `test_ai_function.js` file contains a series of tests for the `aiFunction`. These tests cover various use cases and can be run using the `runTests` function with the desired AI model as an argument.

### Test Results

A total of 60 tests for each function were performed using the GPT-3.5-turbo model. The table below shows the success rate for each function:

| Function                    | GPT-3.5-turbo | GPT-4 |
|-----------------------------|---------------|-------|
| Generate fake people        | 100%       | N/A   |
| Calculate the nth prime number | 100%    | N/A   |
| Find missing numbers        | 100%       | N/A   |
| Generate a quiz             | 100%       | N/A   |
| Find capital of cities      | 100%       | N/A   |
| Grammar correction          | 100%       | N/A   |
| Detect language in text     | 100%       | N/A   |
| Generate Random Password    | 60%-100%   | N/A   |
| Encrypt text                | 80-100%    | N/A   |
| Calculate area of triangle  | 0%-50%     | N/A   |

`Some results can be improved by optimising the prompt, temperature, and other parameters according to the function and the use case.`

I currently do not have access to the GPT-4 API. Once I have access, I will update the table with the test results.

### Disclaimer

It's important to note that AI functions are not well-suited for certain tasks, particularly those involving mathematical calculations and precision. As observed in the case of calculating the area of a triangle and generating random passwords, GPT models can struggle with providing accurate results. The limitations of GPT models in such cases are mainly due to their inherent inability to perform precise arithmetic and the ambiguity in understanding user inputs. Although the models may work sometimes, the accuracy is too low because it depends on calculations, and GPT models are better suited for text completion tasks.

In conclusion, while AI functions can be helpful in various scenarios, they may not be the optimal choice for tasks requiring mathematical accuracy or specific domain knowledge. For such use-cases, utilizing traditional algorithms and libraries would yield better results.

# Contributing

Contributions are welcome! If you would like to add more test cases or improve the existing code, please feel free to submit a pull request.