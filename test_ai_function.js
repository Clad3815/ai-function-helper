const {
    createAiFunctionInstance
} = require('./src/aiFunction.js');
const path = require('path')
require('dotenv').config();
const aiFunction = createAiFunctionInstance(process.env.OPENAI_API_KEY);

const math = require('mathjs');

const showDebug = false;
const numTestToRun = 3;


// Initialize the OpenAI API client
// Make sure to set the OPENAI_API_KEY environment variable

// Run all tests, print the results, and return the number of failed tests
async function runTests(model) {
    // const testFunctions = [test2, test3];
    // const testFunctions = [test1, test2, test3, test4, test5, test6, test7, test8];
    const testFunctions = [test1, test2, test3, test10, test11, test12, test4, test5, test6, test7, test8, test9];
    const testNames = [
        'Generate fake people',
        'Generate Random Password',
        'Calculate area of triangle',
        'Calculate area of triangle (with mathjs help)',
        'Complex calculation',
        'Complex calculation (with mathjs help)',
        'Calculate the nth prime number',
        'Encrypt text',
        'Find missing numbers',
        'Find capital cities',
        'Grammar Correction',
        'Detect language in a text',
    ];
    const numberOfTests = numTestToRun;
    const successRates = [];

    for (let i = 0; i < testFunctions.length; i++) {
        const test = testFunctions[i];
        let successfulTests = 0;
        console.log(`=-=-=- Running test: ${test.name} - ${testNames[i]} with model ${model} -=-=-=`);

        for (let j = 0; j < numberOfTests; j++) {
            try {
                await test(model);
                successfulTests++;
            } catch (error) {
                // Ignore the error as we are counting successful tests
            }
        }

        const successRate = (successfulTests / numberOfTests) * 100;
        successRates.push(successRate);
        console.log(`${test.name}: ${successRate.toFixed(2)}% success rate`);
    }

    // Print the total number of tests
    console.log(`Total tests: ${testFunctions.length * numberOfTests}`);

    // Print the success rates for each test
    console.log("Success Rates:");
    for (let i = 0; i < testNames.length; i++) {
        console.log(`${testNames[i]}: ${successRates[i].toFixed(2)}%`);
    }
}


// Ai function test 1
async function test1(model) {
    const randomCount = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
    const result = await aiFunction({
        args: {
            count_people: randomCount
        },
        functionName: 'fake_people',
        description: 'Generates n examples of fake data representing people, each with a name and an age.',
        funcReturn: 'list[dict[name:str, age:int]]',
        temperature: 0.8,
        model: model,
        showDebug: showDebug,
        autoConvertReturn: true,
    });

    console.log(`Output: ${JSON.stringify(result)}`);

    // Assert the result is a list of dictionaries
    if (!Array.isArray(result)) {
        throw new Error('Result is not an array');
    }

    // Assert the length of the result is equal to the number of people requested
    if (result.length !== randomCount) {
        throw new Error('Result length is not equal to the number of people requested');
    }
}

// Ai function test 2
async function test2(model) {
    const randomLength = Math.floor(Math.random() * (20 - 10 + 1)) + 10;
    const specialChar = (Math.random() > 0.5) ? true : false;
    const result = await aiFunction({
        args: {
            length: randomLength,
            specialChar: specialChar
        },
        functionName: 'random_string_generator',
        description: 'Generates a strong random string of given length with or without special characters. Just put random characters in a string and it will generate the desired output. ',
        funcReturn: 'dict[string:str, length:int]]',
        temperature: 1,
        frequency_penalty: 0.9,
        presence_penalty: 0.9,
        model: model,
        showDebug: showDebug,
    });

    console.log(`Output: ${result.string} (${result.string.length}) (AI: ${result.length}) | Expected length: ${randomLength} | Special characters: ${specialChar}`);

    // Assert the length of the result is equal to the length requested
    if (result.string.length !== randomLength) {
        throw new Error('Result length is not equal to the length requested');
    }
}

// Ai function test 3
async function test3(model) {
    // Create random base and height values and store the true area of the triangle to check against the result
    let base = Math.floor(Math.random() * 100) / 4;
    let height = Math.floor(Math.random() * 100) / 4;
    let area = (base * height) / 2;


    const result = await aiFunction({
        args: {
            base: base,
            height: height
        },
        functionName: 'calculate_area_of_triangle',
        description: 'Calculates the area of a triangle given its base and height.',
        funcReturn: 'float',
        temperature: 0.1,
        model: model,
        showDebug: showDebug,
    });

    console.log(`Output: ${result} | Expected: ${area}`);

    // Assert the result is a float
    if (isNaN(parseFloat(result))) {
        throw new Error('Result is not a float');
    }

    // Assert the result is equal to the expected area of the triangle
    if (parseFloat(result) !== area) {
        throw new Error(`Result is not equal to the expected area of the triangle, which is: ${area}`);
    }
}

