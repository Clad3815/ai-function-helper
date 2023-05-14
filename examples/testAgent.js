import {
    search,
    SafeSearchType
} from 'duck-duck-scrape';

import {
    SerpAPI,
    Tool
} from "langchain/tools";

import {
    Calculator
} from "langchain/tools/calculator";

import {
    createAiFunctionInstance,
    WebBrowserTool
} from '../src/aiFunction.js';


import * as dotenv from "dotenv";

dotenv.config();


const aiFunction = createAiFunctionInstance(
    process.env.OPENAI_API_KEY
);


class DDG extends Tool {
    name = "search";
    async _call(input) {
        try {
            let googleResult = await search(input, {
                safeSearch: SafeSearchType.STRICT
            });

            googleResult = googleResult.results.slice(0, 5);
            googleResult = googleResult.map(({
                title,
                description,
                url
            }) => ({
                title,
                body: description.replace(/<.*?>/g, ''),
                href: url

            }));
            return JSON.stringify(googleResult);
        } catch (error) {
            return "No good search result found";
        }
    }
    description = `a search engine. useful for when you need to answer questions about current events. input should be a search query.`;
}

(async () => {
    const options = {
        description: 'Return a dictionnary with all data got from the agent',
        temperature: 0,
        funcReturn: 'dict[population:float, populationMultiply:float, country:str, president:str, sources:list[str]]',
        functionName: 'make_dict',
        showDebug: true,
        agentArgs: {
            agentType: 'chat-zero-shot-react-description',
            agentTask: 'What is the president of the smallest country in the world? And what is the population and the name of this country? And what is the number if we multiply the population of the city by itself ? You have to show your sources also and be sure of your answer.',
            agentTools: [
                new DDG(),
                new Calculator(),
                WebBrowserTool(),
            ]
        },
    };
    const optionsStream = {
        ...options,
        useInternalStream: true
    };

    await aiFunction(optionsStream)
        .then(response => {
            console.log('AI response:', response);
        })
        .catch(err => {
            console.error('An error occurred:', err);
        });

})();
