# AI Function Module

This module provides a convenient way to utilize the power of OpenAI's GPT-4 to perform various tasks using custom Python functions. It comes with a series of examples and tests, demonstrating different use cases.

## Functions

### aiFunction(options)

The main function that takes a set of options as an input and returns the output from the AI model.

- options: An object containing the following keys:
  - functionName: The name of the custom Python function to use.
  - args: The arguments to be passed to the custom function.
  - description: A description of the function's purpose.
  - showDebug (optional): If set to true, debug information will be printed to the console. Default is false.
  - funcArgs (optional): The function arguments formatted as a string. If not provided, the module will attempt to convert the arguments automatically.
  - funcReturn: The expected return type of the custom function.
  - temperature (optional): The sampling temperature for the AI model. Default is 0.8.
  - model (optional): The AI model to use. Default is 'gpt-3.5-turbo'.
  - convertToJson (optional): If set to true, the AI response will be converted to a JSON object. Default is false.

## Examples

The `exampleUsage.js` file contains example usage of the `aiFunction` for various tasks:

- Generate a quiz
- Suggest gift ideas based on hobbies and interests
- Analyze and moderate a list of messages

## Tests

The `test_ai_function.js` file contains a series of tests for the `aiFunction`. These tests cover various use cases and can be run using the `runTests` function with the desired AI model as an argument. The tests include:

- Generate fake people
- Generate random password
- Calculate area of a triangle
- Calculate the nth prime number
- Encrypt text
- Find missing numbers in a list


## Dependencies
This library requires the following dependencies:

- `chalk`: For console output formatting.
- `openai`: For using the OpenAI API.
Make sure to install these dependencies before using the library.

## Contributing
To contribute to this library, feel free to fork the repository, make changes, and submit a pull request. If you encounter any issues or have suggestions for improvements, please create an issue on the repository.