// Ai function test 4
async function test4(model) {
    const result = await aiFunction({
        args: 10,
        functionName: 'get_nth_prime_number',
        description: 'Finds and returns the nth prime number.',
        funcReturn: 'int',
        temperature: 0,
        model: model,
        showDebug: showDebug,
    });

    console.log(`Output: ${result}`);

    // Assert the result is an integer
    if (!Number.isInteger(parseFloat(result))) {
        throw new Error('Result is not an integer');
    }

    // Assert the result is equal to the expected nth prime number
    const expectedPrimeNumber = 29;
    if (parseInt(result) !== expectedPrimeNumber) {
        throw new Error(`Result is not equal to the expected nth prime number, which is: ${expectedPrimeNumber}`);
    }
}

// Ai function test 5
async function test5(model) {
    const result = await aiFunction({
        args: ['Hello, World!', 'abc123'],
        functionName: 'encrypt_text',
        description: 'Encrypts the given text using a simple character substitution based on the provided key.',
        funcReturn: 'str',
        temperature: 0.1,
        model: model,
        showDebug: showDebug,
    });

    console.log(`Output: ${result}`);

    // Assert the result has the same length as the input text
    if (result.length !== 'Hello, World!'.length) {
        throw new Error('Result length is not equal to the input text length');
    }
}

// Ai function test 6
async function test6(model) {
    const result = await aiFunction({
        args: [
            [3, 5, 8, 15, 16]
        ],
        functionName: 'find_missing_numbers_in_list',
        description: 'Finds and returns a list of missing numbers in a given sorted list.',
        funcReturn: 'list[int]',
        temperature: 0.2,
        model: model,
        showDebug: showDebug,
        autoConvertReturn: true,
    });

    console.log(`Output: ${result}`);

    // Assert the result is an array
    if (!Array.isArray(result)) {
        throw new Error('Result is not an array');
    }

    // Assert the result array contains the expected missing numbers
    const expectedMissingNumbers = [4, 6, 7, 9, 10, 11, 12, 13, 14];
    if (!arraysEqual(result, expectedMissingNumbers)) {
        throw new Error(`Result array does not contain the expected missing numbers`);
    }
}

async function test7(model) {
    const country = 'Italy';
    const result = await aiFunction({
        args: {
            country: country
        },
        functionName: 'get_capital_city',
        description: 'This function should return the capital city of the given country.',
        funcReturn: 'str',
        temperature: 0.2,
        model: model,
        showDebug: showDebug,
    });

    console.log(`Output: ${result}`);

    // Assert the result is a string
    if (typeof result !== 'string') {
        throw new Error('Result is not a string');
    }

    // Assert the result is the correct capital city for the given country
    if (result !== 'Rome') {
        throw new Error('Result is not the correct capital city for the given country');
    }
}

async function test8(model) {
    const sentence = 'He are a good person';
    const result = await aiFunction({
        args: {
            sentence: sentence
        },
        functionName: 'correct_grammar',
        description: 'This function should correct the grammar of the given sentence.',
        funcReturn: 'str',
        temperature: 0.2,
        model: model,
        showDebug: showDebug,
    });

    console.log(`Output: ${result}`);

    // Assert the result is a string
    if (typeof result !== 'string') {
        throw new Error('Result is not a string');
    }

    // Assert the result is the grammatically correct version of the input sentence
    if (result !== 'He is a good person') {
        throw new Error('Result is not the grammatically correct version of the input sentence');
    }
}

async function test9(model) {
    const text = 'Hola, ¿cómo estás?';
    const result = await aiFunction({
        args: {
            text: text
        },
        functionName: 'detect_language',
        description: 'This function should detect the language of the provided text and return the language code.',
        funcReturn: 'str',
        temperature: 0.2,
        model: model,
        showDebug: showDebug,
    });

    console.log(`Output: ${result}`);

    // Assert the result is a string
    if (typeof result !== 'string') {
        throw new Error('Result is not a string');
    }

    // Assert the result is the correct language code for the input
    if (result !== 'es') {
        throw new Error('Result is not the correct language code for the input');
    }
}

