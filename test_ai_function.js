const aiFunction = require('./src/aiFunction.js');

const showDebug = false;
const numTestToRun = 10;


// Initialize the OpenAI API client
// Make sure to set the OPENAI_API_KEY environment variable

// Run all tests, print the results, and return the number of failed tests
async function runTests(model) {
    const testFunctions = [test1, test2, test3, test4, test5, test6];
    const testNames = [
        'Generate fake people',
        'Generate Random Password',
        'Calculate area of triangle',
        'Calculate the nth prime number',
        'Encrypt text',
        'Find missing numbers',
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
    const result = await aiFunction({
        args: 4,
        functionName: 'fake_people',
        description: 'Generates n examples of fake data representing people, each with a name and an age.',
        funcReturn: 'list[dict]',
        temperature: 1,
        model,
        showDebug: showDebug,
        convertToJson: true,
    });

    console.log(`Output: ${JSON.stringify(result)}`);

    // Assert the result is a list of dictionaries
    if (!Array.isArray(result)) {
        throw new Error('Result is not an array');
    }

    // Assert the length of the result is equal to the number of people requested
    if (result.length !== 4) {
        throw new Error('Result length is not equal to the number of people requested');
    }
}

// Ai function test 2
async function test2(model) {
    const result = await aiFunction({
        args: [12, false],
        // functionName: 'random_password_generator',
        description: 'Generates a random password of given length with or without special characters. The default length is 12 and the default is to include special characters. The password is returned as a string.',
        funcReturn: 'str',
        temperature: 1,
        model,
        showDebug: showDebug,
    });

    console.log(`Output: ${result}`);

    // Assert the length of the result is equal to the length requested
    if (result.length !== 12) {
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
        temperature: 0,
        model,
        showDebug: showDebug,
    });

    console.log(`Output: ${result}`);

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
        model,
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
        temperature: 0,
        model,
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
        temperature: 0,
        model,
        showDebug: showDebug,
        convertToJson: true,
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