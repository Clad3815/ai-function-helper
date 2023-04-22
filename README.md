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

The `test_ai_function.js` file contains a series of tests for the `aiFunction`. These tests cover various use cases and can be run using the `runTests` function with the desired AI model as an argument.

### Test Results

A total of 60 tests were performed using the GPT-3.5-turbo model. The table below shows the success rate for each function:

| Function                    | GPT-3.5-turbo | GPT-4 |
|-----------------------------|---------------|-------|
| Generate fake people        | 100.00%       | N/A   |
| Generate Random Password    | 40.00%        | N/A   |
| Calculate area of triangle  | 50.00%        | N/A   |
| Calculate the nth prime number | 100.00%    | N/A   |
| Encrypt text                | 100.00%       | N/A   |
| Find missing numbers        | 100.00%       | N/A   |

I currently do not have access to the GPT-4 API. Once I have access, I will update the table with the test results.

### Disclaimer

It's important to note that AI functions are not well-suited for certain tasks, particularly those involving mathematical calculations and precision. As observed in the case of calculating the area of a triangle and generating random passwords, GPT models can struggle with providing accurate results. The limitations of GPT models in such cases are mainly due to their inherent inability to perform precise arithmetic and the ambiguity in understanding user inputs. Although the models may work sometimes, the accuracy is too low because it depends on calculations, and GPT models are better suited for text completion tasks.

In conclusion, while AI functions can be helpful in various scenarios, they may not be the optimal choice for tasks requiring mathematical accuracy or specific domain knowledge. For such use-cases, utilizing traditional algorithms and libraries would yield better results.
