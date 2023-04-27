const { createAiFunctionInstance } = require('../src/aiFunction');
const path = require('path')
require('dotenv').config();
const aiFunction = createAiFunctionInstance(process.env.OPENAI_API_KEY);

async function detectTaskListFromInput(input, language = "en") {
    let options;
    options = {
        functionName: 'detect_task_list',
        args: {
            input: input,
            language: language,
        },
        description: `
        As an AI model, your task is to generate a detailed and coherent task list that outlines the logical steps necessary to accomplish a specific action from the given input.The task list should be presented as text and should not be executed by you.

        You have a set of actions available to you:

            1. Searching on Google
        2. Extracting content from the summary of a Google search result
        3. Accessing a URL(
            for instance, the URL of a Google search result when the summary is relevant but lacks comprehensive information)
        4. Searching on Wikipedia
        5. Writing to a file

        Use these actions to construct a sequence of tasks that would effectively achieve the desired result from the input.Make sure to include any necessary decision - making points in the task list, such as whether the summary from a Google search provides enough information or
        if it 's necessary to access the full URL.

        Your output should follow the format of the example below:

            Input: "What is the weather in Paris?"

        Output:
            "To find out the current weather in Paris, the following steps would be taken:
        1. Search on Google
        for 'weather in Paris'.
        2. Extract the content from the summary of the Google search result.
        3. Check
        if the information provided in the summary is sufficient.
        4. If not, access the URL of the Google search result to gather more information.
        "

        Please note that the task list should be adaptable to a variety of inputs, not just the example provided.Generate a task list that is clear, logical, and provides a comprehensive guide to achieving the desired result from any given input.

        `,
        temperature: 0,
        funcReturn: 'str',
    }
    return await aiFunction(options);
}

async function detectCommandFromInput(input, language = "en") {
    let options;
    options = {
        functionName: 'detect_appropriate_command',
        args: {
            input: input,
            language: language,
        },
        description: `
Your task is to effectively discern the type of data required based on a user's query. You have access to three commands:
1. google: To search on Google and return real-time data or answers to general queries (Argument: query)
2. wikipedia: To search on Wikipedia and return detailed, encyclopedic data (Argument: query)
3. write_to_file: To write any data to a file (Argument: file_name, data_to_write)

You must determine which command, if any, is appropriate for each query and provide the command along with its argument(s).

Please note that some information, particularly historical data or widely accepted facts, may already be within your internal knowledge and does not require a real-time data fetch. In such cases, use your internal knowledge to provide the answer, and fill command_data with an empty dictionary.

For example:
Query: When was the Second World War?
Answer: The Second World War was from 1939 to 1945. Command_data: {}

When real-time, current, or location-specific data is needed, use the 'google' command with an SEO-friendly query to maximize accuracy.

For example:
Query: What is the weather in Paris?
Answer: I need to check the weather in Paris on Google, wait a moment.
Command_data: {'command': 'google', 'args': 'current weather in Paris', find_content: 'Find and parse current weather in Paris'}

When detailed, encyclopedic information is required, such as historical events, biographies, or scientific concepts, use the 'wikipedia' command.

For example:
Query: Tell me about the history of the Eiffel Tower.
Answer: I will find more information on Wikipedia about that, wait a moment.
Command_data: {'command': 'wikipedia', 'args': 'history of the Eiffel Tower'}

For requests involving the 'write_to_file' command, make sure to first generate or retrieve the required data before writing it to the file. This can be achieved through internal knowledge, or by using the 'google' or 'wikipedia' command.

For example:
Query: Create a file 'text.txt' containing a list of all countries in the world, one per line.
Answer: I will first retrieve the list of all countries and then write it to a file, wait a moment.
Command_data: {'stage_1': {'command': 'google', 'args': 'list of all countries', find_content: 'Find a list of all country in the world'}, 'stage_2': {'command': 'write_to_file', 'args': { name: 'text.txt', data:'stage_1.output'}}}

Query: Create a file 'text.txt' which contain a list of 5 random number, one per line
Answer: I have generated a list of 5 random numbers and written it to the file "text.txt".
Command_data: {'command': 'write_to_file', 'args': { name: 'text.txt', data:'1\n2\n3\n4\n5\n'} }

Your task is to distinguish between queries that require real-time data, detailed data, and those that can be answered using your existing knowledge. Choose the most effective source or approach for each, and ensure the data is properly generated or retrieved before using the 'write_to_file' command.


        `,
        temperature: 0,
        funcReturn: 'dict[answer: str, command_data: dict]',
    };

    const agentJS = await aiFunction(options);
    return agentJS;
}
(async() => {

    let result;
    // result = await detectCommandFromInput("Do you know the price of a Clio 4 ?", "fr");
    // console.log(result);

    // result = await detectCommandFromInput("What is the biggest country in the world ?", "en");
    // console.log(result);

    // result = await detectCommandFromInput("When happen the second world war ?", "en");
    // console.log(result);

    // result = await detectCommandFromInput("How many people live in France ?", "fr");
    // console.log(result);

    // result = await detectCommandFromInput("Who is Baudelaire ?", "fr");
    // console.log(result);

    // result = await detectCommandFromInput("Create a file 'text.txt' which contain a list of all country of the world, one per line", "fr");
    // console.log(JSON.stringify(result, null, 2));

    // result = await detectCommandFromInput("Create a file 'text.txt' which contain a list of 50 random number, one per line", "fr");
    // console.log(JSON.stringify(result, null, 2));


    result = await detectTaskListFromInput("Create a file 'text.txt' which contain a list of 50 random number, one per line", "en");
    console.log(result);

    result = await detectTaskListFromInput("What is the weather in Paris ?", "fr");
    console.log(result);





})();