// Ai function test 10
async function test10(model) {

    // Create random base and height values and store the true area of the triangle to check against the result
    let base = Math.floor(Math.random() * 100) / 4;
    let height = Math.floor(Math.random() * 100) / 4;
    let area = (base * height) / 2;


    const result = await aiFunction({
        args: {
            operation: "Calculate the area of a triangle given its base and height.",
            base: base,
            height: height
        },
        functionName: 'generate_math_formula',
        description: 'Return only the math formula for the given operation using all available parameters. The formula format must be valid to be evaluated by mathjs with all necessary numbers and operators',
        funcReturn: 'dict[formula:str]',
        temperature: 0.1,
        model: model,
        showDebug: showDebug,
    });

    let areaGpt = math.evaluate(result.formula);

    console.log(`Output: ${areaGpt} | Expected: ${area} | Math expression: ${result.formula}`);

    // Assert the result is a float
    if (isNaN(parseFloat(areaGpt))) {
        throw new Error('Result is not a float');
    }

    // Assert the result is equal to the expected area of the triangle
    if (parseFloat(areaGpt) !== area) {
        throw new Error(`Result is not equal to the expected area of the triangle, which is: ${area}`);
    }
}
// Ai function test 11
async function test11(model) {
    // Complex calculation without mathjs help: Calculate the approximate surface area of an ellipsoid

    const a = Math.floor(Math.random() * 100) / 4;
    const b = Math.floor(Math.random() * 100) / 4;
    const c = Math.floor(Math.random() * 100) / 4;

    const p = 1.6; // A common value used for the approximation
    const surfaceArea = 4 * Math.PI * Math.pow((Math.pow(a * b, p) + Math.pow(a * c, p) + Math.pow(b * c, p)) / 3, 1 / p);

    const result = await aiFunction({
        args: {
            a: a,
            b: b,
            c: c
        },
        functionName: 'calculate_ellipsoid_surface_area',
        description: 'Calculates the approximate surface area of an ellipsoid given its semi-major axes a, b, and c.',
        funcReturn: 'float',
        temperature: 0.1,
        model: model,
        showDebug: showDebug,
    });

    console.log(`Output: ${result} | Expected: ${surfaceArea}`);

    // Assert the result is a float
    if (isNaN(parseFloat(result))) {
        throw new Error('Result is not a float');
    }

    // Assert the result is equal to the expected surface area of the ellipsoid
    if (Math.abs(parseFloat(result) - surfaceArea) > 0.01) {
        throw new Error(`Result is not equal to the expected surface area of the ellipsoid, which is: ${surfaceArea}`);
    }
}
// Ai function test 12
async function test12(model) {
    // Complex calculation with mathjs help: Calculate the approximate surface area of an ellipsoid

    const a = Math.floor(Math.random() * 100) / 4;
    const b = Math.floor(Math.random() * 100) / 4;
    const c = Math.floor(Math.random() * 100) / 4;

    const p = 1.6; // A common value used for the approximation
    const surfaceArea = 4 * Math.PI * Math.pow((Math.pow(a * b, p) + Math.pow(a * c, p) + Math.pow(b * c, p)) / 3, 1 / p);

    const result = await aiFunction({
        args: {
            operation: "Calculate the approximate surface area of an ellipsoid given its semi-major axes a, b, and c.",
            a: a,
            b: b,
            c: c
        },
        functionName: 'generate_math_formula',
        description: `Return the full math formula for the given operation. The formula must be valid to be evaluated by mathjs. Don't use "**" operator, use "pow" function instead. And give a full explanation of how you calculate the result.`,
        funcReturn: 'dict[formula:str, scope:dict, explanation:str]',
        temperature: 0.1,
        model: model,
        showDebug: showDebug,
    });
    // console.log(result);

    // We ask explanation to the AI to help him to find the correct formula even if we don't use it to calculate the result

    const surfaceAreaGpt = math.evaluate(result.formula, result.scope);

    console.log(`Output: ${surfaceAreaGpt} | Expected: ${surfaceArea} | Math expression: ${result.formula} | Scope: ${JSON.stringify(result.scope)} | Explanation: ${result.explanation}`);

    // Assert the result is a float
    if (isNaN(parseFloat(surfaceAreaGpt))) {
        throw new Error('Result is not a float');
    }

    // Assert the result is equal to the expected surface area of the ellipsoid
    if (Math.abs(parseFloat(surfaceAreaGpt) - surfaceArea) > 0.01) {
        throw new Error(`Result is not equal to the expected surface area of the ellipsoid, which is: ${surfaceAreaGpt}`);
    }
}


// Helper function to check if two arrays are equal
function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}
// Run the tests for both GPT-4 and GPT-3.5-turbo
// runTests('gpt-4');
runTests('gpt-3.5-turbo');